import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { AppService } from '../../services/app-service.service';

import { subjectDataModel } from '../../models/subject-data.model';
import { concatMap } from 'rxjs';

@Component({
  selector: 'app-subject-data',
  standalone: true,
  imports: [NgFor, NgIf, MatButtonModule],
  providers: [AppService],
  templateUrl: './subject-data.component.html',
  styleUrl: './subject-data.component.scss'
})
export class SubjectDataComponent {
  constructor(
    private service: AppService,
    private activeRouter: ActivatedRoute,
    private router: Router
  ) { };

  protected data: subjectDataModel[] = [];
  protected isEmpty: boolean = false;

  protected selectedFile: File | null = null;
  private imgLink: string = "";

  protected onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log("Selected file:", this.selectedFile); // File object
    }
  }

  protected uploadImg(e: Event) {
    e.preventDefault();
    
    if(!this.selectedFile) {
      alert("Please upload an image!");
      return;
    }

    const urlData = this.getUrlData();
    const subjectName = urlData[urlData.length - 1];

    this.service.addSubjectMaterialToStorage(this.selectedFile!, subjectName).pipe(
      concatMap((res) => {
        const passingData = {
          uni: urlData[0],
          subject: subjectName,
          assignmentname: "asd",  
          assignmentmedia: res.fileUrl,
        };

        console.log(passingData);

        return this.service.addAssignmentDataToDB(passingData);
      })
    ).subscribe({
      next: (res) => {
        console.log(res)
      },

      error: (err) => {
        console.log(err);
      }
    })
  }

  private getUrlData(): string[] {
    let res: string[] = [];

    this.activeRouter.paramMap.subscribe(params => {
      res = [
        params.get("uni")!,
        params.get("faculty")!,
        params.get("year")!,
        params.get("season")!,
        params.get("subject")!,
      ]
    });

    return res;
  }

  private checkSubject(): boolean {
    let isOkay = true;

    const urlData = this.getUrlData();

    this.service.getFacultySubjects(urlData).subscribe({
      next: (res) => {
        if(!res[0].subjects.includes(urlData[urlData.length - 1])) {
          this.router.navigate([`${urlData[0]}/${urlData[1]}/${urlData[2]}/${urlData[3]}/select-subject`]);
          isOkay = false;
        }
      },

      error: (err) => {
        isOkay = false;
        //Make error handling correct, because this error causes server to get down

        console.log(err);

        alert("Incorrect url!");
        
        // this.router.navigate(["/select-uni"]);
      }
    });

    return isOkay;
  }

  private fetchSubjectData(): void {
    let subjectName = this.getUrlData()[4];


    this.service.getSubjectData(subjectName).subscribe({
      next: (res) => {
        if(res.length > 0) {
          this.data = res;
        } else {
          this.isEmpty = true;
        }
      },

      error: (err) => {
        console.log(err);
      }
    })
  }

  ngOnInit(): void {
    if(this.checkSubject()) {
      this.fetchSubjectData();
    }
  }
}