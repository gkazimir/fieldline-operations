import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { OpsDataService } from '../../core/services/ops-data.service';

@Component({
  selector: 'app-field-operations-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe],
  templateUrl: './field-operations.page.html',
  styleUrl: './field-operations.page.scss',
})
export class FieldOperationsPage {
  private readonly opsData = inject(OpsDataService);

  protected readonly incidentJobs = computed(() =>
    this.opsData.jobs().filter((job) => ['issue', 'in-progress'].includes(job.status)),
  );
}
