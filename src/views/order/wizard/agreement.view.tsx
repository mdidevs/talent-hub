import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/atomic/accordion"
import NdaForm from "@/views/forms/order/wizard/agreements/nda.form"
import { useState, useRef } from "react";

const AgreementView = () => {
  // State for PDF preview
  const [pdfUrl, setPdfUrl] = useState<string | undefined>(undefined);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Handler to be passed to NDA form to update PDF src and loader
  const handlePdfPreview = (url?: string) => {
    setPdfUrl(url);
    setLoadingPdf(!!url);
  };

  // Handler for iframe load event
  const handleIframeLoad = () => {
    setLoadingPdf(false);
  };

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
            <div className="p-4 h-full bg-background-white-0 shadow-xl relative" data-agreement-preview-host="true">
              <div className="font-semibold mb-2">Agreement Preview</div>
              <div style={{position:'relative', minHeight:'70vh'}}>
                <iframe
                  ref={iframeRef}
                  src={pdfUrl}
                  title="Agreement PDF preview"
                  className="w-full flex-1 rounded-md border border-border bg-background"
                  style={{ minHeight: '70vh', display: pdfUrl ? 'block' : 'none' }}
                  onLoad={handleIframeLoad}
                />
                {loadingPdf && (
                  <div style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(255,255,255,0.7)',zIndex:10,pointerEvents:'none'}}>
                    <span style={{ width: 40, height: 40, border: '4px solid #ccc', borderTop: '4px solid #333', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }} />
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                  </div>
                )}
                {!pdfUrl && (
                  <div className="flex-1 rounded-md border border-dashed border-border bg-background p-4 text-sm text-muted-foreground" style={{minHeight:'70vh'}}>Preview will appear here after Continue.</div>
                )}
              </div>
            </div>
          </div>
    </div>
  )
}

export default AgreementView