import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

import { RuntimeConfigService } from '../config/runtime-config.service';

type QueryParams = Record<string, string | number | boolean | null | undefined>;

@Injectable({ providedIn: 'root' })
export class ApiClientService {
  private readonly http = inject(HttpClient);
  private readonly runtimeConfig = inject(RuntimeConfigService);

  get<TResponse>(path: string, params?: QueryParams): Observable<TResponse> {
    return this.runtimeConfig
      .getConfig()
      .pipe(switchMap((config) => this.http.get<TResponse>(this.buildUrl(config.apiBaseUrl, path), { params: this.buildParams(params) })));
  }

  post<TResponse, TBody = unknown>(path: string, body: TBody): Observable<TResponse> {
    return this.runtimeConfig
      .getConfig()
      .pipe(switchMap((config) => this.http.post<TResponse>(this.buildUrl(config.apiBaseUrl, path), body)));
  }

  put<TResponse, TBody = unknown>(path: string, body: TBody): Observable<TResponse> {
    return this.runtimeConfig
      .getConfig()
      .pipe(switchMap((config) => this.http.put<TResponse>(this.buildUrl(config.apiBaseUrl, path), body)));
  }

  delete<TResponse>(path: string): Observable<TResponse> {
    return this.runtimeConfig
      .getConfig()
      .pipe(switchMap((config) => this.http.delete<TResponse>(this.buildUrl(config.apiBaseUrl, path))));
  }

  private buildUrl(apiBaseUrl: string, path: string): string {
    const normalizedBase = apiBaseUrl.replace(/\/$/, '');
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    return `${normalizedBase}${normalizedPath}`;
  }

  private buildParams(params?: QueryParams): HttpParams {
    let httpParams = new HttpParams();

    if (!params) {
      return httpParams;
    }

    for (const [key, value] of Object.entries(params)) {
      if (value !== null && value !== undefined) {
        httpParams = httpParams.set(key, String(value));
      }
    }

    return httpParams;
  }
}
