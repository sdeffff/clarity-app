import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AfterViewInit } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';

import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

import { AppService } from '../../services/app-service.service';

import { selectedDataModel } from '../../models/selected-data.model';
import { universityModel } from '../../models/university.model';

import { PreloaderComponent } from '../technical/preloader/preloader.component';

@Component({
  selector: 'app-selection-page',
  standalone: true,
  imports: [HttpClientModule, NgFor, MatButtonModule, NgIf, MatSelectModule, FormsModule, PreloaderComponent],
  providers: [AppService],
  templateUrl: './selection-page.component.html',
  styleUrl: './selection-page.component.scss'
})

//The start page where we choosing our uni, faculty, year and season
export class SelectionPageComponent implements AfterViewInit {
  constructor(private service: AppService,
    private router: Router,
  ) {};

  //Variables for fetched data:
  protected unis: string[] = [];
  protected currentFaculties: string[] = [];
  protected years: string[] = [];
  protected seasons: string[] = [];

  protected data: universityModel[] = [];

  //Params for err message:
  protected errMessage: boolean = true;
  protected errStyles: string = "display: none";

  protected isLoading: boolean = true;

  //Object for client's selected data:
  protected selectedData: selectedDataModel = {
    uni: "",
    faculty: "",
    year: "",
    season: "",
  };

  ngAfterViewInit() {
    setTimeout(() => {
      this.isLoading = false;
    }, 800);
  }

  //Function to get all of the information from db
  private getFullInfo(): void {
    this.data = [];
    this.service.getUnisData().subscribe({
      next: (res) => {
        this.data = res;

        this.setData(this.data);
      },

      error: (err) => {
        console.error(err);
        this.isLoading = false;
        alert("asd");
      }
    });
  };

  private setData(arr: universityModel[]): void {
    this.seasons = ["Winter", "Summer"];
    this.years = ["First", "Second", "Third"];

    arr.forEach((el) => {
      this.unis.push(el.uniname);
    });
  }

  //Depending on selected uni we setting faculties for our <select> tag
  protected addFaculties(arr: universityModel[], selectedUni: string): void {
    arr.forEach((el) => {
      if(el.uniname === selectedUni) {
        this.currentFaculties = el.faculties;
      }
    });
  }


  //Calling the function to get the data we have from database
  ngOnInit(): void {
    this.getFullInfo();
  }
}