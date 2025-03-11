import { Component } from '@angular/core';

//Angular material:
import { MatButtonModule } from "@angular/material/button";
import {MatInputModule} from '@angular/material/input';

//To change the title of the page:
import { Title } from '@angular/platform-browser';

//Header:
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, MatInputModule, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor (private title: Title) {
    this.title.setTitle("Clarity ✨");
  };
}