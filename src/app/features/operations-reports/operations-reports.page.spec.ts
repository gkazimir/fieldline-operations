import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { OperationsReportsPage } from './operations-reports.page';
import { OpsDataService, ServiceJob } from '../../core/services/ops-data.service';

const reportJobs: ServiceJob[] = [
  {
    id: 'job-1',
    customerId: 'customer-1',
    customer: 'Smith',
    serviceType: 'Repair',
    neighborhood: 'Central',
    scheduledAt: '2026-10-05',
    status: 'done',
    technicianId: 'tech-1',
    revenue: 150,
  },
  {
    id: 'job-2',
    customerId: 'customer-2',
    customer: 'Jones',
    serviceType: 'Inspection',
    neighborhood: 'North',
    scheduledAt: '2026-10-05',
    status: 'issue',
    technicianId: 'tech-2',
    revenue: 200,
  },
  {
    id: 'job-3',
    customerId: 'customer-3',
    customer: 'Lee',
    serviceType: 'Maintenance',
    neighborhood: 'South',
    scheduledAt: '2026-10-05',
    status: 'in-progress',
    technicianId: 'tech-1',
    revenue: 100,
  },
];

const opsDataMock = {
  snapshot: signal({
    activeJobs: reportJobs,
    technicians: [{ id: 'tech-1', name: 'Sam', skill: 'Repair' }],
    metrics: [],
    backlog: 0,
  }),
  jobs: signal(reportJobs),
};

describe('OperationsReports', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperationsReportsPage],
      providers: [
        {
          provide: OpsDataService,
          useValue: opsDataMock,
        },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(OperationsReportsPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('checks if the title "Reports" is displayed', () => {
    const fixture = TestBed.createComponent(OperationsReportsPage);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Reports');
  });

  it('checks the number of active jobs', () => {
    const fixture = TestBed.createComponent(OperationsReportsPage);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.textContent).toContain('Total active jobs: 3');
    expect(
      [...root.querySelectorAll('.trend-count')].map((element) => element.textContent?.trim()),
    ).toEqual(['1', '1', '1']);
  });
});
