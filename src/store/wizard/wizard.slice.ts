import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type WizardCategory = {
  id: number | string;
  title: string;
  description?: string;
  price?: number | string;
  unit?: string;
  badges?: string[];
  qty?: number | string;
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
  creditLimit: 0,
  currentStep: 0,
  isLoading: false,
  error: null,
};

export const fetchWizardCategories = createAsyncThunk<WizardCategory[]>('wizard/fetchCategories', async () => {
  const data: WizardCategory[] = [
    { id: 1, title: 'L1 Support Engineer', description: 'Tier 1 . CCNA', price: 16, unit: '/ day', badges: ['Monitoring', 'Ticketing'], qty: 0 },
    { id: 2, title: 'L2 Support Engineer', description: 'Tier 2 . CCNP', price: 22, unit: '/ day', badges: ['Monitoring', 'Escalation'], qty: 0 },
    { id: 3, title: 'Site Reliability', description: 'SRE . DevOps', price: 30, unit: '/ day', badges: ['Automation', 'Observability'], qty: 0 },
    { id: 4, title: 'Security Analyst', description: 'SOC . SIEM', price: 20, unit: '/ day', badges: ['Monitoring', 'Alerting'], qty: 0 },
  ];

  await new Promise((r) => setTimeout(r, 200));
  return data;
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
      // determine effective credit limit: explicit creditLimit >0 wins, otherwise plan defaults
      const planLimit = (state.creditLimit && state.creditLimit > 0)
        ? state.creditLimit
        : state.plan === 'pro'
          ? 200
          : state.plan === 'premium'
            ? 150
            : undefined;

      // build prospective selection set: push a new record for this add
      const prospective = [...state.selected.map((s) => ({ ...s })), { categoryId, qty }];

      // compute subtotal for prospective selections
      const subtotal = prospective.reduce((sum, s) => {
        const cat = state.categories.find((c) => String(c.id) === String(s.categoryId));
        const price = cat ? Number(cat.price ?? 0) : 0;
        return sum + price * (s.qty || 0);
      }, 0);

      if (planLimit !== undefined && subtotal > planLimit) {
        state.error = 'Credit limit exceeded';
        return;
      }

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
      const planLimit = (state.creditLimit && state.creditLimit > 0)
        ? state.creditLimit
        : state.plan === 'pro'
          ? 200
          : state.plan === 'premium'
            ? 150
            : undefined;

      const prospective = state.selected.map((s) => ({ ...s }));
      const idx = prospective.findIndex((s) => String(s.instanceId) === String(instanceId));
      if (idx >= 0) prospective[idx].qty = qty;
      else {
        // fallback: if instanceId not found, try to preserve behavior by updating first matching category
        const idxByCat = categoryId !== undefined ? prospective.findIndex((s) => String(s.categoryId) === String(categoryId)) : -1;
        if (idxByCat >= 0) prospective[idxByCat].qty = qty;
        else prospective.push({ categoryId: categoryId ?? '', qty, instanceId: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}` as string });
      }

      const subtotal = prospective.reduce((sum, s) => {
        const cat = state.categories.find((c) => String(c.id) === String(s.categoryId));
        const price = cat ? Number(cat.price ?? 0) : 0;
        return sum + price * (s.qty || 0);
      }, 0);

      if (planLimit !== undefined && subtotal > planLimit) {
        state.error = 'Credit limit exceeded';
        return;
      }

      state.error = null;
      const item = state.selected.find((s) => String(s.instanceId) === String(instanceId) || (categoryId !== undefined && s.categoryId === categoryId));
      if (item) item.qty = qty as any;
    },
    setPlan: (state, action: PayloadAction<string>) => {
      state.plan = action.payload;
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
      })
      .addCase(fetchWizardCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message ?? 'Failed to load categories';
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

export const { addSelection, removeSelection, setQty, setStep, clearSelection, addShiftAssignment, removeShiftAssignment, setSeatAssignment, removeSeatAssignment, setAgreement, setPlan, setCreditLimit } = wizardSlice.actions;
export default wizardSlice.reducer;
