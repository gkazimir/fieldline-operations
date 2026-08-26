import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { OpsDataService } from '../../core/services/ops-data.service';

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
}
