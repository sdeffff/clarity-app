import { Component, AfterViewInit, } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Location, NgIf } from '@angular/common';

import { HttpClient } from '@angular/common/http';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import errorConfig from '../technical/configs/errorConfig.config';

import { ActivatedRoute } from '@angular/router';

import { ErrorComponent } from '../technical/error/error.component';

import { AppService } from '../../services/app-service.service';
import { subjectDataModel } from '../../models/subject-data.model';

@Component({
  selector: 'app-assignment-page',
  standalone: true,
  imports: [MatButtonModule, FormsModule, MatDialogModule, NgIf],
  providers: [AppService],
  templateUrl: './assignment-page.component.html',
  styleUrl: './assignment-page.component.scss'
})
export class AssignmentPageComponent {
  constructor(
    private service: AppService,
    private acitveRouter: ActivatedRoute,
    private location: Location,
    private http: HttpClient,
    private dialog: MatDialog,
  ) { };

  protected data: subjectDataModel[] = [];
  protected urlData: subjectDataModel = {
    uni: "",
    subject: "",
    assignment_name: "",
    assignment_media: "",
    author: "",
  };

  protected isError: boolean = true;

  /**
   * When the component mounts we getting the data from url string this component based on
   * and depending on the data we will get - fetching all of the current assignment's data
   * from database
   * 
   */
  ngOnInit(): void {
    this.getUrlData();

    const waitForData = () => {
      const dataInterval = setInterval(() => {
        if(this.urlData.assignment_name = '') {
          waitForData();
        } else clearInterval(dataInterval);

      }, 50);
    }

    //Getting the remaining data to add to the assignment page like author name and media
    this.service.getAssignmentDataFromDB(this.urlData).subscribe({
      next: (res) => {
        if(res.length === 0) {
          this.location.back();
        } else {
          this.isError = false;

          this.data = res;

          this.getImageSize(res[0].assignment_media);
        }
      },

      error: (err) => {
        console.error(err);

        this.isError = true;

        this.dialog.open(ErrorComponent, errorConfig);

        this.dialog.afterAllClosed.subscribe(() => {
          this.location.back();
        })
      }
    });
  }

  //Helper function to get the values of the url value and then use them
  private getUrlData() {
    this.acitveRouter.paramMap.subscribe(params => {
      this.urlData.uni = params.get("uni")!;
      this.urlData.subject = params.get("subject")!;
      this.urlData.assignment_name = params.get("assignment")!;
    });
  }

  //Function to check that everything is okay, and client didn't wrote some random stuff in url
  private checkRoute() {

  }

  //------
  //Functionality to handle image zoom

  //Varialbes to handle functionality:
  private width: number = 0; 
  private height: number = 0;
  private eventImg!: HTMLImageElement;
  protected fileSize: string = "";


  //Call this function from service!
  protected getImageSize(imgUrl: string) {
    this.service.getImageSize(imgUrl).subscribe({
      next: (res) => {
        const size = res.headers.get('content-length');

        const mb_size: number = (parseInt(size!) / 1_048_576)
        const kb_size: number = (parseInt(size!) / 1024)

        if(mb_size > 1) this.fileSize = mb_size.toFixed(2) + "Mb";
        else this.fileSize = kb_size.toFixed(2) + "Kb";
      },

      error: (err) => {
        this.fileSize = "";
        console.error(err);
      }
    })
  }

  protected handleMouseEnter(event: MouseEvent) {
    this.eventImg = event.srcElement as HTMLImageElement

    this.width = this.eventImg.clientWidth;
    this.height = this.eventImg.clientHeight;
  }

  protected handleMouseMove(event: MouseEvent) {
    const horizontal = (event.offsetX) / this.width*100;
    const vertical = (event.offsetY) / this.height*100;

    this.eventImg.style.setProperty('--x', horizontal + '%');
    this.eventImg.style.setProperty('--y', vertical + '%');
  }

  //At first I had a problem that I was using event.x that was relative to the position of the cursor
  //to the whole page, not the image, but I fixed it by using offset property
}