/** Service tier controlling SLA priority for a customer account. */
export type CustomerTier = 'standard' | 'priority' | 'vip';

/** A customer account that service jobs are performed for. */
export interface Customer {
  readonly id: string;
  readonly name: string;
  readonly neighborhood: string;
  readonly tier: CustomerTier;
  readonly contactEmail: string;
  readonly contactPhone: string;
}
