import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { marketService } from '@/services/market/market.service';
import type { MarketItemDto } from '@/services/market/market.service';

const normalizePlanValue = (value?: string | number | null) =>
  String(value ?? '')
    .trim()
    .toLowerCase();

const canonicalizePlan = (value?: string | number | null) => {
  const normalized = normalizePlanValue(value);
  if (!normalized) return '';
  return normalized.replace(/^plan[_-]?/, '');
};

type CategoryPlanOption = {
  planId: number;
  code?: string;
  label?: string | null;
  price: number;
  unit?: string;
};

export type WizardCategory = {
  id: number | string;
  title: string;
  description?: string;
  price?: number | string;
  unit?: string;
  badges?: string[];
  qty?: number | string;
  planId?: number;
  planOptions?: CategoryPlanOption[];
};

type SelectionItem = {
  categoryId: number | string;
  qty: number;
  instanceId: string;
};

type WizardState = {
  categories: WizardCategory[];
  selected: SelectionItem[];
  plan?: string;
  planRate?: number;
  creditLimit?: number;
  shifts: { key: string; title: string; start?: string; end?: string }[];
  shiftAssignments: Record<string, Array<number | string>>;
  shiftSeatAssignments: Record<string, Record<string, string>>;
  agreement: { signed: boolean; signer?: { fullName?: string; email?: string; company?: string; date?: string } };
  currentStep: number;
  isLoading: boolean;
  error: string | null;
};

const initialState: WizardState = {
  categories: [],
  selected: [],
  shiftAssignments: { morning: [], evening: [], night: [] },
  shiftSeatAssignments: { morning: {}, evening: {}, night: {} },
  shifts: [
    { key: 'morning', title: 'Morning', start: '09:00', end: '17:00' },
    { key: 'evening', title: 'Evening', start: '13:00', end: '21:00' },
    { key: 'night', title: 'Night', start: '21:00', end: '05:00' },
  ],
  agreement: { signed: false },
  plan: 'pro',
  planRate: undefined,
  creditLimit: 0,
  currentStep: 0,
  isLoading: false,
  error: null,
};

const formatUnit = (billingCycle?: string) => {
  if (!billingCycle) return '/ day';
  return `/ ${billingCycle.toLowerCase()}`;
};

const toWizardCategories = (
  items: MarketItemDto[],
  categoryLabels: Map<number, string>,
): WizardCategory[] => {
  return items.map((item) => {
    const itemPlans = item.itemPlans ?? [];
    const planOptions: CategoryPlanOption[] = itemPlans.map((plan) => {
      const pricePlan = plan.pricePlan;
      return {
        planId: plan.id,
        code: pricePlan?.name ?? '',
        label: pricePlan?.label ?? undefined,
        price: Number(pricePlan?.price ?? 0),
        unit: formatUnit(pricePlan?.billing_cycle),
      };
    });

    const activePlan =
      itemPlans.find(
        (plan) => plan.status?.toLowerCase() === 'active'.toLowerCase(),
      ) ?? itemPlans[0];

    const activePlanOption = activePlan
      ? planOptions.find((option) => option.planId === activePlan.id)
      : planOptions[0];

    const pricePlan = activePlan?.pricePlan;
    const categoryLabel = categoryLabels.get(item.market_category_id);

    const badges = [categoryLabel, activePlanOption?.label ?? pricePlan?.label].filter(
      (badge): badge is string => Boolean(badge),
    );

    return {
      id: item.id,
      title: item.name,
      description: item.description ?? '',
      price: activePlanOption?.price ?? Number(pricePlan?.price ?? 0),
      unit: activePlanOption?.unit ?? formatUnit(pricePlan?.billing_cycle),
      badges,
      qty: 0,
      planId: activePlanOption?.planId,
      planOptions,
    };
  });
};

const isPlanMatch = (candidate?: string | null, selected?: string | number | null) => {
  const normalizedCandidate = normalizePlanValue(candidate);
  const normalizedSelection = normalizePlanValue(selected);

  if (!normalizedCandidate || !normalizedSelection) {
    return false;
  }

  if (normalizedCandidate === normalizedSelection) {
    return true;
  }

  const canonicalCandidate = canonicalizePlan(candidate);
  const canonicalSelection = canonicalizePlan(selected);

  return Boolean(canonicalCandidate && canonicalCandidate === canonicalSelection);
};

