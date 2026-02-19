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
};

type WizardState = {
  categories: WizardCategory[];
  selected: SelectionItem[];
  shifts: { key: string; title: string; start?: string; end?: string }[];
  shiftAssignments: Record<string, Array<number | string>>;
  shiftSeatAssignments: Record<string, Record<string, number>>;
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
      const existing = state.selected.find((s) => s.categoryId === categoryId);
      if (existing) {
        // replace stored qty with the provided qty (keep sane, predictable value)
        existing.qty = qty;
      } else {
        state.selected.push({ categoryId, qty });
      }
    },
    addShiftAssignment: (state, action: PayloadAction<{ shift: string; categoryId: number | string }>) => {
      const { shift, categoryId } = action.payload;
      // remove from any other shift first
      Object.keys(state.shiftAssignments).forEach((s) => {
        if (s === shift) return;
        state.shiftAssignments[s] = state.shiftAssignments[s].filter((id) => String(id) !== String(categoryId));
      });
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

      // remove any existing seat assigned to this category within the shift
      Object.entries(map).forEach(([sId, cId]) => {
        if (String(cId) === String(categoryId)) {
          delete map[sId];
        }
      });

      // assign
      map[seatId] = Number(categoryId as any);
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
    removeSelection: (state, action: PayloadAction<{ categoryId: number | string }>) => {
      state.selected = state.selected.filter((s) => s.categoryId !== action.payload.categoryId);
    },
    setQty: (state, action: PayloadAction<{ categoryId: number | string; qty: number }>) => {
      const item = state.selected.find((s) => s.categoryId === action.payload.categoryId);
      if (item) item.qty = action.payload.qty;
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

export const { addSelection, removeSelection, setQty, setStep, clearSelection, addShiftAssignment, removeShiftAssignment, setSeatAssignment, removeSeatAssignment, setAgreement } = wizardSlice.actions;
export default wizardSlice.reducer;
