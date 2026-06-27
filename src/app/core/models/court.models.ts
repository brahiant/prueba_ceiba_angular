import { SportType } from './shared.models';

export interface CourtResponse {
  courtId: string;
  name: string;
  sportType: SportType;
  capacity: number;
  openingTime: string;
  closingTime: string;
  hourlyRate: number;
  active: boolean;
}

export interface CreateCourtRequest {
  name: string;
  sportType: SportType;
  capacity: number;
  openingTime: string;
  closingTime: string;
  hourlyRate: number;
}

export interface UpdateCourtRequest extends CreateCourtRequest {
  active: boolean;
}
