import { Injectable, computed, signal } from '@angular/core';

import { AuthUser } from '../models/auth-user.model';

const STORAGE_KEY = 'fieldline.auth';

/**
 * Mock session store. Accepts any non-empty credentials since there is no
 * real identity provider yet; swapping to a real SSO flow later only means
 * changing this file.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly user = signal<AuthUser | null>(this.restore());

  readonly currentUser = this.user.asReadonly();
  readonly isAuthenticated = computed(() => this.user() !== null);

  /**
   * Signs in with any non-empty email/password pair.
   * @param email The user's work email, used to derive their display name.
   * @param password Any non-empty value is accepted by this mock implementation.
   * @returns True once signed in; false if the credentials are incomplete.
   */
  login(email: string, password: string): boolean {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      return false;
    }
    const account: AuthUser = {
      id: trimmedEmail.toLowerCase(),
      name: this.deriveName(trimmedEmail),
      email: trimmedEmail,
      role: 'Dispatcher',
    };
    this.user.set(account);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(account));
    return true;
  }

  /** Ends the mock session and clears the persisted user. */
  logout(): void {
    this.user.set(null);
    sessionStorage.removeItem(STORAGE_KEY);
  }

  /**
   * Turns an email local-part like "j.smith" into a display name like "J Smith".
   * @param email The signed-in user's email address.
   * @returns A best-effort display name derived from the email's local part.
   */
  private deriveName(email: string): string {
    const [localPart] = email.split('@');
    return localPart
      .split(/[._-]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  /** Restores a previously signed-in user from this browser session, if any. */
  private restore(): AuthUser | null {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }
}
