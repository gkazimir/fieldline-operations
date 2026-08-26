import { computed, inject, Injectable, signal } from '@angular/core';
import { Customer } from '../models/customer.model';
import { ApiService } from './api.service';
import { OpsDataService } from './ops-data.service';

export type { Customer };

/** A customer enriched with metrics derived from its current service jobs. */
export interface CustomerAccountSummary extends Customer {
  readonly activeJobs: number;
  readonly openIssues: number;
  readonly lastActivityAt: string | null;
}

/**
 * Holds the customer directory and joins it with job data from
 * `OpsDataService` to produce account-level activity summaries.
 */
@Injectable({ providedIn: 'root' })
export class CustomerDataService {
  private readonly api = inject(ApiService);
  private readonly opsData = inject(OpsDataService);

  private readonly customersState = signal<readonly Customer[]>([]);

  constructor() {
    this.api
      .getCollection<Customer>('mock/customers.json')
      .subscribe((customers) => this.customersState.set(customers));
  }

  readonly customers = computed(() => this.customersState());

  readonly accountSummaries = computed<readonly CustomerAccountSummary[]>(() => {
    const jobs = this.opsData.jobs();

    return this.customersState().map((customer) => {
      const customerJobs = jobs.filter((job) => job.customerId === customer.id);
      const activeJobs = customerJobs.filter((job) =>
        ['new', 'assigned', 'in-progress'].includes(job.status),
      ).length;
      const openIssues = customerJobs.filter((job) => job.status === 'issue').length;
      const lastActivityAt =
        customerJobs
          .map((job) => job.scheduledAt)
          .sort()
          .at(-1) ?? null;

      return { ...customer, activeJobs, openIssues, lastActivityAt };
    });
  });

  /** Accounts sorted so open issues surface first, then higher-tier customers. */
  readonly prioritizedAccounts = computed<readonly CustomerAccountSummary[]>(() =>
    [...this.accountSummaries()].sort((a, b) => {
      if (a.openIssues !== b.openIssues) return b.openIssues - a.openIssues;
      const tierWeight: Record<Customer['tier'], number> = { vip: 2, priority: 1, standard: 0 };
      return tierWeight[b.tier] - tierWeight[a.tier];
    }),
  );
}
