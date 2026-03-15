export interface VectorDocument {
  id: string;
  contentExcerpt: string;
  metadata: Record<string, unknown>;
}

export type VectorDocumentFull = VectorDocument;

export interface VectorDocumentPage {
  content: VectorDocument[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface GetVectorDocumentsParams {
  page?: number;
  size?: number;
  filter?: string;
}
