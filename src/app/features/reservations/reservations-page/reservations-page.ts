import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin, finalize } from 'rxjs';

import { AuthSessionService } from '../../../core/auth/auth-session.service';
import { CourtResponse } from '../../../core/models/court.models';
import { CreateReservationRequest, ReservationResponse } from '../../../core/models/reservation.models';
import { ApiErrorResponse } from '../../../core/models/shared.models';
import { CourtApiService } from '../../courts/court-api.service';
import { ReservationApiService } from '../reservation-api.service';

@Component({
  selector: 'app-reservations-page',
  imports: [CurrencyPipe, ReactiveFormsModule, RouterLink],
  templateUrl: './reservations-page.html',
  styleUrl: './reservations-page.scss',
})
export class ReservationsPage {
  private readonly authSession = inject(AuthSessionService);
  private readonly courtApi = inject(CourtApiService);
  private readonly reservationApi = inject(ReservationApiService);
  private readonly formBuilder = inject(FormBuilder);

  readonly currentUser = this.authSession.currentUser;
  readonly courts = signal<CourtResponse[]>([]);
  readonly reservations = signal<ReservationResponse[]>([]);
  readonly isLoading = signal(false);
  readonly isSubmitting = signal(false);
  readonly cancellingReservationId = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);
  readonly cancellationMessage = signal<string | null>(null);
  readonly backendErrors = signal<Record<string, string>>({});
  readonly today = this.toDateInputValue(new Date());
  readonly defaultReservationDate = this.toDateInputValue(this.addDays(new Date(), 1));
  readonly sortedReservations = computed(() =>
    [...this.reservations()].sort((first, second) => `${second.date} ${second.startTime}`.localeCompare(`${first.date} ${first.startTime}`)),
  );

  readonly reservationForm = this.formBuilder.nonNullable.group({
    courtId: ['', [Validators.required]],
    date: [this.defaultReservationDate, [Validators.required]],
    startTime: ['08:00', [Validators.required]],
    durationHours: [1, [Validators.required, Validators.min(1), Validators.max(8)]],
  });

  constructor() {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    forkJoin({
      courts: this.courtApi.list(),
      reservations: this.reservationApi.list(),
    })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: ({ courts, reservations }) => {
          const activeCourts = courts.filter((court) => court.active);

          this.courts.set(activeCourts);
          this.reservations.set(reservations);

          if (!this.reservationForm.controls.courtId.value && activeCourts.length > 0) {
            this.reservationForm.controls.courtId.setValue(activeCourts[0].courtId);
          }
        },
        error: () => this.errorMessage.set('No fue posible cargar canchas y reservas.'),
      });
  }

  createReservation(): void {
    this.successMessage.set(null);
    this.errorMessage.set(null);
    this.cancellationMessage.set(null);
    this.backendErrors.set({});

    if (this.reservationForm.invalid || this.hasPastDate()) {
      this.reservationForm.markAllAsTouched();
      return;
    }

    const user = this.currentUser();

    if (!user) {
      this.errorMessage.set('La sesion expiro. Inicia sesion nuevamente.');
      return;
    }

    this.isSubmitting.set(true);

    this.reservationApi
      .create(this.buildRequest(user.userId, user.customerType))
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (reservation) => {
          this.reservations.update((reservations) => [reservation, ...reservations]);
          this.successMessage.set(`Reserva ${reservation.status} creada. Total: ${reservation.totalAmount}.`);
          this.reservationForm.patchValue({
            startTime: reservation.endTime.slice(0, 5),
          });
        },
        error: (error: HttpErrorResponse) => this.handleCreateError(error),
      });
  }

  cancelReservation(reservation: ReservationResponse): void {
    if (!this.canCancel(reservation) || this.cancellingReservationId()) {
      return;
    }

    this.successMessage.set(null);
    this.errorMessage.set(null);
    this.cancellationMessage.set(null);
    this.cancellingReservationId.set(reservation.reservationId);

    this.reservationApi
      .cancel(reservation.reservationId)
      .pipe(finalize(() => this.cancellingReservationId.set(null)))
      .subscribe({
        next: (response) => {
          this.reservations.update((reservations) =>
            reservations.map((item) =>
              item.reservationId === response.reservationId
                ? {
                    ...item,
                    status: response.status,
                    refundAmount: response.refundAmount,
                  }
                : item,
            ),
          );
          this.cancellationMessage.set(`Reserva cancelada. Reembolso: ${response.refundAmount}.`);
        },
        error: (error: HttpErrorResponse) => this.handleCancelError(error),
      });
  }

  hasFieldError(fieldName: keyof Pick<CreateReservationRequest, 'courtId' | 'date' | 'startTime' | 'durationHours'>): boolean {
    const field = this.reservationForm.controls[fieldName];
    return field.invalid && (field.touched || field.dirty);
  }

  getFieldError(fieldName: keyof Pick<CreateReservationRequest, 'courtId' | 'date' | 'startTime' | 'durationHours'>): string | null {
    const field = this.reservationForm.controls[fieldName];

    if (this.backendErrors()[fieldName]) {
      return this.backendErrors()[fieldName];
    }

    if (!this.hasFieldError(fieldName)) {
      return null;
    }

    if (field.hasError('required')) {
      return 'Este campo es obligatorio.';
    }

    if (field.hasError('min')) {
      return 'La duracion minima es 1 hora.';
    }

    if (field.hasError('max')) {
      return 'La duracion maxima es 8 horas.';
    }

    return null;
  }

  hasPastDate(): boolean {
    return this.reservationForm.controls.date.value < this.today;
  }

  getCourtLabel(courtId: string): string {
    const court = this.courts().find((item) => item.courtId === courtId);
    return court ? `${court.name} (${court.sportType})` : courtId;
  }

  canCancel(reservation: ReservationResponse): boolean {
    if (reservation.status === 'CANCELLED') {
      return false;
    }

    return new Date(`${reservation.date}T${reservation.startTime}`) > new Date();
  }

  private buildRequest(userId: string, customerType: CreateReservationRequest['customerType']): CreateReservationRequest {
    const value = this.reservationForm.getRawValue();

    return {
      userId,
      customerType,
      courtId: value.courtId,
      date: value.date,
      startTime: value.startTime,
      durationHours: Number(value.durationHours),
    };
  }

  private handleCreateError(error: HttpErrorResponse): void {
    const apiError = error.error as ApiErrorResponse | null;
    const validationErrors = apiError?.validationErrors ?? apiError?.errors ?? {};

    this.backendErrors.set(validationErrors);
    this.errorMessage.set(apiError?.message ?? 'No fue posible crear la reserva.');
  }

  private handleCancelError(error: HttpErrorResponse): void {
    const apiError = error.error as ApiErrorResponse | null;

    this.errorMessage.set(apiError?.message ?? 'No fue posible cancelar la reserva.');
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
