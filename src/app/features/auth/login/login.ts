import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthSessionService } from '../../../core/auth/auth-session.service';
import { LoginRequest } from '../../../core/models/auth.models';
import { AuthApiService } from '../auth-api.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly authApi = inject(AuthApiService);
  private readonly authSession = inject(AuthSessionService);
  private readonly router = inject(Router);

  readonly form: LoginRequest = {
    email: 'admin@deportal.local',
    password: 'Deportal123',
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
      .login(this.form)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (response) => {
          this.authSession.saveSession(response);
          void this.router.navigate(['/dashboard']);
        },
        error: () => this.errorMessage.set('No fue posible iniciar sesion. Verifica tus credenciales.'),
      });
  }
}
