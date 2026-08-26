import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

/**
 * Blocks access to the operations workspace until a mock session exists.
 * @param _route Unused; required by the CanActivateFn signature.
 * @param state Used to preserve the attempted URL as a returnUrl for after login.
 * @returns True if signed in, otherwise a UrlTree redirecting to the login page.
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } });
};
