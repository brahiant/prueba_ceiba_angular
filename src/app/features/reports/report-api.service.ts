import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClientService } from '../../core/api/api-client.service';
import { UtilizationReportResponse } from '../../core/models/report.models';

@Injectable({ providedIn: 'root' })
export class ReportApiService {
  private readonly apiClient = inject(ApiClientService);

  getUtilization(from: string, to: string): Observable<UtilizationReportResponse> {
    return this.apiClient.get<UtilizationReportResponse>('/reports/utilization', { from, to });
  }
}
