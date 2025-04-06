import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgFor, NgIf, Location } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import errorConfig from '../technical/configs/errorConfig.config';

import { AppService } from '../../services/app-service.service';

import { subjectDataModel } from '../../models/subject-data.model';
import { numToStringMap } from '../../models/numToString.model';

//Popup window:
import { SubjectPopupComponent } from '../../components/subject-popup/subject-popup.component';

import { PreloaderComponent } from '../technical/preloader/preloader.component';
import { ErrorComponent } from '../technical/error/error.component';


@Component({
  selector: 'app-select-assignment',
  standalone: true,
  imports: [NgFor, NgIf, MatButtonModule, MatDialogModule, PreloaderComponent],
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
    private dialog: MatDialog,
    private location: Location
  ) { };

  protected data: subjectDataModel[] = [];
  protected isEmpty: boolean = false;

  protected urlData: string[] = [];

  protected isError: boolean = true;

  private ngOnInit(): void {
    if(this.checkRoute()) {
      this.isError = false;

      this.fetchSubjectData();
    } else {
      this.isError = true;
    }
  }

  /**
   * A function to get the data stream of all the assignments for the chosen subject
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
          this.isError = true;
        
          this.dialog.open(ErrorComponent, errorConfig);
          this.dialog.afterAllClosed.subscribe(() => this.location.back());

          console.error(err);
        }
      })
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
    this.urlData = this.getUrlData();

    let isOkay = false;

    this.service.getUnisData().subscribe({
      next: (res) => {
        isOkay = res.some(el => 
            el.uniname === this.urlData[0] && 
            el.faculties.includes(this.urlData[1]) && 
            el.years.includes(this.urlData[2]) && 
            el.seasons.includes(this.urlData[3])
        )
      },

      error: (err) => {
        console.error(err);

        this.dialog.open(ErrorComponent, errorConfig);
        this.dialog.afterAllClosed.subscribe(() => this.location.back());

        isOkay = false;
      }
    });

    return isOkay;
  }

  //Functions for angular material popup:
  protected openDialogWindow() {
    this.dialog.open(SubjectPopupComponent, {
      width: "550px",
      height: "475px",
    });
  }

  //Function to preload hovered components
  protected preloadAssignmentPage(uniname: string, subject: string, assignmentname: string) {
    import("../../pages/assignment-page/assignment-page.component").then(() => {});
  }
}