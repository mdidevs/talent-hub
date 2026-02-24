import type { RootState } from '@/store/store';

export const selectWizard = (state: RootState) => state.wizard;
export const selectWizardCategories = (state: RootState) => state.wizard.categories;
export const selectWizardSelected = (state: RootState) => state.wizard.selected;
export const selectWizardShiftAssignments = (state: RootState) => (state.wizard as any).shiftAssignments as Record<string, Array<number | string>>;
export const selectWizardSeatAssignments = (state: RootState) => (state.wizard as any).shiftSeatAssignments as Record<string, Record<string, string>>;
export const selectWizardStep = (state: RootState) => state.wizard.currentStep;
export const selectWizardShifts = (state: RootState) => (state.wizard as any).shifts as Array<{ key: string; title: string; start?: string; end?: string }>;
export const selectWizardLoading = (state: RootState) => state.wizard.isLoading;
export const selectWizardAgreement = (state: RootState) => (state.wizard as any).agreement as { signed: boolean; signer?: any };
export const selectWizardError = (state: RootState) => state.wizard.error;
export const selectWizardPlan = (state: RootState) => (state.wizard as any).plan as string | undefined;
export const selectWizardCreditLimit = (state: RootState) => (state.wizard as any).creditLimit as number | undefined;

export default selectWizard;
