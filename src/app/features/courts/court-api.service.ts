import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClientService } from '../../core/api/api-client.service';
import { CourtResponse, CreateCourtRequest, UpdateCourtRequest } from '../../core/models/court.models';

@Injectable({ providedIn: 'root' })
export class CourtApiService {
  private readonly apiClient = inject(ApiClientService);

  list(): Observable<CourtResponse[]> {
    return this.apiClient.get<CourtResponse[]>('/courts');
  }

  getById(courtId: string): Observable<CourtResponse> {
    return this.apiClient.get<CourtResponse>(`/courts/${courtId}`);
  }

  create(request: CreateCourtRequest): Observable<CourtResponse> {
    return this.apiClient.post<CourtResponse, CreateCourtRequest>('/courts', request);
  }

  update(courtId: string, request: UpdateCourtRequest): Observable<CourtResponse> {
    return this.apiClient.put<CourtResponse, UpdateCourtRequest>(`/courts/${courtId}`, request);
  }
}
