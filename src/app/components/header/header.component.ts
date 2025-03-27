import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

//Angular Material:
import { MatInputModule } from '@angular/material/input';
import { MatFormField } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, MatInputModule, MatFormField, MatButton, MatIconModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private router: ActivatedRoute) { };

  protected searchValue: string = "";

  protected headerStyles = "background: transparent";
  
  ngOnInit(): void {


    // if(!(this.router.url === "/")) {
    //   this.headerStyles = "background: #191D21";
    // }
  }  
}
