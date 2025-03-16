import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { HeaderComponent } from '../../components/header/header.component';

import { HttpClientModule } from '@angular/common/http';

import { NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { AppService } from '../../services/app-service.service';
import { concatMap, map, take } from 'rxjs';

import { numToStringMap } from '../../models/numToString.model';
import { universityModel } from '../../models/university.model';

@Component({
  selector: 'app-selection-page',
  standalone: true,
  imports: [HttpClientModule, NgFor, HeaderComponent, MatButtonModule, NgIf],
  providers: [AppService, HeaderComponent],
  templateUrl: './selection-page.component.html',
  styleUrl: './selection-page.component.scss'
})
export class SelectionPageComponent {
  constructor(private service: AppService,
    private activeRoute: ActivatedRoute,
    private router: Router,
  ) {

  };

  protected currentUni: string | null = "";
  protected currentFaculty: string | null = "";
  protected currentYear: string | null = "";
  protected currentSeason: string | null = "";
  protected currPage: string = "";

  protected data: universityModel[] = [];

  //Params for err message:
  protected errMessage: boolean = true;
  protected errStyles: string = "display: none";

  //Styles for the list to change if the amount if li tags less than 3:
  protected listStyles: string = "grid-template-columns: repeat(2, 1fr)";

  //Function to get info about current university(faculties, years, seasons):
  private getCurrentUniInfo(): void {
    this.data = [];
    this.service.getUniInfo(this.currentUni!).subscribe({
      next: (res) => {
        this.data = res;
      },

      error: (err) => {
        if(err) this.errMessage = false;
        if(err) this.errStyles = "display: block";
      }
    });
  };

  //Also getting name of the uni from url and checking, if there is such uni in db
  //So there will be no errors
  ngOnInit(): void {
    const currentPage = this.router.url.split("/")[this.router.url.split("/").length - 1];

    this.activeRoute.paramMap.pipe(
      concatMap(params => this.service.getUnis().pipe(
        map((unis: universityModel[]) => {
          let foundUni = "";
      
          unis.forEach(el => {
            if (el.uniname === params.get("uni")!) {
              foundUni = el.uniname;
            }
          });
      
          return foundUni;
        })
      ))
    ).subscribe({
      next: (res) => {
        this.currentUni = res;

        if(this.currentUni === "") {
          alert("Wrong university, sorry!")
          this.router.navigate(["/select-uni"]);
          return;
        }

        const waitForData = () => {
          this.getCurrentUniInfo(); //Data about all of the faculties in currentUni

          // Wait for data to be loaded, idk if there is a better way to do this :/
          if (this.data.length === 0) {
            setTimeout(waitForData, 50);
            return;
          }

          this.handlePageRouting(currentPage);
        }

        waitForData();
      },

      error: (err) => {
        this.router.navigate(["/select-uni"]);
      }
    })
  }

  //Function to transform numbers to string:
  protected numberToString(year: number): string {
    return numToStringMap.get(year)!;
  }

  private checkUrlData(urlData: string): void {
    const validateParam = (
      paramName: string, 
      validValues: string[] | undefined, 
      setter: (value: string) => void,
      errorRedirectPath: string) => 
      {
        this.activeRoute.paramMap.pipe(
          take(1)
        ).subscribe(params => {
          const paramValue = params.get(paramName);
          if (this.data.length > 0 && validValues && validValues.includes(paramValue!)) {
            setter(paramValue!);
          } else {
            alert(`There is no such ${paramName}, sorry`);
            console.log(errorRedirectPath);
            this.router.navigate([errorRedirectPath]);
          }
        });
    };

    switch(urlData) {
      case "faculty": {
        validateParam(
          urlData, 
          this.data[0].faculties, 
          (value) => this.currentFaculty = value,
          `${this.currentUni}/select-faculty`);

          break;
      };

      case "year": {
        validateParam(
          urlData, 
          this.data[0].years.map(el => this.numberToString(el)), 
          (value) => this.currentYear = value, 
          `${this.currentUni}/${this.currentFaculty}/select-year`);

          break;
      };

      case "season": {
        validateParam(
          urlData, 
          this.data[0].seasons, 
          (value) => this.currentSeason = value,
          `${this.currentUni}/${this.currentFaculty}/${this.currentYear}/select-season`);

          break;
      };
    }
  }

// New method to handle page routing
private handlePageRouting(currentPage: string): void {
  switch (currentPage) {
    case "select-faculty": {
      this.currPage = "faculty";

      break; 
    } 
    case "select-year": {
      this.currPage = "year";

      this.checkUrlData("faculty");

      break;
    }
    case "select-season": {
      this.currPage = "season";

      this.checkUrlData("faculty");
      this.checkUrlData("year");

      break;
    }
    case "select-subject": {
      this.currPage = "subject";

      this.checkUrlData("faculty");
      this.checkUrlData("year");
      this.checkUrlData("season");

      break;
    }

    default: {
      this.router.navigate(["/unis"]);
    }
  }
  };
}