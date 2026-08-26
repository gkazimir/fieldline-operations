import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Generic HTTP wrapper used by every domain data service in the app.
 * Components never call `HttpClient` directly; they go through a domain
 * service, which goes through this one. Today it reads static mock JSON
 * fixtures under `public/mock`; swapping to a real backend or a library
 * like TanStack Query later only means changing this file.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  /**
   * Fetches a JSON array from a path relative to the app's public assets.
   * @param path Path under `public/` to fetch, e.g. `mock/jobs.json`.
   * @returns The parsed collection once the request resolves.
   */
  getCollection<T>(path: string): Observable<T[]> {
    return this.http.get<T[]>(`/${path}`);
  }
}
