import { CustomerType, UserRole } from './shared.models';

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  customerType: CustomerType;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  expiresInSeconds: number;
  user: AuthUser;
}

export interface AuthUser {
  userId: string;
  name: string;
  email: string;
  customerType: CustomerType;
  role: UserRole;
}
