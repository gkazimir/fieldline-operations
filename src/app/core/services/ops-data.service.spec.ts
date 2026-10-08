import { TestBed } from '@angular/core/testing';
import { OpsDataService } from './ops-data.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('OpsDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OpsDataService, provideHttpClient(), provideHttpClientTesting()],
    });
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  it('loads valid jobs and technicians and clears their errors', () => {
    const service = TestBed.inject(OpsDataService);
    const httpMock = TestBed.inject(HttpTestingController);

    const jobs = [
      {
        id: 'job-1001',
        customerId: 'cust-01',
        customer: 'Riverside Cafe',
        serviceType: 'HVAC maintenance',
        neighborhood: 'Old Town',
        scheduledAt: '2026-08-27T09:00:00Z',
        status: 'assigned',
        technicianId: 't-01',
        revenue: 240,
      },
    ];

    const technicians = [{ id: 't-01', name: 'Maya Thompson', skill: 'HVAC' }];

    httpMock.expectOne('/mock/jobs.json').flush(jobs);
    httpMock.expectOne('/mock/technicians.json').flush(technicians);

    expect(service.jobs()).toEqual(jobs);
    expect(service.technicians()).toEqual(technicians);
    expect(service.jobsErrorState()).toBeNull();
    expect(service.techniciansErrorState()).toBeNull();
  });

  it('rejects jobs when revenue has the wrong type', () => {
    const service = TestBed.inject(OpsDataService);
    const httpMock = TestBed.inject(HttpTestingController);

    const jobs = [
      {
        id: 'job-1001',
        customerId: 'cust-01',
        customer: 'Riverside Cafe',
        serviceType: 'HVAC maintenance',
        neighborhood: 'Old Town',
        scheduledAt: '2026-08-27T09:00:00Z',
        status: 'assigned',
        technicianId: 't-01',
        revenue: '240', // Invalid revenue type (should be a number)
      },
    ];

    const technicians = [{ id: 't-01', name: 'Maya Thompson', skill: 'HVAC' }];

    httpMock.expectOne('/mock/jobs.json').flush(jobs);
    httpMock.expectOne('/mock/technicians.json').flush(technicians);

    expect(service.jobs()).toHaveLength(0);
    expect(service.jobsErrorState()).toBe('Jobs response has an invalid format.');
    expect(service.technicians()).toEqual(technicians);
    expect(service.techniciansErrorState()).toBeNull();
  });

  it('sets a load error when the jobs request returns HTTP 500', () => {
    const service = TestBed.inject(OpsDataService);
    const httpMock = TestBed.inject(HttpTestingController);

    const technicians = [{ id: 't-01', name: 'Maya Thompson', skill: 'HVAC' }];

    httpMock.expectOne('/mock/jobs.json').flush('Server error', {
      status: 500,
      statusText: 'Server Error',
    });
    httpMock.expectOne('/mock/technicians.json').flush(technicians);

    expect(service.jobs()).toHaveLength(0);
    expect(service.jobsErrorState()).toBe('Failed to load jobs.');
    expect(service.technicians()).toEqual(technicians);
    expect(service.techniciansErrorState()).toBeNull();
  });

  it('loads empty jobs and technicians', () => {
    const service = TestBed.inject(OpsDataService);
    const httpMock = TestBed.inject(HttpTestingController);

    const jobs: unknown[] = [];

    const technicians = [{ id: 't-01', name: 'Maya Thompson', skill: 'HVAC' }];

    httpMock.expectOne('/mock/jobs.json').flush(jobs);
    httpMock.expectOne('/mock/technicians.json').flush(technicians);

    expect(service.jobs()).toHaveLength(0);
    expect(service.jobsErrorState()).toBeNull();
    expect(service.technicians()).toEqual(technicians);
    expect(service.techniciansErrorState()).toBeNull();
  });

  it('rejects technicians when skill is not an allowed value', () => {
    const service = TestBed.inject(OpsDataService);
    const httpMock = TestBed.inject(HttpTestingController);

    const jobs = [
      {
        id: 'job-1001',
        customerId: 'cust-01',
        customer: 'Riverside Cafe',
        serviceType: 'HVAC maintenance',
        neighborhood: 'Old Town',
        scheduledAt: '2026-08-27T09:00:00Z',
        status: 'assigned',
        technicianId: 't-01',
        revenue: 240,
      },
    ];

    const technicians = [{ id: 't-01', name: 'Maya Thompson', skill: 'Invalid' }];

    httpMock.expectOne('/mock/jobs.json').flush(jobs);
    httpMock.expectOne('/mock/technicians.json').flush(technicians);

    expect(service.technicians()).toHaveLength(0);
    expect(service.techniciansErrorState()).toBe('Technicians response has an invalid format.');
    expect(service.jobs()).toEqual(jobs);
    expect(service.jobsErrorState()).toBeNull();
  });
});
