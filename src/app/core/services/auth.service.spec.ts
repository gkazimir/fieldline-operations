import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { AuthUser } from '../models/auth-user.model';

const STORAGE_KEY = 'fieldline.auth';

describe('AuthService', () => {
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [AuthService],
    });
  });

  describe('login', () => {
    it('returns true and stores the normalized user for valid credentials', () => {
      const authService = TestBed.inject(AuthService);
      const user = { email: ' j.smith@example.com\n', password: 'password\n' };
      expect(authService.login(user.email, user.password)).toBe(true);
      expect(authService.currentUser()?.email).toBe('j.smith@example.com');
    });

    it('returns false when login is called with an empty email', () => {
      const authService = TestBed.inject(AuthService);
      const user = { email: '', password: 'pass' };
      expect(authService.login(user.email, user.password)).toBe(false);
      expect(authService.currentUser()).toBe(null);
    });

    it('returns false when login is called with an empty password', () => {
      const authService = TestBed.inject(AuthService);
      const user = { email: 'j.smith@example.com', password: '' };
      expect(authService.login(user.email, user.password)).toBe(false);
      expect(authService.currentUser()).toBe(null);
    });
  });

  describe('logout', () => {
    it('clears the current user when logout is called', () => {
      const authService = TestBed.inject(AuthService);
      const user = { email: ' j.doe@example.com', password: 'password' };
      authService.login(user.email, user.password);
      authService.logout();
      expect(authService.currentUser()).toBe(null);
      expect(sessionStorage.getItem(STORAGE_KEY)).toBe(null);
    });
  });

  describe('session restoration', () => {
    it('restores the stored user and allows logging in as another user', () => {
      const oldUser: AuthUser = {
        id: '123',
        name: 'John Smith',
        email: 'j.smith@example.com',
        role: 'Dispatcher',
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(oldUser));
      expect(sessionStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(oldUser));

      const authService = TestBed.inject(AuthService);
      expect(authService.currentUser()?.email).toBe('j.smith@example.com');

      const newUser = { email: ' j.doe@example.com', password: 'password' };
      authService.login(newUser.email, newUser.password);
      expect(authService.currentUser()?.email).toBe('j.doe@example.com');
      expect(authService.isAuthenticated()).toBe(true);
    });

    it('starts unauthenticated when stored session data is invalid JSON', () => {
      sessionStorage.setItem(STORAGE_KEY, '{');
      expect(sessionStorage.getItem(STORAGE_KEY)).toBe('{');

      const authService = TestBed.inject(AuthService);
      expect(authService.currentUser()).toBe(null);
      expect(authService.isAuthenticated()).toBe(false);
    });
  });
});
