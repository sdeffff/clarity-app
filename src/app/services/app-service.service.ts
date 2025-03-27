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
  getUnisData(): Observable<universityModel[]> {
    return this.http.get<universityModel[]>(`${environment.apiUrl}/unis`);
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

  /**
   * 
   * @param subjectFile - file of media we want to add to database
   * @param subject - subject name to post to the url
   * @returns an observable with object where link to media is located
   */
  addSubjectMaterialToStorage(subjectFile: File, subject: string): Observable<{fileUrl: string}> {
    const formData = new FormData();
    formData.append('file', subjectFile);
    formData.append('subject', subject);

    return this.http.post<any>(`${environment.apiUrl}/subject-data/${subject}/add-material`, 
      formData
    )
  }
  
  addAssignmentDataToDB(data: subjectDataModel): Observable<any> {
    let httpOptions = {
      headers: this.headerBuilder.addContentType().build(),
    };

    return this.http.post<any>(`${environment.apiUrl}/${data.uni}/subject-data/${data.subject}`, {
      subject: data.subject,
      assignmentname: data.assignmentname,
      assignmentmedia: data.assignmentmedia,
    },
    httpOptions
    )
  }
}