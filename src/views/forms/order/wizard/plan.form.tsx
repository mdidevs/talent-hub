import { RadioGroup } from "@/components/atomic/radio-group"
import { PlansCard } from "@/components/molecule/order/wizard/plan/PlansCard"


const PlanForm = () => {
    return (
        <form>
            <div className="max-w-xl mx-auto">
                <RadioGroup defaultValue="plus" className="space-y-4">
                    <div className="space-y-2">
                        <p className="text-xs">INDIVIDUAL PLANS</p>
                        <PlansCard
                            value="annual"
                            title="Annual"
                            description="Billed as one payment of $144.00 USD"
                            price="$12.00 USD"
                            save="Save 60%"
                        />
                        <PlansCard
                            value="quarterly"
                            title="Quarterly"
                            description="Billed as one payment of $60.00 USD"
                            price="$20.00"
                            save="Save 33%"
                        />
                        <PlansCard
                            value="monthly"
                            title="Monthly"
                            price="$30.00"
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
            </div>
        </form>
    )
}

export default PlanForm