const applyPlanSelection = (
  categories: WizardCategory[],
  selectedPlan?: string,
  planRate?: number,
) => {
  if (!categories || categories.length === 0) return;

  categories.forEach((category) => {
    if (!category.planOptions || category.planOptions.length === 0) {
      if (planRate !== undefined && planRate !== null) {
        category.price = planRate;
        category.unit = category.unit ?? '/ day';
      }
      return;
    }

    const target = selectedPlan
      ? category.planOptions.find(
          (option) =>
            isPlanMatch(option.code, selectedPlan) ||
            isPlanMatch(option.label ?? undefined, selectedPlan),
        )
      : undefined;

    const resolvedOption = target ?? category.planOptions[0];
    if (!resolvedOption) return;

    if (planRate !== undefined && planRate !== null) {
      category.price = planRate;
      category.unit = resolvedOption.unit ?? category.unit ?? '/ day';
    } else {
      category.price = resolvedOption.price;
      category.unit = resolvedOption.unit ?? category.unit;
    }
    category.planId = resolvedOption.planId;
  });
};

const derivePlanRateFromCategories = (
  categories: WizardCategory[],
  selectedPlan?: string,
): number | undefined => {
  if (!categories || categories.length === 0 || !selectedPlan) return undefined;
  for (const category of categories) {
    if (!category.planOptions) continue;
    const match = category.planOptions.find(
      (option) =>
        isPlanMatch(option.code, selectedPlan) ||
        isPlanMatch(option.label ?? undefined, selectedPlan),
    );
    if (match) return match.price;
  }
  return undefined;
};

const getErrorMessage = (err: unknown, fallback = 'Something went wrong') => {
  if (typeof err === 'string') return err;
  if (err && typeof err === 'object' && 'message' in err) {
    return String((err as { message?: unknown }).message ?? fallback);
  }
  return fallback;
};

export const fetchWizardCategories = createAsyncThunk<
  WizardCategory[],
  void,
  { rejectValue: string }
>('wizard/fetchCategories', async (_: void, thunkAPI) => {
  try {
    const [categoryResult, itemResult] = await Promise.all([
      marketService.listCategories({ limit: 100, page: 1 }),
      marketService.listItems({ limit: 100, page: 1 }),
    ]);

    if (!itemResult || itemResult.length === 0) {
      throw new Error('No market items available. Please seed the database.');
    }

    const categoryLabelMap = new Map<number, string>();
    categoryResult.forEach((cat) => {
      categoryLabelMap.set(cat.id, cat.label ?? cat.name);
    });

    return toWizardCategories(itemResult, categoryLabelMap);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, 'Failed to load categories'),
    );
  }
});

export const fetchWizardShifts = createAsyncThunk('wizard/fetchShifts', async () => {
  // simulate fetching shifts from an API
  await new Promise((r) => setTimeout(r, 150));
  return [
    { key: 'morning', title: 'Morning', start: '09:00', end: '17:00' },
    { key: 'evening', title: 'Evening', start: '13:00', end: '21:00' },
    { key: 'night', title: 'Night', start: '21:00', end: '05:00' },
  ];
});

