import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import { appConfig } from '@/configs/app.config';
import { docusignService } from '@/services/docusign/docusign.service';

const DOCUSIGN_ENVELOPES_PATH = '/docusign/envelopes';
const DOCUSIGN_ENVELOPES_URL = `${appConfig.apiBaseUrl}${DOCUSIGN_ENVELOPES_PATH}`;
const DEFAULT_DOCUSIGN_DOCUMENT_ID = '1';
const DOCUSIGN_RETURN_URL = typeof window !== 'undefined'
  ? `${window.location.origin}/docusign/signed`
  : '/docusign/signed';
const EMPTY_PDF_B64 =
  'JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlIC9DYXRhbG9nL1BhZ2VzIDIgMCBSPj4KZW5kb2JqCjIgMCBvYmoKPDwvVHlwZSAvUGFnZXMvS2lkcyBbMyAwIFJdL0NvdW50IDE+PgplbmRvYmoKMyAwIG9iago8PC9UeXBlIC9QYWdlL1BhcmVudCAyIDAgUi9NZWRpYUJveCBbMCAwIDYxMiA3OTJdL0NvbnRlbnRzIDQgMCBSL1Jlc291cmNlcyA8PC9Gb250IDw8L0YxIDUgMCBSPj4+Pj4+CmVuZG9iago0IDAgb2JqCjw8L0xlbmd0aCA1Mz4+CnN0cmVhbQpCVAovRjEgMjQgVGYKMTIwIDcwMCBUZAooUHJldmlldyB3aWxsIGxvYWQgYWZ0ZXIgaW5wdXQpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKNSAwIG9iago8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9OYW1lL0YxL0Jhc2VGb250L0hlbHZldGljYT4+CmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgIAowMDAwMDAwMDEwIDAwMDAwIG4gIAowMDAwMDAwMDYxIDAwMDAwIG4gIAowMDAwMDAwMTQ3IDAwMDAwIG4gIAowMDAwMDAwMjk1IDAwMDAwIG4gIAowMDAwMDAwMzc5IDAwMDAwIG4gIAp0cmFpbGVyCjw8L1NpemUgNi9Sb290IDEgMCBSPj4Kc3RhcnR4cmVmCjQ2NgolJUVPRg==';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const extractDocErrorMessage = (data: unknown): string | undefined => {
  if (!data || typeof data !== 'object') return undefined;
  if ('message' in data && typeof (data as { message?: unknown }).message === 'string') {
    return (data as { message: string }).message;
  }
  if ('error' in data && typeof (data as { error?: unknown }).error === 'string') {
    return (data as { error: string }).error;
  }
  if ('errorCode' in data && typeof (data as { errorCode?: unknown }).errorCode === 'string') {
    return (data as { errorCode: string }).errorCode;
  }
  if ('errorMessage' in data && typeof (data as { errorMessage?: unknown }).errorMessage === 'string') {
    return (data as { errorMessage: string }).errorMessage;
  }
  return undefined;
};

const isDocumentGenerationPending = (err: unknown) => {
  if (!err || typeof err !== 'object') return false;

  const anyErr = err as { response?: { status?: number; data?: unknown } };
  const status = anyErr.response?.status;
  const message = extractDocErrorMessage(anyErr.response?.data);

  const normalized = (message ?? '').toLowerCase();
  if (status && [404, 409, 423].includes(status)) return true;
  if (!normalized) return false;
  return normalized.includes('not ready') || normalized.includes('not generated');
};

const getHttpErrorSummary = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  if (typeof err !== 'object' || err === null) return 'Something went wrong.';

  const anyErr = err as { message?: unknown; response?: { status?: unknown; data?: unknown }; request?: unknown };
  const status = typeof anyErr.response?.status === 'number' ? anyErr.response.status : undefined;
  const data = anyErr.response?.data;

  const messageFromData =
    typeof data === 'string'
      ? data
      : typeof (data as { message?: unknown } | undefined)?.message === 'string'
        ? (data as { message: string }).message
        : undefined;

  const baseMessage = messageFromData ?? (typeof anyErr.message === 'string' ? anyErr.message : 'Request failed.');

  if (status) return `${status} - ${baseMessage}`;
  if (anyErr.request) return `Network/CORS - ${baseMessage}`;
  return baseMessage;
};

const findAgreementPreviewHost = (): HTMLElement | null => {
  const nodes = Array.from(document.querySelectorAll<HTMLElement>('div'));
  return (
    nodes.find((n) => n.dataset.agreementPreviewHost === 'true') ??
    nodes.find((n) => n.textContent?.trim() === 'Agreement Preview') ??
    null
  );
};

