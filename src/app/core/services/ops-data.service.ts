import { computed, inject, Injectable, signal } from '@angular/core';
import { DashboardMetric, OperationsSnapshot } from '../models/dashboard-metric.model';
import { JobStatus, ServiceJob } from '../models/job.model';
import { Technician } from '../models/technician.model';
import { ApiService } from './api.service';
import { jobsSchema } from '../schemas/job.schema';
import { techniciansSchema } from '../schemas/technician.schema';

export type { JobStatus, ServiceJob, Technician, DashboardMetric, OperationsSnapshot };

/**
 * Holds the operations dataset (jobs + technicians) and derived dashboard
 * metrics. Data is loaded once via `ApiService` and kept in signals so every
 * page reacts to assignments and status changes made elsewhere in the app.
 */
@Injectable({ providedIn: 'root' })
export class OpsDataService {
  private readonly api = inject(ApiService);

  private readonly techniciansState = signal<readonly Technician[]>([]);
  private readonly jobsState = signal<readonly ServiceJob[]>([]);

  private readonly techniciansError = signal<string | null>(null);
  private readonly jobsError = signal<string | null>(null);

  public readonly techniciansErrorState = this.techniciansError.asReadonly();
  public readonly jobsErrorState = this.jobsError.asReadonly();

  constructor() {
    this.api.getUnknown('mock/technicians.json').subscribe({
      next: (technicians) => {
        const result = techniciansSchema.safeParse(technicians);
        if (result.success) {
          this.techniciansState.set(result.data);
          this.techniciansError.set(null);
        } else {
          console.error('Technicians response has an invalid format.', result.error);
          this.techniciansError.set('Technicians response has an invalid format.');
        }
      },
      error: (err) => {
        console.error('Failed to load technicians.', err);
        this.techniciansError.set('Failed to load technicians.');
      },
    });

    this.api.getUnknown('mock/jobs.json').subscribe({
      next: (jobs) => {
        const result = jobsSchema.safeParse(jobs);
        if (result.success) {
          this.jobsState.set(result.data);
          this.jobsError.set(null);
        } else {
          console.error('Jobs response has an invalid format.', result.error);
          this.jobsError.set('Jobs response has an invalid format.');
        }
      },
      error: (err) => {
        console.error('Failed to load jobs.', err);
        this.jobsError.set('Failed to load jobs.');
      },
    });
  }

  readonly technicians = computed(() => this.techniciansState());
  readonly jobs = computed(() => this.jobsState());

  readonly metrics = computed<readonly DashboardMetric[]>(() => {
    const jobs = this.jobsState();
    const active = jobs.filter((job) =>
      ['new', 'assigned', 'in-progress'].includes(job.status),
    ).length;
    const completedToday = jobs.filter((job) => job.status === 'done').length;
    const slaRisk = jobs.filter((job) => job.status === 'issue').length;
    const revenue = jobs.reduce((sum, job) => sum + job.revenue, 0);

    return [
      { label: 'Active jobs', value: active },
      { label: 'Completed today', value: completedToday },
      { label: 'SLA at risk', value: slaRisk },
      { label: 'Revenue pipeline', value: revenue, suffix: ' USD' },
    ];
  });

  readonly backlog = computed(() => this.jobsState().filter((job) => job.status === 'new').length);

  readonly snapshot = computed<OperationsSnapshot>(() => ({
    activeJobs: this.jobsState(),
    technicians: this.techniciansState(),
    metrics: this.metrics(),
    backlog: this.backlog(),
  }));

  assignTechnician(jobId: string, technicianId: string): void {
    this.jobsState.update((jobs) =>
      jobs.map((job) =>
        job.id === jobId
          ? {
              ...job,
              technicianId,
              status: job.status === 'new' ? 'assigned' : job.status,
            }
          : job,
      ),
    );
  }

  updateJobStatus(jobId: string, status: JobStatus): void {
    this.jobsState.update((jobs) =>
      jobs.map((job) => (job.id === jobId ? { ...job, status } : job)),
    );
  }

  addQuickJob(input: {
    customerId: string;
    customer: string;
    serviceType: string;
    neighborhood: string;
    scheduledAt: string;
  }): void {
    const id = `job-${Math.floor(Math.random() * 9000) + 1000}`;
    this.jobsState.update((jobs) => [
      {
        id,
        customerId: input.customerId,
        customer: input.customer,
        serviceType: input.serviceType,
        neighborhood: input.neighborhood,
        scheduledAt: input.scheduledAt,
        status: 'new',
        technicianId: null,
        revenue: 150,
      },
      ...jobs,
    ]);
  }
}
