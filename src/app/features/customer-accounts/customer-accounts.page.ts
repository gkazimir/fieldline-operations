import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  CustomerAccountSummary,
  CustomerDataService,
} from '../../core/services/customer-data.service';

@Component({
  selector: 'app-customer-accounts-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe],
  templateUrl: './customer-accounts.page.html',
  styleUrl: './customer-accounts.page.scss',
})
export class CustomerAccountsPage {
  private readonly customerData = inject(CustomerDataService);

  protected readonly accounts = this.customerData.prioritizedAccounts;

  /**
   * Derives a human-readable priority label from open issues and account tier.
   * @param account The account summary to evaluate.
   * @returns "High" if it has open issues, "Elevated" for VIP accounts, otherwise "Normal".
   */
  protected priorityLabel(account: CustomerAccountSummary): string {
    if (account.openIssues > 0) {
      return 'High';
    }
    return account.tier === 'vip' ? 'Elevated' : 'Normal';
  }
}
