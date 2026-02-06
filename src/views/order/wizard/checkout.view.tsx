import Summary from "@/components/molecule/order/wizard/checkout/summary"
import CheckoutForm from "@/views/forms/order/wizard/checkout.form"

const CheckoutView = () => {
  return (
    <div className='space-y-8'>
            <div className='space-y-1'>
                <h3 className='text-xl font-semibold'>Pay with your Card</h3>
                <p>We accept Visa, Mastercard, and Maestro.</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="w-5/12">
                  <Summary/>
              </div>
              <div className="w-5/12">
                <CheckoutForm/>
              </div>
            </div>
    </div>
  )
}

export default CheckoutView