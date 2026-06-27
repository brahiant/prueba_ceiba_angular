import { Injectable, computed, signal } from '@angular/core';

import { AuthResponse, AuthUser } from '../models/auth.models';

interface StoredSession {
  token: string;
  expiresAt: number;
  user: AuthUser;
}

const SESSION_STORAGE_KEY = 'deportal.auth.session';

@Injectable({ providedIn: 'root' })
export class AuthSessionService {
  private readonly session = signal<StoredSession | null>(this.readSession());

  readonly currentUser = computed(() => this.session()?.user ?? null);
  readonly token = computed(() => this.session()?.token ?? null);
  readonly isAuthenticated = computed(() => Boolean(this.getValidSession()));

  saveSession(response: AuthResponse): void {
    const session: StoredSession = {
      token: response.token,
      expiresAt: Date.now() + response.expiresInSeconds * 1000,
      user: response.user,
    };

    this.session.set(session);
    this.writeSession(session);
  }

  logout(): void {
    this.session.set(null);
    this.removeSession();
  }

  getToken(): string | null {
    return this.getValidSession()?.token ?? null;
  }

  private getValidSession(): StoredSession | null {
    const session = this.session();

    if (!session) {
      return null;
    }

    if (session.expiresAt <= Date.now()) {
      this.logout();
      return null;
    }

    return session;
  }

  private readSession(): StoredSession | null {
    if (!this.hasLocalStorage()) {
      return null;
    }

    const rawSession = localStorage.getItem(SESSION_STORAGE_KEY);

    if (!rawSession) {
      return null;
    }

    try {
      const session = JSON.parse(rawSession) as StoredSession;
      return session.expiresAt > Date.now() ? session : null;
    } catch {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
  }

  private writeSession(session: StoredSession): void {
    if (this.hasLocalStorage()) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    }
  }

  private removeSession(): void {
    if (this.hasLocalStorage()) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }

  private hasLocalStorage(): boolean {
    return typeof localStorage !== 'undefined';
  }
}
