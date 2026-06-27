import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthSessionService } from '../../core/auth/auth-session.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly authSession = inject(AuthSessionService);
  private readonly router = inject(Router);

  readonly currentUser = this.authSession.currentUser;

  logout(): void {
    this.authSession.logout();
    void this.router.navigate(['/login']);
  }
}
