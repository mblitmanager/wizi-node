/**
 * Interface pour standardiser les réponses API
 * Assure la parité Node.js = Laravel
 */

export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: string | string[];
  message?: string;
  status?: number;
  timestamp?: string;
  path?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    total: number;
    count: number;
    per_page: number;
    current_page: number;
    total_pages: number;
  };
}

export interface ListResponse<T = any> {
  data: T[];
  meta?: {
    total: number;
    count: number;
    page: number;
  };
}
