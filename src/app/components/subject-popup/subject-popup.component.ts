import { Component, ElementRef, ViewChild } from '@angular/core';

import { Router } from '@angular/router';

import { NgIf } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { catchError, concatMap, filter } from 'rxjs';

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

  //Varialbe to get the instance of our input
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  //Variables to store information about assignment that user wants to add
  protected assignmentMedia: File | null = null;
  protected assignmentName: string = "";

  //Varialbes to store information about url params like uni, subject and assignment name
  private urlData: string[] = [];
  protected currentSubject: string = "";
  protected fileUrl: string = "";

  //Varialbe to handle file uploadings
  protected handleFileUpload: boolean = false;
  protected handleLoader: boolean = false;
  
  //Styles that are applying to the area when user drags over it
  protected dropAreaStyles: string = "background-color: #4e6af021;";

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

    this.service.addSubjectMaterialToStorage(this.assignmentMedia!, this.currentSubject).pipe(
      concatMap((res) => {
        this.fileUrl = res.fileUrl;

        const passingData = {
          uni: this.urlData[0],
          subject: this.currentSubject,
          assignment_name: this.filterAssignmentName(this.assignmentName),
          assignment_media: res.fileUrl, //getting fileUrl when uploading our file to cloudstorage
          author: "anonymous",
        };
        
        return this.service.addAssignmentDataToDB(passingData);
      })
    ).subscribe({
      next: (res) => {
        window.location.reload();
      },

      error: (err) => {
        //In case of error from API delete the file form the cloud storage and clear variables

        //Changing full url to the public ID, so cloudinary will be able to delete it
        const id = this.fileUrl.split("/")[this.fileUrl.split("/").length - 1].split(".")[0];
        const folder = this.fileUrl.split("/")[this.fileUrl.split("/").length - 2];
        
        const filePublicLink = `${folder}/${id}`;

        //And calling method to delete asset from cloud storage
        this.service.removeSubjectMaterialFromStorage(filePublicLink, this.currentSubject)
          .subscribe({
            next: () => {
              console.log("file deleted from the storage: ", filePublicLink);

              setTimeout(() => {
                window.location.reload();
              }, 800);

              //Clearing variables and file in input in case of error:
              this.assignmentMedia = null;
              this.fileUrl = "";
              this.fileInput.nativeElement.files = null;
            },

            error: (err) => {
              console.log("Happened some error with deleting file from the storage");
              console.error(err);
            }
          })

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
   * Function to get the image file when user clicks on the area
   * @param event - to get the file from input type='file';
  */
  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.assignmentMedia = input.files[0];
      this.handleFileUpload = true;
    } else this.handleFileUpload = false;
  }


  private filterAssignmentName(inputString: string): string {
    let filteredString: string[] = inputString.split("");

    const notAllowed: string[] = ["_", ")", "!", "%", "$", "(", "/", "?", "=", ">", "<"];

    for(let el of filteredString) {
      if(notAllowed.includes(el)) {
        filteredString[filteredString.indexOf(el)] = "";
      }
    }

    return filteredString.join("");
  }

  /**
   * Basically this function is to prevent image file openin gin the new tab
   * and apply styles to the label area
   * 
   * @event - event when we dragging over our file
   */
  protected handleDragOver(event: DragEvent): void {
    event.preventDefault();

    this.dropAreaStyles = "background-color: #9cabf0;";
  }

  /**
   * Function to get the image file when user drag & drops image file over the area
   * 
   * @param event - event when user drags the file over the area
   */
  protected handleFileDrop(event: DragEvent): void {
    event.preventDefault();

    this.dropAreaStyles = "background-color: #4e6af021;";

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(event.dataTransfer?.files[0]!);

    this.fileInput.nativeElement.files = dataTransfer.files;
    this.assignmentMedia = this.fileInput.nativeElement.files[0];

    this.handleFileUpload = true;
  }
}
