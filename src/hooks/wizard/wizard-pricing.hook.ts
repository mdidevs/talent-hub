import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectWizardCategories, selectWizardSelected } from '@/store/wizard/wizard.selector';

export type WizardLineItem = {
  id: string;
  title: string;
  qty: number;
  unitPrice: number;
  subtotal: number;
  unitLabel?: string;
  planId?: number;
};

export type WizardOrderItemPayload = {
  market_item_plan_id: number;
  quantity: number;
  unit_price: number;
};

const DEFAULT_CURRENCY = 'USD';

export const useWizardPricing = () => {
  const categories = useSelector(selectWizardCategories);
  const selections = useSelector(selectWizardSelected);

  return useMemo(() => {
    const lineItems: WizardLineItem[] = [];
    const orderItems: WizardOrderItemPayload[] = [];

    selections.forEach((selection) => {
      const category = categories.find((c) => String(c.id) === String(selection.categoryId));
      if (!category) return;

      const qty = Number(selection.qty ?? 0);
      const unitPrice = Number(category.price ?? 0);
      const subtotal = qty * unitPrice;

      lineItems.push({
        id: String(selection.instanceId ?? selection.categoryId),
        title: category.title ?? `Role ${category.id}`,
        qty,
        unitPrice,
        subtotal,
        unitLabel: category.unit ? String(category.unit) : undefined,
        planId: category.planId,
      });

      if (category.planId && qty > 0) {
        orderItems.push({
          market_item_plan_id: Number(category.planId),
          quantity: Math.max(1, qty),
          unit_price: Number(unitPrice),
        });
      }
    });

    const subtotal = lineItems.reduce((sum, item) => sum + item.subtotal, 0);
    const seats = lineItems.reduce((sum, item) => sum + (Number.isFinite(item.qty) ? item.qty : 0), 0);
    const currency = DEFAULT_CURRENCY;

    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    });

    return {
      lineItems,
      orderItems,
      subtotal,
      totalSeats: seats,
      currency,
      hasSelections: lineItems.length > 0,
      formatAmount: (value: number) => formatter.format(Number(value) || 0),
    };
  }, [categories, selections]);
};

export type WizardPricingSnapshot = ReturnType<typeof useWizardPricing>;
