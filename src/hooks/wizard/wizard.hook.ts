import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/store';
import { fetchWizardCategories, fetchWizardShifts, addSelection, removeSelection, setQty, setStep, clearSelection, setPlan, setPlanRate, setCreditLimit } from '@/store/wizard/wizard.slice';
import { selectWizardCategories, selectWizardSelected, selectWizardStep, selectWizardLoading, selectWizardError, selectWizardPlan, selectWizardCreditLimit } from '@/store/wizard/wizard.selector';

export const useWizard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector((s: RootState) => selectWizardCategories(s));
  const selected = useSelector((s: RootState) => selectWizardSelected(s));
  const step = useSelector((s: RootState) => selectWizardStep(s));
  const plan = useSelector((s: RootState) => selectWizardPlan(s));
  const creditLimit = useSelector((s: RootState) => selectWizardCreditLimit(s));
  const isLoading = useSelector((s: RootState) => selectWizardLoading(s));
  const error = useSelector((s: RootState) => selectWizardError(s));

  const load = useCallback(() => dispatch(fetchWizardCategories()), [dispatch]);
  const add = useCallback((categoryId: number | string, qty = 1) => dispatch(addSelection({ categoryId, qty })), [dispatch]);
  const remove = useCallback(
    (identifier: string | number) => {
      const identifierStr = String(identifier);
      const matchByInstance = selected.find(
        (s) => String(s.instanceId) === identifierStr,
      );
      const matchByCategory = selected.find(
        (s) => String(s.categoryId) === identifierStr,
      );
      const target = matchByInstance ?? matchByCategory;
      if (!target) return;
      dispatch(removeSelection({ instanceId: target.instanceId }));
    },
    [dispatch, selected],
  );
  const updateQty = useCallback((instanceId: string, qty: number, categoryId?: number | string) => dispatch(setQty({ instanceId, qty, categoryId } as any)), [dispatch]);
  const choosePlan = useCallback((p: string) => dispatch(setPlan(p)), [dispatch]);
  const choosePlanRate = useCallback((price?: number) => dispatch(setPlanRate(price)), [dispatch]);
  const setCredit = useCallback((amount: number) => dispatch(setCreditLimit(amount)), [dispatch]);
  
  const goTo = useCallback((n: number) => dispatch(setStep(n)), [dispatch]);
  const next = useCallback(() => dispatch(setStep(step + 1)), [dispatch, step]);
  const prev = useCallback(() => dispatch(setStep(Math.max(0, step - 1))), [dispatch, step]);
  const clear = useCallback(() => dispatch(clearSelection()), [dispatch]);

  useEffect(() => {
    if (!categories || categories.length === 0) load();
    // also ensure shifts metadata is loaded
    dispatch(fetchWizardShifts());
  }, [categories, load]);

  return { categories, selected, step, plan, creditLimit, isLoading, error, load, add, remove, updateQty, choosePlan, choosePlanRate, setCredit, goTo, next, prev, clear } as const;
};

export default useWizard;
