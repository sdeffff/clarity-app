import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

//Angular Material:
import { MatInputModule } from '@angular/material/input';
import { MatFormField } from '@angular/material/input';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, MatInputModule, MatFormField, MatButton, MatButtonModule, MatIconModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private router: Router) { };

  protected searchValue: string = "";
}
