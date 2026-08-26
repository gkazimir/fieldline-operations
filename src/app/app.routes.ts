import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'app',
    loadComponent: () => import('./features/app-shell/app-shell.page').then((m) => m.AppShellPage),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.page').then((m) => m.DashboardPage),
      },
      {
        path: 'dispatch-board',
        loadComponent: () =>
          import('./features/dispatch-board/dispatch-board.page').then((m) => m.DispatchBoardPage),
      },
      {
        path: 'field-operations',
        loadComponent: () =>
          import('./features/field-operations/field-operations.page').then(
            (m) => m.FieldOperationsPage,
          ),
      },
      {
        path: 'customer-accounts',
        loadComponent: () =>
          import('./features/customer-accounts/customer-accounts.page').then(
            (m) => m.CustomerAccountsPage,
          ),
      },
      {
        path: 'operations-reports',
        loadComponent: () =>
          import('./features/operations-reports/operations-reports.page').then(
            (m) => m.OperationsReportsPage,
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings.page').then((m) => m.SettingsPage),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
    ],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth/login',
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
