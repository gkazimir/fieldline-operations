import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { OpsDataService } from '../../core/services/ops-data.service';

/** A single row in the job status breakdown bar chart. */
interface TrendRow {
  readonly label: string;
  readonly legendClass: string;
  readonly count: number;
  readonly percentage: number;
}

@Component({
  selector: 'app-operations-reports-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './operations-reports.page.html',
  styleUrl: './operations-reports.page.scss',
})
export class OperationsReportsPage {
  private readonly opsData = inject(OpsDataService);

  protected readonly reportLines = computed(() => {
    const snapshot = this.opsData.snapshot();
    return [
      `Total active jobs: ${snapshot.activeJobs.length}`,
      `Technicians available: ${snapshot.technicians.length}`,
      `Backlog waiting assignment: ${snapshot.backlog}`,
    ];
  });

  protected readonly trendRows = computed<readonly TrendRow[]>(() => {
    const jobs = this.opsData.jobs();
    const total = jobs.length || 1;
    const completed = jobs.filter((job) => job.status === 'done').length;
    const atRisk = jobs.filter((job) => job.status === 'issue').length;
    const inProgress = jobs.filter((job) => job.status === 'in-progress').length;

    return [
      {
        label: 'Completed jobs',
        legendClass: 'completed',
        count: completed,
        percentage: (completed / total) * 100,
      },
      {
        label: 'SLA at risk',
        legendClass: 'risk',
        count: atRisk,
        percentage: (atRisk / total) * 100,
      },
      {
        label: 'In progress',
        legendClass: 'incidents',
        count: inProgress,
        percentage: (inProgress / total) * 100,
      },
    ];
  });
}
