export interface VectorDocument {
  id: string;
  contentExcerpt: string;
  metadata: Record<string, unknown>;
}

export interface VectorDocumentFull extends VectorDocument {
  // getDocument endpoint returns full content in contentExcerpt field (same record shape)
  // no additional fields — contentExcerpt contains full content when from detail endpoint
}

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
