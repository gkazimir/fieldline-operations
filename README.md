# SkillSprint Hub

SkillSprint Hub is a modern Angular neighborhood service operations platform.
It models practical dispatch workflows: active jobs, technician capacity, backlog visibility,
customer accounts, and reporting, while still serving as a strong Angular learning project.

## Stack

- Angular 21
- TypeScript (strict)
- PrimeNG 21 + PrimeUIX theme preset
- ESLint + angular-eslint
- Prettier
- Husky + lint-staged
- Unit tests: `ng test` (Vitest-powered Angular unit test builder)
- E2E tests: Playwright

## Current app structure

Feature-based routing and folders:

- `auth` (`/auth/login`)
- `dashboard` (`/app/dashboard`)
- `dispatch-board` (`/app/dispatch-board`)
- `field-operations` (`/app/field-operations`)
- `customer-accounts` (`/app/customer-accounts`)
- `operations-reports` (`/app/operations-reports`)
- `settings` (`/app/settings`)

App shell and navigation live in `src/app/features/app-shell`.

Core operations data is centralized in `src/app/core/services/ops-data.service.ts`.

Route configuration is in `src/app/app.routes.ts`.

## Current implementation status

Implemented:

- Operations dashboard summary and attention-focused quick actions
- Dispatch board table-like operational layout
- Field operations incident monitor view
- Customer accounts prioritization list
- Operations reports summary/trend placeholder
- Settings with explicit PrimeNG examples (`p-select`, `p-multiSelect`)

Planned next:

- dispatch assignment workflow (dialog + service wiring)
- richer reports with real trend data
- auth hardening (typed reactive form, role-based redirect, guards)
- expanded unit/e2e coverage for operations flows

For a detailed technical/design snapshot, see `CURRENT_PLAN_AND_DESIGN.md`.

## Development

Install dependencies:

```bash
npm install
```

Run local dev server:

```bash
npm run start
```

Then open `http://localhost:4200`.

## Scripts

- `npm run start` - start dev server
- `npm run build` - production build
- `npm run watch` - development build in watch mode
- `npm run lint` - run ESLint
- `npm run lint:fix` - run ESLint with auto-fix
- `npm run format:check` - check formatting with Prettier
- `npm run format:write` - apply Prettier formatting
- `npm run test:unit` - run unit tests once
- `npm run test:unit:watch` - run unit tests in watch mode
- `npm run test:e2e` - run Playwright tests
- `npm run test:e2e:watch` - run Playwright UI mode

## Git hooks

Husky hooks are enabled via the `prepare` script.

Current behavior:

- pre-commit:
  - run `lint-staged` (ESLint on staged `*.ts` and `*.html`)
  - run `npm run format:check`
- pre-push:
  - run `npm run test:unit`

## PrimeNG notes

PrimeNG is configured globally in `src/app/app.config.ts` using `providePrimeNG(...)` and Aura preset.

The Settings feature contains practical PrimeNG examples:

- `p-select`
- `p-multiSelect`
- `p-button`

Some feature areas intentionally include roadmap placeholders so you can extend with
additional PrimeNG components (e.g. data table, dialog workflows, SLA charts).

The settings page includes explicit learning examples for:

- single-value selection with `p-select`
- multi-value selection with `p-multiSelect`
- form-safe `ngModel` usage inside a `<form>` (with `name` attributes)

## Accessibility and design principles

The project follows a WCAG-aware baseline:

- visible focus states
- skip link for keyboard navigation
- semantic landmarks and headings
- restrained, production-like visual style (no gimmicky neon styling)

## Build output

Production build output is generated in:

`dist/skillsprint-hub`
