import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

import { AppService } from '../../services/app-service.service';

@Component({
  selector: 'app-subject-popup',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatSelectModule],
  providers: [AppService],
  templateUrl: './subject-popup.component.html',
  styleUrl: './subject-popup.component.scss'
})
export class SubjectPopupComponent {
  constructor() { };
}