let loadingPdf = false;
// params: { status?: string; pdfObjectUrl?: string; error?: string; signUrl?: string, loadingPdf?: boolean }
const renderAgreementPreview = (params: { status?: string; pdfObjectUrl?: string; error?: string; signUrl?: string, loadingPdf?: boolean }) => {
  const host = findAgreementPreviewHost();
  if (!host) return;

  host.dataset.agreementPreviewHost = 'true';
  host.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'h-full w-full flex flex-col gap-3';

  const header = document.createElement('div');
  header.className = 'flex items-center justify-between gap-2';

  const title = document.createElement('div');
  title.className = 'font-semibold';
  title.textContent = 'Agreement Preview';

  const rightSide = document.createElement('div');
  rightSide.className = 'flex items-center gap-2';

  const status = document.createElement('div');
  status.className = 'text-xs text-muted-foreground';
  status.textContent = params.error ? params.error : (params.status ?? '');
  rightSide.append(status);

  if (params.signUrl) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 disabled:opacity-50';
    btn.textContent = 'Sign';
    btn.addEventListener('click', () => {
      window.open(params.signUrl as string, '_blank', 'noopener,noreferrer');
    });
    rightSide.append(btn);
  }

  header.append(title, rightSide);
  wrapper.append(header);

  if (params.pdfObjectUrl) {
    // Loader overlay container
    const overlayContainer = document.createElement('div');
    overlayContainer.style.position = 'relative';
    overlayContainer.style.width = '100%';
    overlayContainer.style.minHeight = '70vh';

    // Iframe
    const iframe = document.createElement('iframe');
    iframe.src = params.pdfObjectUrl;
    iframe.title = 'Agreement PDF preview';
    iframe.className = 'w-full flex-1 rounded-md border border-border bg-background';
    iframe.style.minHeight = '70vh';
    overlayContainer.appendChild(iframe);

    // Loader overlay
    const loaderOverlay = document.createElement('div');
    loaderOverlay.style.position = 'absolute';
    loaderOverlay.style.top = '0';
    loaderOverlay.style.left = '0';
    loaderOverlay.style.width = '100%';
    loaderOverlay.style.height = '100%';
    loaderOverlay.style.display = (params.loadingPdf || loadingPdf) ? 'flex' : 'none';
    loaderOverlay.style.alignItems = 'center';
    loaderOverlay.style.justifyContent = 'center';
    loaderOverlay.style.background = 'rgba(255,255,255,0.7)';
    loaderOverlay.style.zIndex = '10';
    loaderOverlay.style.pointerEvents = 'none';
    loaderOverlay.className = 'agreement-iframe-loader';

    // Spinner
    const spinner = document.createElement('span');
    spinner.style.width = '40px';
    spinner.style.height = '40px';
    spinner.style.border = '4px solid #ccc';
    spinner.style.borderTop = '4px solid #333';
    spinner.style.borderRadius = '50%';
    spinner.style.display = 'inline-block';
    spinner.style.animation = 'spin 1s linear infinite';
    loaderOverlay.appendChild(spinner);

    // Spinner animation
    const style = document.createElement('style');
    style.textContent = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
    loaderOverlay.appendChild(style);

    // Show/hide loader based on loadingPdf state and iframe load
    overlayContainer.appendChild(loaderOverlay);
    if (params.loadingPdf || loadingPdf) {
      loadingPdf = true;
      iframe.addEventListener('load', () => {
        loaderOverlay.style.display = 'none';
        loadingPdf = false;
      });
    }

    wrapper.append(overlayContainer);
  } else {
    const placeholder = document.createElement('div');
    placeholder.className = 'flex-1 rounded-md border border-dashed border-border bg-background p-4 text-sm text-muted-foreground';
    placeholder.textContent = params.error ? 'Unable to load preview.' : 'Preview will appear here after Continue.';
    placeholder.style.minHeight = '70vh';
    wrapper.append(placeholder);
  }

  host.append(wrapper);
};

