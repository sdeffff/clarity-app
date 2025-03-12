import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';

import { AppService } from '../../services/app-service.service';
import { concatMap, map, pipe, switchMap } from 'rxjs';

@Component({
  selector: 'app-faculty-page',
  standalone: true,
  imports: [HttpClientModule],
  providers: [AppService],
  templateUrl: './faculty-page.component.html',
  styleUrl: './faculty-page.component.scss'
})
export class FacultyPageComponent {
  constructor(private service: AppService,
    private activeRoute: ActivatedRoute,
    private router: Router,
  ) {};

  private currentUni: string | null = "";
  private faculties: { faculty: string }[] = [];

  protected errorStyles = "display: none;";

  getFaculties() {
    this.service.getFaculties(this.currentUni!).subscribe({
      next: (res) => {
        this.faculties = res;
      },

      error: (err) => {
        this.errorStyles = "display: inherit;";
      }
    })
  };

  ngOnInit(): void {
    this.activeRoute.paramMap.pipe(
      concatMap(params => this.service.getUnis().pipe(
        map((el: {uni: string}[]) => {
          el.forEach(el => {
            if(el.uni === params.get("uni")) {
              this.currentUni = el.uni;
            }
          })

          if(this.currentUni === "") {
            alert("There is no such uni, sorry!");
            this.router.navigate(["/select-uni"]);
          }
        })
      ))
    ).subscribe({});

    this.getFaculties();
  }
}
