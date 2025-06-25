export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  timestamp: string;
}

export interface ApiError {
  status: 'error';
  message: string;
  code?: string;
  details?: unknown;
  timestamp: string;
}
