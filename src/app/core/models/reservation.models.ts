import { CustomerType, ReservationStatus } from './shared.models';

export interface ReservationResponse {
  reservationId: string;
  userId: string;
  customerName: string;
  customerType: CustomerType;
  courtId: string;
  courtName: string;
  date: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  baseAmount: number;
  memberDiscount: number;
  offPeakDiscount: number;
  totalDiscount: number;
  totalAmount: number;
  refundAmount: number | null;
  status: ReservationStatus;
}

export interface CreateReservationRequest {
  userId: string;
  courtId: string;
  date: string;
  startTime: string;
  durationHours: number;
  customerType: CustomerType;
}

export interface CancelReservationResponse {
  reservationId: string;
  status: ReservationStatus;
  refundAmount: number;
}
