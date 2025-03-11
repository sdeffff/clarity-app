import { Component } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import {MatInputModule} from '@angular/material/input';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, MatInputModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor (private title: Title) {
    this.title.setTitle("Clarity ✨");
  };
}