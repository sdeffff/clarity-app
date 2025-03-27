import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgFor, NgIf } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { AppService } from '../../services/app-service.service';

import { subjectDataModel } from '../../models/subject-data.model';
import { numToStringMap } from '../../models/numToString.model';
import { concatMap } from 'rxjs';

//Popup window:
import { SubjectPopupComponent } from '../../components/subject-popup/subject-popup.component';

@Component({
  selector: 'app-select-assignment',
  standalone: true,
  imports: [NgFor, NgIf, MatButtonModule, MatDialogModule],
  providers: [AppService],
  templateUrl: './select-assignment.component.html',
  styleUrl: './select-assignment.component.scss'
})

//Page where user selects Assignments and other stuff for already selected subject
export class SelectAssignmentComponent {
  constructor(
    private service: AppService,
    private activeRouter: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) { };

  protected data: subjectDataModel[] = [];
  protected isEmpty: boolean = false;

  protected selectedFile: File | null = null;

  private ngOnInit(): void {
    if(this.checkRoute()) {
      this.fetchSubjectData();
    } else {
      alert("Wrong URL!");
      this.router.navigate(["/selection-page"]);
    }
  }

  /**
   * A function to get the data from the server
   * 
   */
    private fetchSubjectData(): void {
      let subjectName = this.getUrlData()[4];
  
  
      this.service.getSubjectData(subjectName).subscribe({
        next: (res) => {
          if(res.length > 0) this.data = res;
          else this.isEmpty = true;
        },
  
        error: (err) => {
          console.log(err);
        }
      })
    }

  /**
   * Function to upload assignment data to database
   * 
   * @param e - event of the clicked button to prevent page refrseshing
   * @returns 
   */
  protected uploadAssignment(e: Event) {
    e.preventDefault();
    
    if(!this.selectedFile) {
      alert("Please select an image to upload!");
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

        return this.service.addAssignmentDataToDB(passingData);
      })
    ).subscribe({
      error: (err) => {
        console.error(err);
      }
    })
  }

  /**
   * 
   * Function to get the chosen image as file and save it in variable
   * @param event - to get the file from input type='file';
   */
  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log(this.selectedFile);
    }
  }

  /**
   * Helper function to get URL params
   * 
   * @returns an array of current url params
   */
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

  /**
   * Also a helper function to check if the url is correct and we will not make a request to 
   * non-existing API
   * 
   * @returns a boolean value that tells usif everything is okay with current url
   */
  private checkRoute(): boolean {
    const urlData = this.getUrlData();
    let isOkay = false;

    this.service.getUnisData().subscribe({
      next: (res) => {
        isOkay = res.some(el => 
            el.uniname === urlData[0] && 
            el.faculties.includes(urlData[1]) && 
            el.years.map(year => numToStringMap.get(year)).includes(urlData[2]) && 
            el.seasons.includes(urlData[3])
        )
      },

      error: (err) => {
        console.error(err);
        isOkay = false;
      }
    });

    return isOkay;
  }

  //Functions for angular material popup:
  protected openDialogWindow() {
    this.dialog.open(SubjectPopupComponent, {
      width: "60%",
      height: "400px",
    });
  }
}