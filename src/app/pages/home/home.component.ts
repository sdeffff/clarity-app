import { Component } from '@angular/core';

//Angular material:
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from '@angular/material/input';

//Header:
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, MatInputModule, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
}