const wizardSlice = createSlice({
  name: 'wizard',
  initialState,
  reducers: {
    addSelection: (state, action: PayloadAction<{ categoryId: number | string; qty?: number }>) => {
      const { categoryId, qty = 1 } = action.payload;
      // build prospective selection set: push a new record for this add
      const prospective = [...state.selected.map((s) => ({ ...s })), { categoryId, qty }];
      state.error = null;
      // push a new selection entry (do not merge with existing)
      // generate a stable instanceId for this selection
      const instanceId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
      state.selected.push({ categoryId, qty, instanceId });
    },
    addShiftAssignment: (state, action: PayloadAction<{ shift: string; categoryId: number | string }>) => {
      const { shift, categoryId } = action.payload;
      // If categoryId is a composite instance key (contains ':'), allow it to exist in multiple shifts.
      const isCompositeInstance = String(categoryId).includes(':');
      if (!isCompositeInstance) {
        // remove from any other shift first (only for plain category ids)
        Object.keys(state.shiftAssignments).forEach((s) => {
          if (s === shift) return;
          state.shiftAssignments[s] = state.shiftAssignments[s].filter((id) => String(id) !== String(categoryId));
        });
      }
      const arr = state.shiftAssignments[shift] ?? [];
      if (!arr.find((id) => String(id) === String(categoryId))) {
        state.shiftAssignments[shift] = [...arr, categoryId];
      }
    },
    setSeatAssignment: (state, action: PayloadAction<{ shift: string; seatId: string; categoryId?: number | string }>) => {
      const { shift, seatId, categoryId } = action.payload;
      const map = state.shiftSeatAssignments[shift] ?? {};

      // if categoryId is not provided or null, remove assignment
      if (categoryId === undefined || categoryId === null) {
        if (map && map[seatId] !== undefined) delete map[seatId];
        state.shiftSeatAssignments[shift] = { ...map };
        return;
      }

      // assign: store composite identifier (categoryId:instanceId) as string so each instance maps uniquely
      map[seatId] = String(categoryId as any);
      state.shiftSeatAssignments[shift] = { ...map };
    },
    removeSeatAssignment: (state, action: PayloadAction<{ shift: string; seatId: string }>) => {
      const { shift, seatId } = action.payload;
      const map = state.shiftSeatAssignments[shift] ?? {};
      if (map && map[seatId] !== undefined) {
        delete map[seatId];
        state.shiftSeatAssignments[shift] = { ...map };
      }
    },
    removeShiftAssignment: (state, action: PayloadAction<{ shift: string; categoryId: number | string }>) => {
      const { shift, categoryId } = action.payload;
      state.shiftAssignments[shift] = (state.shiftAssignments[shift] ?? []).filter((id) => String(id) !== String(categoryId));
    },
    removeSelection: (state, action: PayloadAction<{ instanceId: string }>) => {
      // remove a single occurrence by instanceId
      const idx = state.selected.findIndex((s) => String(s.instanceId) === String(action.payload.instanceId));
      if (idx >= 0) state.selected.splice(idx, 1);
    },
    setQty: (state, action: PayloadAction<{ instanceId: string; qty: number; categoryId?: number | string }>) => {
      const { instanceId, qty, categoryId } = action.payload;
      const prospective = state.selected.map((s) => ({ ...s }));
      const idx = prospective.findIndex((s) => String(s.instanceId) === String(instanceId));
      if (idx >= 0) prospective[idx].qty = qty;
      else {
        // fallback: if instanceId not found, try to preserve behavior by updating first matching category
        const idxByCat = categoryId !== undefined ? prospective.findIndex((s) => String(s.categoryId) === String(categoryId)) : -1;
        if (idxByCat >= 0) prospective[idxByCat].qty = qty;
        else prospective.push({ categoryId: categoryId ?? '', qty, instanceId: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}` as string });
      }

      state.error = null;
      const item = state.selected.find((s) => String(s.instanceId) === String(instanceId) || (categoryId !== undefined && s.categoryId === categoryId));
      if (item) item.qty = qty as any;
    },
    setPlan: (state, action: PayloadAction<string>) => {
      state.plan = action.payload;
      if (state.planRate === undefined || state.planRate === null) {
        const derived = derivePlanRateFromCategories(state.categories, state.plan);
        if (derived !== undefined) {
          state.planRate = derived;
        }
      }
      applyPlanSelection(state.categories, state.plan, state.planRate);
    },
    setPlanRate: (state, action: PayloadAction<number | undefined>) => {
      state.planRate = action.payload;
      applyPlanSelection(state.categories, state.plan, state.planRate);
    },
    setCreditLimit: (state, action: PayloadAction<number>) => {
      state.creditLimit = action.payload;
    },
    setStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    clearSelection: (state) => {
      state.selected = [];
    },
    setAgreement: (state, action: PayloadAction<{ signed: boolean; signer?: { fullName?: string; email?: string; company?: string; date?: string } }>) => {
      state.agreement = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWizardCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWizardCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
        if (state.planRate === undefined || state.planRate === null) {
          const derived = derivePlanRateFromCategories(state.categories, state.plan);
          if (derived !== undefined) {
            state.planRate = derived;
          }
        }
        applyPlanSelection(state.categories, state.plan, state.planRate);
      })
      .addCase(fetchWizardCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) ??
          action.error?.message ??
          'Failed to load categories';
      });
    builder
      .addCase(fetchWizardShifts.fulfilled, (state, action) => {
        state.shifts = action.payload as any;
      })
      .addCase(fetchWizardShifts.rejected, (state) => {
        // keep defaults on error
      });
  },
});

export const {
  addSelection,
  removeSelection,
  setQty,
  setStep,
  clearSelection,
  addShiftAssignment,
  removeShiftAssignment,
  setSeatAssignment,
  removeSeatAssignment,
  setAgreement,
  setPlan,
  setPlanRate,
  setCreditLimit,
} = wizardSlice.actions;
export default wizardSlice.reducer;
