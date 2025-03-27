import { Component } from '@angular/core';

//Angular material:
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, MatInputModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
}