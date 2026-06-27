import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClientService } from '../../core/api/api-client.service';
import { UserResponse } from '../../core/models/user.models';

@Injectable({ providedIn: 'root' })
export class UserApiService {
  private readonly apiClient = inject(ApiClientService);

  list(): Observable<UserResponse[]> {
    return this.apiClient.get<UserResponse[]>('/users');
  }

  getById(userId: string): Observable<UserResponse> {
    return this.apiClient.get<UserResponse>(`/users/${userId}`);
  }
}
