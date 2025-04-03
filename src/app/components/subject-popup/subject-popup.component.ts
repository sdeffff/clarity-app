import { Component, ElementRef, ViewChild } from '@angular/core';

import { Router } from '@angular/router';

import { NgIf } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { concatMap } from 'rxjs';

import { AppService } from '../../services/app-service.service';
import { ErrorComponent } from '../../pages/technical/error/error.component';
import errorConfig from '../../pages/technical/configs/errorConfig.config';


//For this component activated route is not working basically because for this component there are no 
//path in app.routes.ts
@Component({
  selector: 'app-subject-popup',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatInputModule, MatIconModule, NgIf, MatDialogModule],
  providers: [AppService],
  templateUrl: './subject-popup.component.html',
  styleUrl: './subject-popup.component.scss'
})
export class SubjectPopupComponent {
  constructor(
    private service: AppService,
    private router: Router,
    private dialog: MatDialog,
  ) { };

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  protected assignmentMedia: File | null = null;
  protected assignmentName: string = "";

  private urlData: string[] = [];
  protected currentSubject: string | null = null;

  protected handleFileUpload: boolean = false;
  protected handleLoader: boolean = false;

  ngOnInit() {
    this.urlData = this.router.url.split("/")
    .filter(el => el !== '')
    .map((el) => {
      return decodeURIComponent(el);
    });

    this.currentSubject = this.urlData[this.urlData.length - 1];
  }

  /**
   * Function to upload assignment data to database
   * 
   * Firstly - calling method to upload media to storage, then after it completes and returns us an
   * object with url - call a method to add assignment data to database
   * 
   * @param e - event of the clicked button to prevent page refrseshing
   * @returns 
  */
  protected uploadAssignment(e: Event) {
    e.preventDefault();

    this.handleLoader = true;

    const subjectName = this.urlData[this.urlData.length - 1];
    
    this.service.addSubjectMaterialToStorage(this.assignmentMedia!, subjectName).pipe(
      concatMap((res) => {
        const passingData = {
          uni: this.urlData[0],
          subject: subjectName,
          assignment_name: this.assignmentName,
          assignment_media: res.fileUrl,
          author: "anonymous",
        };

        return this.service.addAssignmentDataToDB(passingData);
      })
    ).subscribe({
      next: (res) => {
        window.location.reload();
      },

      error: (err) => {
        this.dialog.open(ErrorComponent, errorConfig);

        this.handleLoader = true;
    
        setTimeout(() => {
          window.location.reload();
        }, 1000);

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
      this.assignmentMedia = input.files[0];
      this.handleFileUpload = true;
    } else this.handleFileUpload = false;
  }

  protected handleFileDrop(event: DragEvent): void {
    event.preventDefault();

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(event.dataTransfer?.files[0]!);

    this.fileInput.nativeElement.files = dataTransfer.files;
    this.assignmentMedia = this.fileInput.nativeElement.files[0];

    this.handleFileUpload = true;
  }
}
