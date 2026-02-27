import axiosMiddleware from '@/lib/axios';

const api = axiosMiddleware.getInstance();

export type CreateEnvelopePayload = {
  signerEmail: string;
  signerName: string;
  embeddedSigning: boolean;
  returnUrl: string;
  documentId: string;
  values: Record<string, unknown>;
};

export type FetchEnvelopeDocumentPayload = {
  envelopeId: string;
  documentId: string;
};

const encodePath = (value: string) => encodeURIComponent(value);

const createEnvelope = async (payload: CreateEnvelopePayload): Promise<unknown> => {
  const response = await api.post('/docusign/envelopes', payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  const data = response?.data as { data?: unknown } | undefined;
  return typeof data?.data !== 'undefined' ? data.data : data;
};

const fetchEnvelopeDocument = async (payload: FetchEnvelopeDocumentPayload): Promise<Blob> => {
  const response = await api.get<Blob>(
    `/docusign/envelopes/${encodePath(payload.envelopeId)}/documents/${encodePath(payload.documentId)}`,
    {
      responseType: 'blob',
      headers: { Accept: 'application/pdf' },
    },
  );

  return response.data;
};

export const docusignService = {
  createEnvelope,
  fetchEnvelopeDocument,
};
