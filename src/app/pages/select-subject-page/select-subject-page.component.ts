import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { PreloaderComponent } from '../technical/preloader/preloader.component';

import { AfterViewInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { NgFor, NgIf } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import dialogConfig from '../../models/dialogConfig.config';

import { AppService } from '../../services/app-service.service';

import { facultySubjects } from '../../models/faculty-subjects.model';
import { ErrorComponent } from '../technical/error/error.component';

@Component({
  selector: 'app-select-subject-page',
  standalone: true,
  imports: [HttpClientModule, NgFor, NgIf, MatButtonModule, PreloaderComponent, MatDialogModule],
  providers: [AppService],
  templateUrl: './select-subject-page.component.html',
  styleUrl: './select-subject-page.component.scss'
})

//Page where user selects a SUBJECT itself
export class SelectSubjectPageComponent implements AfterViewInit {
  constructor(
    private service: AppService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
  ) { };

  protected urlData: string[] = [];
  protected data: facultySubjects[] = [];

  protected isError: boolean = true;

  protected isLoading: boolean = true

  ngAfterViewInit() {
    setTimeout(() => {
      this.isLoading = false;
    }, 1500);
  }

  private getSubjects(): void {
    this.service.getFacultySubjects(this.urlData).subscribe({
      next: (res) => {
        if(res.length === 0) {
          this.router.navigate([`/selection-page`]);
        } else {
          this.data = res;
          
          this.isError = false;
        }
      },

      error: (err) => {
        this.isLoading = false;
        this.isError = true;

        this.dialog.open(ErrorComponent, dialogConfig);
        this.dialog.afterAllClosed.subscribe(() => this.router.navigate([`/selection-page`]));
      }
    })
  }

  private ngOnInit(): void {
    this.activeRoute.paramMap.subscribe(params => {
      this.urlData = [
        params.get("uni")!,
        params.get("faculty")!,
        params.get("year")!,
        params.get("season")!
      ]
    });

    this.getSubjects();
  }
}
