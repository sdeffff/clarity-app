import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  constructor(private http: HttpClient) {};

  getUnis(): Observable<{uni: string}[]> {
    return this.http.get<{uni: string}[]>(`${environment.apiUrl}/unis`);
  }

  getFaculties(uni: string): Observable<{faculty: string}[]> {
    return this.http.get<{faculty: string}[]>(`${environment.apiUrl}/${uni}/faculties/`);
  }
}