const createEmptyPdfUrl = () => {
  if (typeof window === 'undefined' || typeof window.atob !== 'function') return null;
  try {
    const binary = window.atob(EMPTY_PDF_B64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i += 1) bytes[i] = binary.charCodeAt(i);
    const blob = new Blob([bytes], { type: 'application/pdf' });
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
};

export const useNdaAgreement = () => {


  // State must be declared before useForm
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewSyncing, setIsPreviewSyncing] = useState(false);
  const [signUrl, setSignUrl] = useState<string | undefined>(undefined);

  // useForm for validation (must come after isSubmitting is defined)
  const { register, handleSubmit: rhfHandleSubmit, formState: { errors, isValid }, trigger, watch, getValues } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      jobTitle: '',
      companyName: '',
      businessAddressLine1: '',
      typeOfBusiness: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
    },
  });

  // Watch country value for conditional validation
  const watchedCountry = watch('country');

  // Combine loader states for API and PDF loading
  const isLoading = isSubmitting;

  // Only generate PDF on submit
  const onSubmit = async (data: Record<string, string>, event?: React.BaseSyntheticEvent) => {
    if (event) event.preventDefault();
    // Create a FormData object from the submitted data
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));
    // Call runEnvelopeFlow to generate PDF
    await runEnvelopeFlow(formData, 'submit');
  };

  const previewUrlRef = useRef<string | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cleanupPreviewUrl = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  };

  useEffect(() => {
    const emptyPdfUrl = createEmptyPdfUrl();
    if (emptyPdfUrl) {
      cleanupPreviewUrl();
      previewUrlRef.current = emptyPdfUrl;
      renderAgreementPreview({
        status: 'Start typing to personalize the agreement.',
        pdfObjectUrl: emptyPdfUrl,
        loadingPdf: false,
      });
    } else {
      renderAgreementPreview({ status: 'Start typing to personalize the agreement.' });
    }
    return () => {
      cleanupPreviewUrl();
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    };
  }, []);

  const fetchEnvelopeDocumentWithRetry = async (
    params: { envelopeId: string; documentId: string },
    signUrl?: string,
  ) => {
    const maxAttempts = 5;
    let attempt = 0;
    let lastError: unknown;

    while (attempt < maxAttempts) {
      attempt += 1;
      try {
        return await docusignService.fetchEnvelopeDocument(params);
      } catch (err) {
        lastError = err;
        if (!isDocumentGenerationPending(err) || attempt === maxAttempts) {
          throw err;
        }

        const backoff = Math.min(800 + attempt * 400, 4000);
        renderAgreementPreview({
          status: `DocuSign is preparing the PDF… retrying (${attempt}/${maxAttempts}).`,
          pdfObjectUrl: previewUrlRef.current ?? undefined,
          signUrl,
        });
        await sleep(backoff);
      }
    }

    throw lastError ?? new Error('Unable to fetch DocuSign document.');
  };

  const buildFormValues = (fd: FormData) => {
    const getValue = (name: string) => (fd.get(name)?.toString() ?? '').trim();
    const signerFirstName = getValue('firstName');
    const signerLastName = getValue('lastName');
    const signerEmail = getValue('email');
    const countryValue = getValue('country');
    return {
      signerName: `${signerFirstName} ${signerLastName}`.trim() || 'Authorized Signatory',
      signerEmail: signerEmail,
      values: {
        effectiveDate: getValue('effectiveDate') || new Date().toISOString().slice(0, 10),
        signatoryFirstName: signerFirstName,
        signatoryLastName: signerLastName,
        companyName: getValue('companyName'),
        typeOfBusiness: getValue('typeOfBusiness'),
        jobTitle: getValue('jobTitle'),
        workEmail: signerEmail,
        monthlyFee: getValue('monthlyFee'),
        confidentialityYears: getValue('confidentialityYears'),
        providerName: getValue('providerName'),
        providerAddress: getValue('providerAddress'),
        businessAddressLine1: getValue('businessAddressLine1'),
        businessAddressLine2: getValue('businessAddressLine2'),
        city: getValue('city'),
        state: getValue('state'),
        zipCode: getValue('zipCode'),
        country: countryValue,
      },
    } as const;
  };

  // Accept FormData directly for envelope flow
  const runEnvelopeFlow = async (formData: FormData, origin: 'submit' | 'blur') => {

    const { signerName, signerEmail, values } = buildFormValues(formData);

    if (!signerName.trim() || !signerEmail) {
      if (origin === 'blur') {
        renderAgreementPreview({
          status: 'Add signer details to preview the document.',
          pdfObjectUrl: previewUrlRef.current ?? undefined,
        });
      }
      return;
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      renderAgreementPreview({
        error: `401 - Missing token (${DOCUSIGN_ENVELOPES_URL})`,
        pdfObjectUrl: previewUrlRef.current ?? undefined,
      });
      return;
    }

    if (origin === 'submit') setIsSubmitting(true);
    else setIsPreviewSyncing(true);

    loadingPdf = true;
    renderAgreementPreview({ status: origin === 'submit' ? 'Creating envelope…' : 'Updating preview…', pdfObjectUrl: previewUrlRef.current ?? undefined, loadingPdf: true });

    try {
      const res = await docusignService.createEnvelope({
        signerEmail: signerEmail || 'signer@example.com',
        signerName,
        embeddedSigning: true,
        returnUrl: DOCUSIGN_RETURN_URL,
        documentId: 'msa',
        values,
      });

      const toRecord = (value: unknown): Record<string, unknown> | null =>
        value && typeof value === 'object' ? (value as Record<string, unknown>) : null;

      const baseRecord = toRecord(res);
      const nestedDataRecord = toRecord(baseRecord?.data);
      const envelopeRecord = toRecord(baseRecord?.envelope) ?? toRecord(nestedDataRecord?.envelope);
      const documentRecord = toRecord(baseRecord?.document) ?? toRecord(nestedDataRecord?.document);

      const readFromRecords = (records: Array<Record<string, unknown> | null | undefined>, key: string) => {
        for (const record of records) {
          const value = record?.[key];
          if (typeof value === 'string' && value.trim()) return value;
        }
        return null;
      };

      const envelopeId =
        readFromRecords([baseRecord, nestedDataRecord, envelopeRecord], 'envelopeId') ?? null;

      const signUrl =
        readFromRecords([baseRecord, nestedDataRecord], 'signingUrl') ??
        readFromRecords([baseRecord, nestedDataRecord], 'recipientViewUrl') ??
        readFromRecords([baseRecord, nestedDataRecord], 'signUrl') ??
        readFromRecords([baseRecord, nestedDataRecord], 'url') ??
        (envelopeId ? `https://appdemo.docusign.com/documents/details/${envelopeId}` : undefined);
      setSignUrl(typeof signUrl === 'string' ? signUrl : undefined);

      const documentsCollections = [baseRecord?.documents, nestedDataRecord?.documents].flatMap((candidate) =>
        Array.isArray(candidate) ? candidate : [],
      ) as Array<Record<string, unknown>>;

      const firstDocumentIdFromCollections = documentsCollections
        .map((doc) => (typeof doc.documentId === 'string' ? doc.documentId : null))
        .find((docId) => (docId ?? '').trim()) ?? undefined;

      const documentIdForFetch =
        readFromRecords([baseRecord, nestedDataRecord], 'docusignDocumentId') ??
        readFromRecords([baseRecord, nestedDataRecord, documentRecord], 'documentId') ??
        firstDocumentIdFromCollections ??
        DEFAULT_DOCUSIGN_DOCUMENT_ID;

      if (!envelopeId) {
        loadingPdf = false;
        renderAgreementPreview({ error: `Envelope created but no envelopeId returned (${DOCUSIGN_ENVELOPES_URL})`, loadingPdf: false });
        return;
      }

      loadingPdf = true;
      renderAgreementPreview({ status: 'Loading PDF…', signUrl, loadingPdf: true });
      const blob = await fetchEnvelopeDocumentWithRetry({
        envelopeId,
        documentId: documentIdForFetch,
      }, signUrl);

      const docPdfUrl = URL.createObjectURL(blob);
      cleanupPreviewUrl();
      previewUrlRef.current = docPdfUrl;

      loadingPdf = false;
      renderAgreementPreview({
        status: `Loaded (${DOCUSIGN_ENVELOPES_URL}/${encodeURIComponent(envelopeId)}/documents/${encodeURIComponent(documentIdForFetch)})`,
        pdfObjectUrl: docPdfUrl,
        signUrl,
        loadingPdf: false,
      });
    } catch (err) {
      loadingPdf = false;
      const message = getHttpErrorSummary(err);
      renderAgreementPreview({
        error: `${message} (${DOCUSIGN_ENVELOPES_URL})`,
        pdfObjectUrl: previewUrlRef.current ?? undefined,
        loadingPdf: false,
      });
    } finally {
      if (origin === 'submit') setIsSubmitting(false);
      else setIsPreviewSyncing(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    formRef.current = e.currentTarget;
    if (isSubmitting) return;
    await runEnvelopeFlow(new FormData(e.currentTarget), 'submit');
  };

  const schedulePreviewRefresh = () => {
    if (!formRef.current || isSubmitting || isPreviewSyncing) return;
    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    blurTimeoutRef.current = setTimeout(() => {
      if (!formRef.current) return;
      void runEnvelopeFlow(new FormData(formRef.current), 'blur');
    }, 300);
  };

  const handleFieldBlur = () => {
    schedulePreviewRefresh();
  };

  return {
    // react-hook-form
    register,
    rhfHandleSubmit,
    errors,
    isValid,
    trigger,
    watch,
    getValues,
    watchedCountry,
    isLoading,
    onSubmit,
    // legacy/other
    isSubmitting,
    handleSubmit,
    handleFieldBlur,
    formRef,
    signUrl,
    runEnvelopeFlow,
  };
};

export const useNdaAgreementHook = useNdaAgreement;
