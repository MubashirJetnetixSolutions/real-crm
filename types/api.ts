/** Standard success envelope returned by every API route. */
export interface ApiSuccess<T> {
  data: T;
  meta?: PaginationMeta;
}

/** Standard error envelope returned by every API route. */
export interface ApiFailure {
  error: {
    message: string;
    /** Field-level validation errors, keyed by field name. */
    fields?: Record<string, string>;
  };
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  offset: number;
}
