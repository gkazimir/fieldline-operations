import { computed, Injectable, signal } from '@angular/core';

export type JobStatus = 'new' | 'assigned' | 'in-progress' | 'done' | 'issue';

export interface Technician {
  readonly id: string;
  readonly name: string;
  readonly skill: string;
}

export interface ServiceJob {
  readonly id: string;
  readonly customer: string;
  readonly serviceType: string;
  readonly neighborhood: string;
  readonly scheduledAt: string;
  readonly status: JobStatus;
  readonly technicianId: string | null;
  readonly revenue: number;
}

export interface DashboardMetric {
  readonly label: string;
  readonly value: number;
  readonly suffix?: string;
}

export interface OperationsSnapshot {
  readonly activeJobs: readonly ServiceJob[];
  readonly technicians: readonly Technician[];
  readonly metrics: readonly DashboardMetric[];
  readonly backlog: number;
}

@Injectable({ providedIn: 'root' })
export class OpsDataService {
  private readonly techniciansState = signal<readonly Technician[]>([
    { id: 't-01', name: 'Maya Thompson', skill: 'HVAC' },
    { id: 't-02', name: 'Noah Alvarez', skill: 'Electrical' },
    { id: 't-03', name: 'Priya Desai', skill: 'Appliance repair' },
    { id: 't-04', name: 'Ethan Brooks', skill: 'General maintenance' },
  ]);

  private readonly jobsState = signal<readonly ServiceJob[]>([
    {
      id: 'job-1001',
      customer: 'Riverside Cafe',
      serviceType: 'HVAC maintenance',
      neighborhood: 'Old Town',
      scheduledAt: '2026-08-27T09:00:00Z',
      status: 'assigned',
      technicianId: 't-01',
      revenue: 240,
    },
    {
      id: 'job-1002',
      customer: 'Bright Dental',
      serviceType: 'Electrical diagnostics',
      neighborhood: 'Market District',
      scheduledAt: '2026-08-27T11:30:00Z',
      status: 'in-progress',
      technicianId: 't-02',
      revenue: 380,
    },
    {
      id: 'job-1003',
      customer: 'Northside Apartments',
      serviceType: 'Appliance repair',
      neighborhood: 'Northside',
      scheduledAt: '2026-08-27T13:15:00Z',
      status: 'new',
      technicianId: null,
      revenue: 175,
    },
    {
      id: 'job-1004',
      customer: 'WellFit Gym',
      serviceType: 'Safety inspection',
      neighborhood: 'Harbor',
      scheduledAt: '2026-08-27T15:30:00Z',
      status: 'issue',
      technicianId: 't-04',
      revenue: 460,
    },
    {
      id: 'job-1005',
      customer: 'Nora Patel',
      serviceType: 'General maintenance',
      neighborhood: 'West End',
      scheduledAt: '2026-08-27T16:45:00Z',
      status: 'done',
      technicianId: 't-03',
      revenue: 210,
    },
  ]);

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
    customer: string;
    serviceType: string;
    neighborhood: string;
    scheduledAt: string;
  }): void {
    const id = `job-${Math.floor(Math.random() * 9000) + 1000}`;
    this.jobsState.update((jobs) => [
      {
        id,
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
