import { RadioGroup } from "@/components/atomic/radio-group"
import { PlansCard } from "@/components/molecule/order/wizard/plan/PlansCard"
import useWizard from '@/hooks/wizard/wizard.hook'
import { Input } from '@/components/atomic/input'


const PlanForm = () => {
    const { selected, plan, choosePlan, creditLimit, setCredit, categories } = useWizard();

    const subtotal = selected.reduce((sum, s) => {
        const cat = categories.find((c) => String(c.id) === String(s.categoryId));
        const price = cat ? Number(cat.price ?? 0) : 0;
        return sum + price * (s.qty || 0);
    }, 0);

    const showCredit = subtotal > 0 || plan === 'team';

    const planMax = plan === 'pro' ? 200 : plan === 'premium' ? 150 : undefined;

    const handlePlanChange = (v: string) => {
        choosePlan(v);
        // do not auto-set credit when selecting a plan alone; credit input appears only when subtotal>0 or team
    };

    const displaySubtotal = subtotal.toFixed(2);
    const usageMax = plan === 'pro' ? 200 : plan === 'premium' ? 150 : (creditLimit ?? 0);
    const totalProfessionals = selected.reduce((sum, s) => sum + (s.qty || 0), 0);
    const unit = categories[0]?.unit ?? '/ day';
    const usagePct = usageMax > 0 ? Math.min(100, Math.round((subtotal / usageMax) * 100)) : 0;

    return (
        <form>
            <div className="max-w-xl mx-auto">
                <RadioGroup value={plan} onValueChange={(v) => handlePlanChange(v)} className="space-y-4">
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
                </RadioGroup>

                {showCredit && (
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
                )}
            </div>
        </form>
    )
}

export default PlanForm



