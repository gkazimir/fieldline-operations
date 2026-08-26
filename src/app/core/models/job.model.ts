/** Lifecycle state of a service job. */
export type JobStatus = 'new' | 'assigned' | 'in-progress' | 'done' | 'issue';

/** A single scheduled or in-progress service job performed for a customer. */
export interface ServiceJob {
  readonly id: string;
  readonly customerId: string;
  readonly customer: string;
  readonly serviceType: string;
  readonly neighborhood: string;
  readonly scheduledAt: string;
  readonly status: JobStatus;
  readonly technicianId: string | null;
  readonly revenue: number;
}
