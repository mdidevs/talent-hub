import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/store';
import { fetchWizardCategories, fetchWizardShifts, addSelection, removeSelection, setQty, setStep, clearSelection } from '@/store/wizard/wizard.slice';
import { selectWizardCategories, selectWizardSelected, selectWizardStep, selectWizardLoading, selectWizardError } from '@/store/wizard/wizard.selector';

export const useWizard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector((s: RootState) => selectWizardCategories(s));
  const selected = useSelector((s: RootState) => selectWizardSelected(s));
  const step = useSelector((s: RootState) => selectWizardStep(s));
  const isLoading = useSelector((s: RootState) => selectWizardLoading(s));
  const error = useSelector((s: RootState) => selectWizardError(s));

  const load = useCallback(() => dispatch(fetchWizardCategories()), [dispatch]);
  const add = useCallback((categoryId: number | string, qty = 1) => dispatch(addSelection({ categoryId, qty })), [dispatch]);
  const remove = useCallback((categoryId: number | string) => dispatch(removeSelection({ categoryId })), [dispatch]);
  const updateQty = useCallback((categoryId: number | string, qty: number) => dispatch(setQty({ categoryId, qty })), [dispatch]);
  const goTo = useCallback((n: number) => dispatch(setStep(n)), [dispatch]);
  const next = useCallback(() => dispatch(setStep(step + 1)), [dispatch, step]);
  const prev = useCallback(() => dispatch(setStep(Math.max(0, step - 1))), [dispatch, step]);
  const clear = useCallback(() => dispatch(clearSelection()), [dispatch]);

  useEffect(() => {
    if (!categories || categories.length === 0) load();
    // also ensure shifts metadata is loaded
    dispatch(fetchWizardShifts());
  }, [categories, load]);

  return { categories, selected, step, isLoading, error, load, add, remove, updateQty, goTo, next, prev, clear } as const;
};

export default useWizard;
