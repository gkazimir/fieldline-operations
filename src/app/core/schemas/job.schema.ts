import * as z from 'zod';

export const jobStatusSchema = z.enum(['new', 'assigned', 'in-progress', 'done', 'issue']);

export const serviceJobSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  customer: z.string(),
  serviceType: z.string(),
  neighborhood: z.string(),
  scheduledAt: z.iso.datetime({ offset: true }),
  status: jobStatusSchema,
  technicianId: z.string().nullable(),
  revenue: z.number(),
});

export const jobsSchema = z.array(serviceJobSchema);

export type JobStatus = z.infer<typeof jobStatusSchema>;
export type ServiceJob = z.infer<typeof serviceJobSchema>;
export type Jobs = z.infer<typeof jobsSchema>;
