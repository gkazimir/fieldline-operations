import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { OpsDataService } from '../../core/services/ops-data.service';

import { formatJobStatus } from '../../core/utils/job-format.util';

@Component({
  selector: 'app-dashboard-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ButtonModule, CardModule],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
})
export class DashboardPage {
  private readonly opsData = inject(OpsDataService);

  protected readonly metrics = this.opsData.metrics;

  protected readonly headline = computed(() => {
    const jobs = this.opsData.jobs();
    const nextCritical = jobs.find((job) => job.status === 'issue') ?? jobs[0];

    if (!nextCritical) {
      return {
        focus: 'No active incidents',
        action: 'All clear - schedule preventive maintenance checks.',
      };
    }

    return {
      focus: `${nextCritical.customer} (${formatJobStatus(nextCritical.status)})`,
      action: `Prioritize ${nextCritical.serviceType} in ${nextCritical.neighborhood}.`,
    };
  });

  protected readonly quickJobs = computed(() => this.opsData.jobs().slice(0, 3));
}
