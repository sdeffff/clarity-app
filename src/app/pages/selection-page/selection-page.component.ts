import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AfterViewInit } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';

import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

//Config for Dialog window:
import dialogConfig from '../../models/dialogConfig.config';

import { AppService } from '../../services/app-service.service';

import { selectedDataModel } from '../../models/selected-data.model';
import { universityModel } from '../../models/university.model';

import { PreloaderComponent } from '../technical/preloader/preloader.component';

import { ErrorComponent } from '../technical/error/error.component';

@Component({
  selector: 'app-selection-page',
  standalone: true,
  imports: [HttpClientModule, MatDialogModule, NgFor, MatButtonModule, NgIf, MatSelectModule, FormsModule, PreloaderComponent],
  providers: [AppService],
  templateUrl: './selection-page.component.html',
  styleUrl: './selection-page.component.scss'
})

//The start page where we choosing our uni, faculty, year and season
export class SelectionPageComponent implements AfterViewInit {
  constructor(private service: AppService,
    private router: Router,
    private dialog: MatDialog,
  ) {};

  //Variables for fetched data:
  protected unis: string[] = [];
  protected currentFaculties: string[] = [];
  protected years: string[] = [];
  protected seasons: string[] = [];

  protected data: universityModel[] = [];

  protected isError: boolean = true;

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

        this.isError = false;

        this.setData(this.data);
      },

      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.isError = true;

        this.dialog.open(ErrorComponent, dialogConfig);
        this.dialog.afterAllClosed.subscribe(() => this.router.navigate(["/"]));
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