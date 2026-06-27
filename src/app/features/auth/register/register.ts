import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthSessionService } from '../../../core/auth/auth-session.service';
import { RegisterRequest } from '../../../core/models/auth.models';
import { CustomerType } from '../../../core/models/shared.models';
import { AuthApiService } from '../auth-api.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private readonly authApi = inject(AuthApiService);
  private readonly authSession = inject(AuthSessionService);
  private readonly router = inject(Router);

  readonly customerTypes: CustomerType[] = ['MIEMBRO', 'NO_MIEMBRO'];
  readonly form: RegisterRequest = {
    name: '',
    email: '',
    password: '',
    customerType: 'NO_MIEMBRO',
  };

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  submit(): void {
    if (this.isSubmitting()) {
      return;
    }

    this.errorMessage.set(null);
    this.isSubmitting.set(true);

    this.authApi
      .register(this.form)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (response) => {
          this.authSession.saveSession(response);
          void this.router.navigate(['/dashboard']);
        },
        error: () => this.errorMessage.set('No fue posible registrar el usuario. Revisa los datos ingresados.'),
      });
  }
}
