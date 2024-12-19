export interface AuthError {
  code: string;
  message: string;
}

export interface AuthState {
  user: any | null;
  loading: boolean;
  error: string | null;
}