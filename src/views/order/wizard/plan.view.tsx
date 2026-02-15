import PlanForm from "@/views/forms/order/wizard/plan.form"


const PlanView = () => {
  return (
    <div className='space-y-8'>
            <div className='space-y-1'>
                <h3 className='text-xl font-semibold'>Pay with your Card</h3>
                <p>We accept Visa, Mastercard, and Maestro.</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <PlanForm/>
            </div>
    </div>
  )
}

export default PlanView