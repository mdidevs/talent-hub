import type { RootState } from '@/store/store';

export const selectWizard = (state: RootState) => state.wizard;
export const selectWizardCategories = (state: RootState) => state.wizard.categories;
export const selectWizardSelected = (state: RootState) => state.wizard.selected;
export const selectWizardShiftAssignments = (state: RootState) => (state.wizard as any).shiftAssignments as Record<string, Array<number | string>>;
export const selectWizardSeatAssignments = (state: RootState) => (state.wizard as any).shiftSeatAssignments as Record<string, Record<string, number>>;
export const selectWizardStep = (state: RootState) => state.wizard.currentStep;
export const selectWizardLoading = (state: RootState) => state.wizard.isLoading;
export const selectWizardError = (state: RootState) => state.wizard.error;

export default selectWizard;
