import { Badge } from '@/components/atomic/badge';
import { pricingService, type PricingPlan } from '@/services/pricing/pricing.service';
import { useEffect, useState } from 'react';
import Invoice from './invoice';

const formatMoney = (amount: number, currency = 'USD') => {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
};

const PlanBilling = () => {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await pricingService.listPlans(true);
        if (!alive) return;
        setPlans(res ?? []);
      } catch (e: any) {
        if (!alive) return;
        const msg = e?.response?.data?.message || e?.message || 'Failed to load plans';
        setError(String(msg));
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className='space-y-4 md:space-y-10'>
            <div>
                <h5>Business</h5>
                <p>View and update your business details</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h5>Available plans</h5>
                  <p className="text-text-sub-600">Choose a plan that fits your team.</p>
                </div>
                {loading && <span className="text-text-sub-600 text-sm">Loading…</span>}
              </div>
              {error && <div className="text-destructive text-sm">{error}</div>}
              <div className="flex flex-col md:flex-row gap-3 flex-wrap">
                {plans.map((plan) => (
                  <div
                    key={String(plan.id)}
                    className="p-4 min-w-[260px] space-y-3 bg-background-white-0 rounded-md border border-stroke-soft-200"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h5>{plan.label || plan.name}</h5>
                        <p className="text-text-sub-600">{plan.description || '—'}</p>
                      </div>
                      <Badge variant={'secondary'}>{plan.billing_cycle || 'plan'}</Badge>
                    </div>
                    <div className="text-lg font-medium">
                      {formatMoney(plan.price, 'USD')}
                      <span className="text-sm font-normal text-text-sub-600">
                        {plan.billing_cycle ? ` / ${plan.billing_cycle}` : ''}
                      </span>
                    </div>
                  </div>
                ))}
                {!loading && !error && plans.length === 0 && (
                  <div className="text-text-sub-600 text-sm">No active plans available.</div>
                )}
              </div>
            </div>
            
            <Invoice/>
    </div>
  )
}

export default PlanBilling