export type CustomerType = 'MIEMBRO' | 'NO_MIEMBRO';

export type ProductType = 'COURT_RENTAL' | 'EQUIPMENT_RENTAL' | 'DRINK' | 'OTHER';

export type ReservationStatus = 'CONFIRMED' | 'WAITLISTED' | 'CANCELLED';

export type SportType = 'FUTBOL' | 'BASQUET' | 'TENIS' | 'VOLEIBOL' | 'MULTIUSOS';

export type UserRole = 'ADMIN' | 'USER';

export interface ApiErrorResponse {
  status: number;
  message: string;
  errors?: Record<string, string>;
}
