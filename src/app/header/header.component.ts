import { Component } from '@angular/core';

//Angular Material:
import { MatInputModule } from '@angular/material/input';
import { MatFormField } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatInputModule, MatFormField, MatButton],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
