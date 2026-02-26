import { Badge } from "@/components/atomic/badge"
import Invoice from "./invoice"

const PlanBilling = () => {
  return (
    <div className='space-y-4 md:space-y-10'>
            <div>
                <h5>Business</h5>
                <p>View and update your business details</p>
            </div>
            <div className="p-4 w-fit space-y-5 bg-primary-alpha-10 rounded-md border border-primary-base">
                <div className="flex items-start gap-15">
                    <div>
                        <h5>Pro</h5>
                        <p>For small team and startups</p>
                    </div>
                    <Badge variant={"success"}>Active</Badge>
                </div>
                <h5>36<span className="text-sm font-normal text-text-sub-600"> / per seat</span></h5>
            </div>
            
            <Invoice/>
    </div>
  )
}

export default PlanBilling