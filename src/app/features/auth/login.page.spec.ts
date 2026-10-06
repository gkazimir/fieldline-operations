import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from '../../core/services/auth.service';
import { LoginPage } from './login.page';

@Component({
  template: '<h1>Dashboard loaded</h1>',
})
class DashboardStub {}

describe('LoginPage', () => {
  const authServiceMock = {
    login: vi.fn<(email: string, password: string) => boolean>(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    authServiceMock.login.mockReturnValue(true);

    await TestBed.configureTestingModule({
      imports: [LoginPage, DashboardStub],
      providers: [
        provideRouter([
          {
            path: 'auth/login',
            component: LoginPage,
          },
          {
            path: 'app/dashboard',
            component: DashboardStub,
          },
        ]),
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();
  });

  it('should create', async () => {
    const fixture = TestBed.createComponent(LoginPage);
    await fixture.whenStable();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows validation messages and does not log in when the form is empty', async () => {
    const fixture = TestBed.createComponent(LoginPage);
    const nativeElement = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
    fixture.detectChanges();
    const form = nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(Array.from(form.querySelectorAll('.field-error')).map((el) => el.textContent)).toContain(
      'Enter a valid email address.',
    );
    expect(Array.from(form.querySelectorAll('.field-error')).map((el) => el.textContent)).toContain(
      'Enter your password.',
    );
    expect(authServiceMock.login).not.toHaveBeenCalled();
  });

  it('submits valid credentials and navigates to the dashboard', async () => {
    const harness = await RouterTestingHarness.create('/auth/login');
    const loginPage = harness.routeNativeElement as HTMLElement;
    const emailInput = loginPage.querySelector('#login-email') as HTMLInputElement;
    const passwordInput = loginPage.querySelector('#login-password') as HTMLInputElement;
    const form = loginPage.querySelector('form') as HTMLFormElement;

    emailInput.value = 'j.smith@example.com';
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    passwordInput.value = 'secret';
    passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await harness.fixture.whenStable();

    expect(authServiceMock.login).toHaveBeenCalledWith('j.smith@example.com', 'secret');
    expect(TestBed.inject(Router).url).toBe('/app/dashboard');
    expect(harness.routeNativeElement?.textContent).toContain('Dashboard loaded');
  });
});
