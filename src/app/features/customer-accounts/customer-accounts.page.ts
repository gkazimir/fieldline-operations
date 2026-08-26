import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { OpsDataService } from '../../core/services/ops-data.service';

@Component({
  selector: 'app-customer-accounts-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './customer-accounts.page.html',
  styleUrl: './customer-accounts.page.scss',
})
export class CustomerAccountsPage {
  private readonly opsData = inject(OpsDataService);

  protected readonly topCustomers = computed(() => this.opsData.jobs().slice(0, 5));
}
