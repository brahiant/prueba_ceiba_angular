import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClientService } from '../../core/api/api-client.service';
import {
  CancelReservationResponse,
  CreateReservationRequest,
  ReservationResponse,
} from '../../core/models/reservation.models';

@Injectable({ providedIn: 'root' })
export class ReservationApiService {
  private readonly apiClient = inject(ApiClientService);

  list(): Observable<ReservationResponse[]> {
    return this.apiClient.get<ReservationResponse[]>('/reservations');
  }

  getById(reservationId: string): Observable<ReservationResponse> {
    return this.apiClient.get<ReservationResponse>(`/reservations/${reservationId}`);
  }

  create(request: CreateReservationRequest): Observable<ReservationResponse> {
    return this.apiClient.post<ReservationResponse, CreateReservationRequest>('/reservations', request);
  }

  cancel(reservationId: string): Observable<CancelReservationResponse> {
    return this.apiClient.post<CancelReservationResponse, Record<string, never>>(`/reservations/${reservationId}/cancel`, {});
  }
}
