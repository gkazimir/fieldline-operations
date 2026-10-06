import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

@Component({
  template: '<h1>Protected page</h1>',
})
class ProtectedPageStub {}

@Component({
  template: '<h1>Login page</h1>',
})
class LoginPageStub {}

const authServiceMock = {
  isAuthenticated: vi.fn<() => boolean>(),
};

describe('AuthGuard', () => {
  beforeEach(() => {
    authServiceMock.isAuthenticated.mockReset();
    TestBed.configureTestingModule({
      imports: [ProtectedPageStub, LoginPageStub],
      providers: [
        provideRouter([
          {
            path: 'app/dashboard',
            component: ProtectedPageStub,
            canActivate: [authGuard],
          },
          {
            path: 'auth/login',
            component: LoginPageStub,
          },
        ]),
        { provide: AuthService, useValue: authServiceMock },
      ],
    });
  });

  it('allows authenticated users to access the protected page', async () => {
    authServiceMock.isAuthenticated.mockReturnValue(true);

    const harness = await RouterTestingHarness.create();
    const page = await harness.navigateByUrl('/app/dashboard', ProtectedPageStub);

    expect(page).toBeInstanceOf(ProtectedPageStub);
  });

  it('redirects unauthenticated users to the login page', async () => {
    authServiceMock.isAuthenticated.mockReturnValue(false);

    const harness = await RouterTestingHarness.create();
    const page = await harness.navigateByUrl('/app/dashboard', LoginPageStub);

    expect(page).toBeInstanceOf(LoginPageStub);
    expect(TestBed.inject(Router).url).toBe('/auth/login?returnUrl=%2Fapp%2Fdashboard');
  });
});
