import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

//Angular Material:
import { MatInputModule } from '@angular/material/input';
import { MatFormField } from '@angular/material/input';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import supportConfig from '../../pages/technical/configs/supportConfig.config';
import { SupportPopupComponent } from '../support-popup/support-popup.component';

import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, MatInputModule, MatFormField, MatButton, MatButtonModule, MatIconModule, FormsModule, MatDialogModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(
    private router: Router,
    private dialog: MatDialog
  ) { };

  protected searchValue: string = "";

  protected openPopup() {
    this.dialog.open(SupportPopupComponent, supportConfig);
  }
}
