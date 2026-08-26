import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { OpsDataService } from '../../core/services/ops-data.service';
import { formatJobStatus } from '../../core/utils/job-format.util';

@Component({
  selector: 'app-dispatch-board-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dispatch-board.page.html',
  styleUrl: './dispatch-board.page.scss',
})
export class DispatchBoardPage {
  private readonly opsData = inject(OpsDataService);

  protected readonly jobs = this.opsData.jobs;

  protected readonly unassignedCount = computed(
    () => this.jobs().filter((job) => job.technicianId === null).length,
  );

  protected readonly assignedCount = computed(
    () => this.jobs().filter((job) => job.technicianId !== null).length,
  );

  protected readonly formatStatus = formatJobStatus;
}
