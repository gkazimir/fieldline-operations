import { JobStatus } from '../services/ops-data.service';

export function formatJobStatus(status: JobStatus): string {
  switch (status) {
    case 'new':
      return 'New';
    case 'assigned':
      return 'Assigned';
    case 'in-progress':
      return 'In progress';
    case 'done':
      return 'Done';
    case 'issue':
      return 'Issue';
    default:
      return 'Unknown';
  }
}
