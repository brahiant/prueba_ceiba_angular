import { CurrencyPipe, DecimalPipe, PercentPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { UtilizationReportResponse } from '../../../core/models/report.models';
import { ApiErrorResponse } from '../../../core/models/shared.models';
import { ReportApiService } from '../report-api.service';

@Component({
  selector: 'app-reports-page',
  imports: [CurrencyPipe, DecimalPipe, PercentPipe, ReactiveFormsModule, RouterLink],
  templateUrl: './reports-page.html',
  styleUrl: './reports-page.scss',
})
export class ReportsPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly reportApi = inject(ReportApiService);

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly report = signal<UtilizationReportResponse | null>(null);
  readonly totals = computed(() => {
    const rows = this.report()?.rows ?? [];
    const reservedHours = rows.reduce((total, row) => total + row.reservedHours, 0);
    const availableHours = rows.reduce((total, row) => total + row.availableHours, 0);
    const totalIncome = rows.reduce((total, row) => total + row.totalIncome, 0);
    const totalReservations = rows.reduce((total, row) => total + row.totalReservations, 0);

    return {
      totalReservations,
      reservedHours,
      availableHours,
      totalIncome,
      occupancyRate: availableHours === 0 ? 0 : reservedHours / availableHours,
    };
  });

  readonly reportForm = this.formBuilder.nonNullable.group({
    from: [this.toDateInputValue(this.addDays(new Date(), -30)), [Validators.required]],
    to: [this.toDateInputValue(this.addDays(new Date(), 30)), [Validators.required]],
  });

  constructor() {
    this.loadReport();
  }

  loadReport(): void {
    this.errorMessage.set(null);

    if (this.reportForm.invalid || this.hasInvalidRange()) {
      this.reportForm.markAllAsTouched();
      return;
    }

    const { from, to } = this.reportForm.getRawValue();

    this.isLoading.set(true);
    this.reportApi
      .getUtilization(from, to)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (report) => this.report.set(report),
        error: (error: HttpErrorResponse) => this.handleError(error),
      });
  }

  hasFieldError(fieldName: 'from' | 'to'): boolean {
    const field = this.reportForm.controls[fieldName];
    return field.invalid && (field.touched || field.dirty);
  }

  getFieldError(fieldName: 'from' | 'to'): string | null {
    if (!this.hasFieldError(fieldName)) {
      return null;
    }

    return 'Este campo es obligatorio.';
  }

  hasInvalidRange(): boolean {
    const { from, to } = this.reportForm.getRawValue();
    return Boolean(from && to && from > to);
  }

  private handleError(error: HttpErrorResponse): void {
    const apiError = error.error as ApiErrorResponse | null;
    this.errorMessage.set(apiError?.message ?? 'No fue posible generar el reporte.');
  }

  private toDateInputValue(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);

    return result;
  }
}
