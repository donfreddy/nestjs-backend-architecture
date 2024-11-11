export interface ApiResponse<T> {
  data: T | ApiPaginatedResponse<T>;
}

export interface ApiPaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  current_page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface PaginationOpts {
  page: number;
  limit: number;
}
