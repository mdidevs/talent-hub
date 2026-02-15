import PlanForm from "@/views/forms/order/wizard/plan.form"


const PlanView = () => {
  return (
    <div className='my-10 space-y-8'>
            <h3 className='text-2xl text-center font-medium'>Choose your plan</h3>
            <PlanForm/>
    </div>
  )
}

export default PlanView