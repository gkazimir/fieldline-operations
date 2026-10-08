import * as z from 'zod';

const technicianSkills = z.enum(['Appliance repair', 'Electrical', 'General maintenance', 'HVAC']);

export const technicianSchema = z.object({
  id: z.string(),
  name: z.string(),
  skill: technicianSkills,
});

export const techniciansSchema = z.array(technicianSchema);

export type Technician = z.infer<typeof technicianSchema>;
export type TechnicianSkills = z.infer<typeof technicianSkills>;
