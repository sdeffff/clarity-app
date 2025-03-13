import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { HeaderComponent } from '../../components/header/header.component';

import { HttpClientModule } from '@angular/common/http';

import { NgFor, NgIf } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';

import { AppService } from '../../services/app-service.service';
import { concatMap, map, } from 'rxjs';

import { numToStringMap } from '../../models/numToString.model';

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
    router.events.subscribe((val) => {
      console.log("asd")
    })
  };

  protected currentUni: string | null = "";
  protected currentFaculty: string | null = "";
  protected currentYear: string | null = "";
  protected currPage: string = "";

  protected data: {faculty: string, seasons: string[], years: string[]}[] = [];
  protected facultyData: {seasons: string[], years: string[]} = {seasons: [], years: []};

  //Params for err message:
  protected errMessage: boolean = true;
  protected errStyles: string = "display: none";

  //Function to get list of faculties from db
  getFacultiesData(): void {
    this.data = [];
    this.service.getFacultiesInfo(this.currentUni!).subscribe({
      next: (res) => {
        res.forEach(el => this.data.push(el));
      },

      error: (err) => {
        if(err) this.errMessage = false;
        if(err) this.errStyles = "display: block";
      }
    });
  };

  //function to check url's data:
  checkUrlData(urlParam: string) {
    // const urlFunctionsMap = new Map([
    //   [],
    // ])
  }

  //functions to get data from urls
  getUniInfo():void {
    this.activeRoute.paramMap.pipe(
      concatMap(params => this.service.getUnis().pipe(
        map((el: {uni: string}[]) => {
          el.forEach(el => {
            if(el.uni === params.get("uni")) {
              this.currentUni = el.uni;
              return;
            }
          })

          if(this.currentUni === "") {
            window.alert("There is no such uni, sorry!");
            this.router.navigate(["/select-uni"]);
          }
        })
      ))
    ).subscribe({});
  }

  getFacultyInfo():void {
    this.activeRoute.paramMap.subscribe(params => {
      this.data.forEach((el) => {
        if(el.faculty.includes(params.get("faculty")!)) {
          this.currentFaculty = el.faculty;
          return;
        };
      });

      if(this.currentFaculty == "") {
        window.alert("There is no such faculty, sorry");
        this.router.navigate(["/select-uni"]);
      }
    });
  };

  getYearInfo(): void {
    this.activeRoute.paramMap.subscribe(params => {
      if(!this.facultyData.years.includes(params.get("year")!)) {
          window.alert("Wrong year!");
          this.router.navigate([`/${this.currentUni}/${this.currentFaculty}`])
      }

      this.currentYear = params.get("year");
    });
  }

  //Function to transform numbers to string:
  stringToNumber(year: string): number {
    return numToStringMap.get(year)!;
  }

  //Also getting name of the uni from url and checking, if there is such uni in db
  //So there will be no errors
  ngOnInit(): void {
    const currentPage: string = this.router.url.split("/")[this.router.url.split("/").length - 1];

    const waitForData = () => {

      //Calling this function at the beggining to get all of the main info
      this.getUniInfo(); //getting Uni name
      this.getFacultiesData(); //Data about all of the faculties in currentUni

      if (this.data.length === 0) {
        setTimeout(waitForData, 10); // Check again after 10ms
        return;
      }  

      switch (currentPage) {
        case "faculties": {
          this.currPage = "faculty";
  
          break;
        };
  
        case "select-year": {
          this.currPage = "year";
  
          this.getFacultyInfo();
  
          this.data.forEach((el) => {
            if(this.currentFaculty === el.faculty) {
                this.facultyData.seasons = el.seasons;
                this.facultyData.years = el.years;
  
                return;
            }
          });
  
          break;
        };
  
        case "select-season": {
          this.currPage = "season";
          
          break;
        };
  
        default: {
          this.router.navigate(["/unis"]);
        }
      }
    }

    waitForData();
  }
}
