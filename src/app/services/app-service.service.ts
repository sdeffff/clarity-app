import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

import { universityModel } from '../models/university.model';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  constructor(private http: HttpClient) {};

  getUnis(): Observable<universityModel[]> {
    return this.http.get<universityModel[]>(`${environment.apiUrl}/unis`);
  }

  getUniInfo(uni: string): Observable<universityModel[]> {
    return this.http.get<universityModel[]>(`${environment.apiUrl}/${uni}/info`);
  }
}