import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [ApiService, provideHttpClient(), provideHttpClientTesting()],
    });
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });
  it('should be created', () => {
    const service: ApiService = TestBed.inject(ApiService);
    expect(service).toBeTruthy();
  });

  it('should make a GET request and return the expected data', () => {
    const service: ApiService = TestBed.inject(ApiService);
    const httpMock: HttpTestingController = TestBed.inject(HttpTestingController);

    const mockResponse = [{ id: 'job-1' }];

    service.getCollection('mock/jobs.json').subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('/mock/jobs.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should make a GET request and return the error 500', () => {
    const service: ApiService = TestBed.inject(ApiService);
    const httpMock: HttpTestingController = TestBed.inject(HttpTestingController);

    const mockResponse = [{ id: 'job-1' }];

    service.getCollection('mock/jobs.json').subscribe({
      next: (response) => {
        expect(response).toEqual(mockResponse);
      },
      error: (error) => {
        expect(error.status).toBe(500);
      },
    });
    const req = httpMock.expectOne('/mock/jobs.json');
    expect(req.request.method).toBe('GET');

    req.flush('Server error', {
      status: 500,
      statusText: 'Server Error',
    });
  });
});
