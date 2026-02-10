import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/atomic/accordion"
import NdaForm from "@/views/forms/order/wizard/agreements/nda.form"

const AgreementView = () => {
  return (
    <div className='md:flex justify-between gap-3 '>
          <div className="md:w-5/12 space-y-6">
            <div className='space-y-1'>
                <h3 className='text-xl font-semibold'>Finalize your agreement</h3>
                <p>Please provide the legal details for the service contract and e-signature.</p>
            </div>
            
            <Accordion 
              type="single" 
              collapsible 
              defaultValue="nda-form" 
              >
              <AccordionItem value="nda-form">
                <AccordionTrigger>
                  <h3>1.NDA Non-Disclosure Agreemen</h3>
                </AccordionTrigger>
                <AccordionContent>
                  <NdaForm/>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="msa-form">
                <AccordionTrigger>
                  <h3>2.MSA Master Service Agreement</h3>
                </AccordionTrigger>
                <AccordionContent>
                  Master Service Agreement
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="baa-form">
                <AccordionTrigger>
                  <h3>3.HIPAA - BAA Business Associate Agreement</h3>
                </AccordionTrigger>
                <AccordionContent>
                  HIPAA - BAA Business Associate Agreement
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>


          <div className="md:w-6/12 min-h-screen ">
            <div className="p-4 h-full bg-background-white-0 shadow-xl">Agreement Preview</div>
          </div>
    </div>
  )
}

export default AgreementView