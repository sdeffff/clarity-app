import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';

import { HttpClientModule } from '@angular/common/http';

import { NgFor, NgIf } from '@angular/common';

import { HeaderComponent } from '../../components/header/header.component';

import { AppService } from '../../services/app-service.service';

@Component({
  selector: 'app-uni-page',
  standalone: true,
  imports: [HeaderComponent, HttpClientModule, NgFor, NgIf, MatButtonModule],
  providers: [AppService],
  templateUrl: './uni-page.component.html',
  styleUrl: './uni-page.component.scss'
})
export class UniPageComponent {
  public unis: string[] = [];

  constructor(private service: AppService) {};

  getUnis() {
    this.service.getUnis().subscribe({
      next: (res) => {
        res.forEach((el) => {
          this.unis.push(el.uni);
        })
      },

      error: (err) => {
        console.log(err);
      }
    });
  };

  ngOnInit(): void {
    this.getUnis();
    console.log(this.unis);
  }
}
