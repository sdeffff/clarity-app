import { Component, AfterViewInit } from '@angular/core';

import { Location } from '@angular/common';

import { ActivatedRoute, Router } from '@angular/router';

import { AppService } from '../../services/app-service.service';

import { assignmentModel } from '../../models/assignment-data.model';

@Component({
  selector: 'app-assignment-page',
  standalone: true,
  imports: [],
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

  ngOnInit() {
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
}