export interface ApiResponse<T> {
  data: T;
}

export interface ApiPaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
  links: PaginationLinks;
}

export interface PaginationMeta {
  current_page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface PaginationLinks {
  first: string;
  previous: string;
  next: string;
  last: string;
}

export interface PaginationOpts {
  page: number;
  limit: number;
  route?: string;
}
