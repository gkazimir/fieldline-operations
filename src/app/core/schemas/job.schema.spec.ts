import { describe, expect, it } from 'vitest';
import * as z from 'zod';
import { jobsSchema, serviceJobSchema, type ServiceJob } from './job.schema';

const validJob = {
  id: 'job-1001',
  customerId: 'cust-01',
  customer: 'Riverside Cafe',
  serviceType: 'HVAC maintenance',
  neighborhood: 'Old Town',
  scheduledAt: '2026-08-27T09:00:00Z',
  status: 'assigned',
  technicianId: 't-01',
  revenue: 240,
} satisfies ServiceJob;

describe('serviceJobSchema', () => {
  it('accepts a valid job and returns its parsed data', () => {
    expect(serviceJobSchema.parse(validJob)).toEqual(validJob);
  });

  it('rejects an unknown status', () => {
    const result = serviceJobSchema.safeParse({ ...validJob, status: 'cancelled' });

    expect(result.success).toBe(false);
    expect(result.error?.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ path: ['status'] })]),
    );
  });

  it('accepts a null technician ID', () => {
    const input = { ...validJob, technicianId: null };

    expect(serviceJobSchema.parse(input)).toEqual(input);
  });

  it('accepts an ISO datetime with a timezone offset', () => {
    const input = { ...validJob, scheduledAt: '2026-08-27T11:00:00+02:00' };

    expect(serviceJobSchema.parse(input)).toEqual(input);
  });

  it('rejects an invalid datetime string', () => {
    const result = serviceJobSchema.safeParse({ ...validJob, scheduledAt: 'tomorrow' });

    expect(result.success).toBe(false);
    expect(result.error?.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ path: ['scheduledAt'] })]),
    );
  });

  it('rejects a missing required field', () => {
    const input: Record<string, unknown> = { ...validJob };
    delete input['id'];

    const result = serviceJobSchema.safeParse(input);

    expect(result.success).toBe(false);
    expect(result.error?.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ path: ['id'] })]),
    );
  });

  it('accepts extra fields but strips them from the output without changing the input', () => {
    const input = { ...validJob, internalNote: 'Added by the API' };
    const output = serviceJobSchema.parse(input);

    expect(output).toEqual(validJob);
    expect(output).not.toHaveProperty('internalNote');
    expect(input).toHaveProperty('internalNote', 'Added by the API');
  });

  it('rejects extra fields with a strict object schema', () => {
    const strictSchema = z.strictObject(serviceJobSchema.shape);
    const result = strictSchema.safeParse({ ...validJob, internalNote: 'Added by the API' });

    expect(result.success).toBe(false);
    expect(result.error?.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'unrecognized_keys', keys: ['internalNote'] }),
      ]),
    );
  });

  it('preserves extra fields with a loose object schema', () => {
    const looseSchema = z.looseObject(serviceJobSchema.shape);
    const input = { ...validJob, internalNote: 'Added by the API' };

    expect(looseSchema.parse(input)).toEqual(input);
  });
});

describe('jobsSchema', () => {
  it('accepts a collection of valid jobs', () => {
    const input = [validJob, { ...validJob, id: 'job-1002', technicianId: null }];

    expect(jobsSchema.parse(input)).toEqual(input);
  });

  it('accepts an empty collection', () => {
    expect(jobsSchema.parse([])).toEqual([]);
  });

  it('rejects the collection when one job is invalid and identifies its index and field', () => {
    const result = jobsSchema.safeParse([validJob, { ...validJob, revenue: '240' }]);

    expect(result.success).toBe(false);
    expect(result.error?.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ path: [1, 'revenue'] })]),
    );
  });
});
