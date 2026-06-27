import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClientService } from '../../core/api/api-client.service';
import { AuthResponse, LoginRequest, RegisterRequest } from '../../core/models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly apiClient = inject(ApiClientService);

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.apiClient.post<AuthResponse, RegisterRequest>('/auth/register', request);
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.apiClient.post<AuthResponse, LoginRequest>('/auth/login', request);
  }
}
