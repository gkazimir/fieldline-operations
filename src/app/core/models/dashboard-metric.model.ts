import { ServiceJob } from './job.model';
import { Technician } from './technician.model';

/** A single labeled KPI shown on the dashboard metrics grid. */
export interface DashboardMetric {
  readonly label: string;
  readonly value: number;
  readonly suffix?: string;
}

/** Aggregated view of the current operations state used across pages. */
export interface OperationsSnapshot {
  readonly activeJobs: readonly ServiceJob[];
  readonly technicians: readonly Technician[];
  readonly metrics: readonly DashboardMetric[];
  readonly backlog: number;
}
