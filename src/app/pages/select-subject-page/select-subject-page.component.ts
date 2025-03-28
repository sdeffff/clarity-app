import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { ActivatedRoute, Router } from '@angular/router';

import { NgFor } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';

import { AppService } from '../../services/app-service.service';

import { facultySubjects } from '../../models/faculty-subjects.model';

@Component({
  selector: 'app-select-subject-page',
  standalone: true,
  imports: [HttpClientModule, NgFor, MatButtonModule],
  providers: [AppService],
  templateUrl: './select-subject-page.component.html',
  styleUrl: './select-subject-page.component.scss'
})

//Page where user selects a SUBJECT itself
export class SelectSubjectPageComponent {
  constructor(
    private service: AppService,
    private activeRoute: ActivatedRoute,
    private router: Router,
  ) { };

  protected urlData: string[] = [];
  protected data: facultySubjects[] = [];

  private getSubjects(): void {
    this.service.getFacultySubjects(this.urlData).subscribe({
      next: (res) => {
        if(res.length === 0) {
          this.router.navigate([`/selection-page`]);
        } else this.data = res;
      },

      error: (err) => {
        this.router.navigate([`/selection-page`]);
        alert("ASd1")
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
