import { Component } from '@angular/core';

import { AfterViewInit } from '@angular/core';

import { NgIf } from '@angular/common';

//Angular material:
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from '@angular/material/input';

import { PreloaderComponent } from '../technical/preloader/preloader.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, MatInputModule, PreloaderComponent, NgIf],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {
  protected isLoading: boolean = true;

  ngAfterViewInit() {
    setTimeout(() => {
      this.isLoading = false;
    }, 800);
  }
}