import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

import { RuntimeConfig } from './runtime-config.model';

@Injectable({ providedIn: 'root' })
export class RuntimeConfigService {
  private readonly http = inject(HttpClient);
  private readonly configUrl = 'assets/config/app-config.json';
  private readonly config$ = this.http.get<RuntimeConfig>(this.configUrl).pipe(shareReplay(1));

  getConfig(): Observable<RuntimeConfig> {
    return this.config$;
  }
}
