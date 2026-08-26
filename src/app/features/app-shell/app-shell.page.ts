import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-app-shell-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, ButtonModule],
  templateUrl: './app-shell.page.html',
  styleUrl: './app-shell.page.scss',
})
export class AppShellPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly currentUser = this.authService.currentUser;

  /** Ends the mock session and returns to the login page. */
  protected signOut(): void {
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
  }
}
