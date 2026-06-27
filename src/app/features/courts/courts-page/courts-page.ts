import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { CourtResponse, CreateCourtRequest } from '../../../core/models/court.models';
import { ApiErrorResponse, SportType } from '../../../core/models/shared.models';
import { CourtApiService } from '../court-api.service';

@Component({
  selector: 'app-courts-page',
  imports: [CurrencyPipe, ReactiveFormsModule, RouterLink],
  templateUrl: './courts-page.html',
  styleUrl: './courts-page.scss',
})
export class CourtsPage {
  private readonly courtApi = inject(CourtApiService);
  private readonly formBuilder = inject(FormBuilder);

  readonly sportTypes: SportType[] = ['FUTBOL', 'BASQUET', 'TENIS', 'VOLEIBOL', 'MULTIUSOS'];
  readonly courts = signal<CourtResponse[]>([]);
  readonly isLoading = signal(false);
  readonly isSubmitting = signal(false);
  readonly successMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);
  readonly backendErrors = signal<Record<string, string>>({});

  readonly courtForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    sportType: ['FUTBOL' as SportType, [Validators.required]],
    capacity: [10, [Validators.required, Validators.min(1), Validators.max(50)]],
    openingTime: ['06:00', [Validators.required]],
    closingTime: ['22:00', [Validators.required]],
    hourlyRate: [40, [Validators.required, Validators.min(5)]],
  });

  constructor() {
    this.loadCourts();
  }

  loadCourts(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.courtApi
      .list()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (courts) => this.courts.set(courts),
        error: () => this.errorMessage.set('No fue posible cargar las canchas.'),
      });
  }

  createCourt(): void {
    this.successMessage.set(null);
    this.errorMessage.set(null);
    this.backendErrors.set({});

    if (this.courtForm.invalid || !this.hasValidSchedule()) {
      this.courtForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    this.courtApi
      .create(this.buildRequest())
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (court) => {
          this.courts.update((courts) => [...courts, court]);
          this.successMessage.set(`Cancha ${court.name} registrada correctamente.`);
          this.courtForm.reset({
            name: '',
            sportType: 'FUTBOL',
            capacity: 10,
            openingTime: '06:00',
            closingTime: '22:00',
            hourlyRate: 40,
          });
        },
        error: (error: HttpErrorResponse) => this.handleCreateError(error),
      });
  }

  hasFieldError(fieldName: keyof CreateCourtRequest): boolean {
    const field = this.courtForm.controls[fieldName];
    return field.invalid && (field.touched || field.dirty);
  }

  getFieldError(fieldName: keyof CreateCourtRequest): string | null {
    const field = this.courtForm.controls[fieldName];

    if (this.backendErrors()[fieldName]) {
      return this.backendErrors()[fieldName];
    }

    if (!this.hasFieldError(fieldName)) {
      return null;
    }

    if (field.hasError('required')) {
      return 'Este campo es obligatorio.';
    }

    if (field.hasError('maxlength')) {
      return 'Maximo 120 caracteres.';
    }

    if (field.hasError('min')) {
      return fieldName === 'hourlyRate' ? 'La tarifa minima es 5.00.' : 'La capacidad minima es 1.';
    }

    if (field.hasError('max')) {
      return 'La capacidad maxima es 50.';
    }

    return null;
  }

  hasValidSchedule(): boolean {
    return this.courtForm.controls.openingTime.value < this.courtForm.controls.closingTime.value;
  }

  private buildRequest(): CreateCourtRequest {
    const value = this.courtForm.getRawValue();

    return {
      name: value.name.trim(),
      sportType: value.sportType,
      capacity: Number(value.capacity),
      openingTime: value.openingTime,
      closingTime: value.closingTime,
      hourlyRate: Number(value.hourlyRate),
    };
  }

  private handleCreateError(error: HttpErrorResponse): void {
    const apiError = error.error as ApiErrorResponse | null;
    const validationErrors = apiError?.validationErrors ?? apiError?.errors ?? {};

    this.backendErrors.set(validationErrors);
    this.errorMessage.set(apiError?.message ?? 'No fue posible registrar la cancha.');
  }
}
