import { useEffect, useMemo, useState } from 'react';
import { RadioGroup } from "@/components/atomic/radio-group"
import { PlansCard } from "@/components/molecule/order/wizard/plan/PlansCard"
import useWizard from '@/hooks/wizard/wizard.hook'
import { Input } from '@/components/atomic/input'
import { pricingService, type PricingPlan } from '@/services/pricing/pricing.service'

const normalizePlanValue = (value?: string | number | null) => String(value ?? '').toLowerCase();

const getPlanDataRecord = (value?: Record<string, unknown> | null) => {
    if (!value || typeof value !== 'object') return undefined;
    return value;
};

const getNumberFromData = (data: Record<string, unknown> | undefined, ...keys: string[]) => {
    if (!data) return undefined;
    for (const key of keys) {
        const raw = data[key];
        if (typeof raw === 'number') return raw;
        if (typeof raw === 'string') {
            const parsed = Number(raw);
            if (Number.isFinite(parsed)) return parsed;
        }
    }
    return undefined;
};

const getStringFromData = (data: Record<string, unknown> | undefined, ...keys: string[]) => {
    if (!data) return undefined;
    for (const key of keys) {
        const raw = data[key];
        if (typeof raw === 'string' && raw.trim().length > 0) return raw;
    }
    return undefined;
};

const getPlanIdentifier = (plan: PricingPlan) => plan.name ?? String(plan.id);

const formatPlanPriceLabel = (plan: PricingPlan) => {
    const currency = getStringFromData(getPlanDataRecord(plan.data), 'currency') ?? 'USD';
    const priceValue = Number(plan.price ?? 0);
    const formattedPrice = priceValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    return `$${formattedPrice} ${currency.toUpperCase()}`;
};

const PlanForm = () => {
    const { selected, plan, choosePlan, choosePlanRate, creditLimit, setCredit, categories } = useWizard();
    const [plans, setPlans] = useState<PricingPlan[]>([]);
    const [plansLoading, setPlansLoading] = useState(false);
    const [plansError, setPlansError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        const loadPlans = async () => {
            setPlansLoading(true);
            try {
                const data = await pricingService.listPlans();
                if (!isMounted) return;
                setPlans(data);
                setPlansError(null);
            } catch (error) {
                if (!isMounted) return;
                const message = error instanceof Error ? error.message : 'Failed to load plans';
                setPlansError(message);
            } finally {
                if (isMounted) setPlansLoading(false);
            }
        };

        loadPlans();
        return () => {
            isMounted = false;
        };
    }, []);

    const findPlanByValue = (value: string) =>
        plans.find((p) => normalizePlanValue(getPlanIdentifier(p)) === normalizePlanValue(value));

    useEffect(() => {
        if (plans.length === 0) return;
        const hasMatch = plans.some((p) => normalizePlanValue(getPlanIdentifier(p)) === normalizePlanValue(plan));
        if (!hasMatch) {
            const fallbackPlan = plans[0];
            if (fallbackPlan) {
                const id = getPlanIdentifier(fallbackPlan);
                choosePlan(id);
                choosePlanRate(fallbackPlan.price);
            }
        } else {
            const current = findPlanByValue(plan ?? '');
            if (current) {
                choosePlanRate(current.price);
            }
        }
    }, [plans, plan, choosePlan, choosePlanRate]);

    const subtotal = selected.reduce((sum, s) => {
        const cat = categories.find((c) => String(c.id) === String(s.categoryId));
        const price = cat ? Number(cat.price ?? 0) : 0;
        return sum + price * (s.qty || 0);
    }, 0);

    const showCredit = subtotal > 0 || plan === 'team';

    const selectedPlan = useMemo(() => {
        return plans.find((p) => normalizePlanValue(getPlanIdentifier(p)) === normalizePlanValue(plan));
    }, [plans, plan]);

    const planDataRecord = getPlanDataRecord(selectedPlan?.data as Record<string, unknown> | undefined);
    const apiPlanLimit = getNumberFromData(planDataRecord, 'credit_limit', 'creditLimit');

    const planMax = apiPlanLimit ?? (plan === 'pro' ? 200 : plan === 'premium' ? 150 : undefined);

    const handlePlanChange = (v: string) => {
        choosePlan(v);
        const meta = findPlanByValue(v);
        choosePlanRate(meta?.price);
        // do not auto-set credit when selecting a plan alone; credit input appears only when subtotal>0 or team
    };

    useEffect(() => {
        if (planMax !== undefined && planMax !== null) {
            const current = Number(creditLimit ?? 0);
            if (current !== planMax) {
                setCredit(planMax);
            }
        }
    }, [planMax, creditLimit, setCredit]);

    const displaySubtotal = subtotal.toFixed(2);
    const usageMax = planMax ?? creditLimit ?? 0;
    const totalProfessionals = selected.reduce((sum, s) => sum + (s.qty || 0), 0);
    const unit = categories[0]?.unit ?? '/ day';
    const usagePct = usageMax > 0 ? Math.min(100, Math.round((subtotal / usageMax) * 100)) : 0;

    return (
        <form>
            <div className="max-w-xl mx-auto">
                <RadioGroup value={plan} onValueChange={(v) => handlePlanChange(v)} className="space-y-4">
                    {plans.length > 0 ? (
                        <div className="space-y-2">
                            <p className="text-xs">AVAILABLE PLANS</p>
                            {plans.map((planOption) => (
                                <PlansCard
                                    key={getPlanIdentifier(planOption)}
                                    value={getPlanIdentifier(planOption)}
                                    title={planOption.label ?? planOption.name}
                                    description={planOption.description ?? undefined}
                                    price={formatPlanPriceLabel(planOption)}
                                    save={getStringFromData(getPlanDataRecord(planOption.data), 'badge', 'tagline')}
                                />
                            ))}
                        </div>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <p className="text-xs">INDIVIDUAL PLANS</p>
                                <PlansCard
                                    value="pro"
                                    title="Pro"
                                    description="Best for individuals and solo practitioners"
                                    price="$200 USD"
                                />
                                <PlansCard
                                    value="premium"
                                    title="Premium"
                                    description="Advanced features and priority support"
                                    price="$150 USD"
                                    save="Popular"
                                />
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs">TEAM PLAN</p>
                                <PlansCard
                                    value="team"
                                    title="Team"
                                    description="Billed annually: 3 member minimum"
                                    price="$15.00 USD"
                                    save="Save 60%"
                                />
                            </div>
                        </>
                    )}
                </RadioGroup>
                {plansLoading && (
                    <p className="text-xs text-center text-stroke-weak-600 mt-2">Loading plans…</p>
                )}
                {plansError && (
                    <p className="text-xs text-center text-red-500 mt-2">{plansError}</p>
                )}

                {/* {showCredit && (
                    <div className="mt-6 max-w-sm mx-auto">
                        <label className="block text-sm font-medium mb-2">Credit limit</label>
                        <Input
                            type="number"
                            value={String(creditLimit ?? 0)}
                            onChange={(e) => {
                                const v = Number(e.target.value || 0);
                                if (planMax !== undefined) setCredit(Math.min(v, planMax));
                                else setCredit(Math.max(0, v));
                            }}
                            max={planMax}
                            min={0}
                        />
                        {planMax ? (
                            <p className="text-xs text-stroke-weak-600 mt-2">Maximum for this plan: ${planMax}</p>
                        ) : (
                            <p className="text-xs text-stroke-weak-600 mt-2">Set a credit limit to control spending when adding team members.</p>
                        )}
                    </div>
                )} */}
            </div>
        </form>
    )
}

export default PlanForm



