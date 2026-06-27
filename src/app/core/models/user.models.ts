import { CustomerType, UserRole } from './shared.models';

export interface UserResponse {
  userId: string;
  name: string;
  email: string;
  customerType: CustomerType;
  role: UserRole;
  active: boolean;
}
