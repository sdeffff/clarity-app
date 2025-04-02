import { Component, AfterViewInit, } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';

import { MatButton, MatButtonModule } from '@angular/material/button';

import { ActivatedRoute, Router } from '@angular/router';

import { AppService } from '../../services/app-service.service';

import { assignmentModel } from '../../models/assignment-data.model';

@Component({
  selector: 'app-assignment-page',
  standalone: true,
  imports: [MatButton, MatButtonModule, FormsModule],
  providers: [AppService],
  templateUrl: './assignment-page.component.html',
  styleUrl: './assignment-page.component.scss'
})
export class AssignmentPageComponent {
  constructor(
    private service: AppService,
    private acitveRouter: ActivatedRoute,
    private router: Router,
    private location: Location,
  ) { };

  protected data: assignmentModel[] = [];
  protected urlData: {uni: string, subject: string, assignmentname: string} = {
    uni: "",
    subject: "",
    assignmentname: "",
  };

  ngOnInit(): void {
    this.getUrlData();

    const waitForData = () => {
      const dataInterval = setInterval(() => {
        if(this.urlData.assignmentname = '') {
          waitForData();
        } else clearInterval(dataInterval);

      }, 50);
    }

    this.service.getAssignmentDataFromDB(this.urlData).subscribe({
      next: (res) => {
        if(res.length === 0) {
          this.location.back();
        } else {
          this.data = res;
        }
      },

      error: (err) => {
        console.log(err);
        this.location.back();
      }
    });
  }

  private getUrlData() {
    this.acitveRouter.paramMap.subscribe(params => {
      this.urlData.uni = params.get("uni")!;
      this.urlData.subject = params.get("subject")!;
      this.urlData.assignmentname = params.get("assignment")!;
    })
  }

  private checkRoute() {

  }

  //Functions to handle zoom on the image:

  //Varialbes to handle functionality:
  private width: number = 0; 
  private height: number = 0;
  private eventImg!: HTMLImageElement;

  protected handleMouseEnter(event: MouseEvent) {
    this.eventImg = event.srcElement as HTMLImageElement;

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