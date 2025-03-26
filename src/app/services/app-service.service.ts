import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

import { HttpHeaderBuilderService } from './http-header-builder.service';

//Models:
import { universityModel } from '../models/university.model';
import { facultySubjects } from '../models/faculty-subjects.model';
import { subjectDataModel } from '../models/subject-data.model';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  constructor(
    private http: HttpClient,
    private headerBuilder: HttpHeaderBuilderService,
  ) {};

  //Method to get all of the universities and their info
  getUnis(): Observable<universityModel[]> {
    return this.http.get<universityModel[]>(`${environment.apiUrl}/unis`);
  }

  /**
   * 
   * @param uni - current university
   * @returns an Observable where stored faculties list and info about them (like year and seasons)
   */
  getUniInfo(uni: string): Observable<universityModel[]> {
    return this.http.get<universityModel[]>(`${environment.apiUrl}/${uni}/info`);
  }

  /**
   * 
   * @param apiData - array of data to get sibjects fot the exact uni, faculty, year and season
   * @returns an Observable of subject list, faculty, year and season where this subjects are
   */
  getFacultySubjects(apiData: string[]): Observable<facultySubjects[]> {
    return this.http.get<facultySubjects[]>(`${environment.apiUrl}/${apiData[0]}/${apiData[1]}/${apiData[2]}/${apiData[3]}`);
  }

  /**
   * 
   * @param subject - name of the subject using which we will be able to get info about current subject
   * @returns - an observable array where all of the assignments for subject are contained
   */
  getSubjectData(subject: string): Observable<subjectDataModel[]> {
    return this.http.get<subjectDataModel[]>(`${environment.apiUrl}/subject-data/${subject}`)
  } 

  addSubjectMaterial(subjectFile: File, subject: string): Observable<any> {
    let httpOptions = {
      headers: this.headerBuilder.addContentType().build()
    }

    const formData = new FormData();
    formData.append('file', subjectFile);
    formData.append('subject', subject);

    return this.http.post<any>(`${environment.apiUrl}/subject-data/${subject}/add-material`, 
      formData
    )
  }
}