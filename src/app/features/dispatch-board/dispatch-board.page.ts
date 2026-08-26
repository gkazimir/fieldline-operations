import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { JobStatus, OpsDataService } from '../../core/services/ops-data.service';
import { formatJobStatus } from '../../core/utils/job-format.util';

/** Filters jobs by whether they currently have a technician assigned. */
type AssignmentFilter = 'all' | 'assigned' | 'unassigned';

interface FilterOption<T> {
  readonly label: string;
  readonly value: T;
}

@Component({
  selector: 'app-dispatch-board-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, InputTextModule, SelectModule],
  templateUrl: './dispatch-board.page.html',
  styleUrl: './dispatch-board.page.scss',
})
export class DispatchBoardPage {
  private readonly opsData = inject(OpsDataService);

  protected readonly technicians = this.opsData.technicians;
  protected readonly technicianOptions = computed(() => [...this.technicians()]);
  protected readonly formatStatus = formatJobStatus;

  protected readonly statusOptions: FilterOption<JobStatus | 'all'>[] = [
    { label: 'All statuses', value: 'all' },
    { label: 'New', value: 'new' },
    { label: 'Assigned', value: 'assigned' },
    { label: 'In progress', value: 'in-progress' },
    { label: 'Done', value: 'done' },
    { label: 'Issue', value: 'issue' },
  ];

  protected readonly assignmentOptions: FilterOption<AssignmentFilter>[] = [
    { label: 'All jobs', value: 'all' },
    { label: 'Unassigned only', value: 'unassigned' },
    { label: 'Assigned only', value: 'assigned' },
  ];

  protected readonly searchTerm = signal('');
  protected readonly statusFilter = signal<JobStatus | 'all'>('all');
  protected readonly assignmentFilter = signal<AssignmentFilter>('all');

  protected readonly jobs = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const status = this.statusFilter();
    const assignment = this.assignmentFilter();

    return this.opsData.jobs().filter((job) => {
      const matchesTerm =
        term.length === 0 ||
        job.customer.toLowerCase().includes(term) ||
        job.neighborhood.toLowerCase().includes(term);
      const matchesStatus = status === 'all' || job.status === status;
      const matchesAssignment =
        assignment === 'all' ||
        (assignment === 'unassigned' ? job.technicianId === null : job.technicianId !== null);

      return matchesTerm && matchesStatus && matchesAssignment;
    });
  });

  protected readonly unassignedCount = computed(
    () => this.opsData.jobs().filter((job) => job.technicianId === null).length,
  );

  protected readonly assignedCount = computed(
    () => this.opsData.jobs().filter((job) => job.technicianId !== null).length,
  );

  protected updateSearchTerm(value: string): void {
    this.searchTerm.set(value);
  }

  protected updateStatusFilter(value: JobStatus | 'all'): void {
    this.statusFilter.set(value);
  }

  protected updateAssignmentFilter(value: AssignmentFilter): void {
    this.assignmentFilter.set(value);
  }

  protected assignTechnician(jobId: string, technicianId: string): void {
    this.opsData.assignTechnician(jobId, technicianId);
  }

  /**
   * Resolves a technician id to a display name for the dispatch table.
   * @param technicianId The assigned technician's id, or null if unassigned.
   * @returns The technician's name, "Unassigned", or "Unknown" if the id has no match.
   */
  protected technicianName(technicianId: string | null): string {
    if (!technicianId) {
      return 'Unassigned';
    }
    return (
      this.technicians().find((technician) => technician.id === technicianId)?.name ?? 'Unknown'
    );
  }
}
