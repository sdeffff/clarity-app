import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-preloader',
  template: `
    <section [class.fade-out]="isVisible">
      <div class="loader-wrapper">
        <div>
          <div class="loader"></div>
        </div>
      </div>
    </section>
  `,
  standalone: true,
  imports: [],
  styleUrl: './preloader.component.scss'
})
export class PreloaderComponent {
  @Input() isVisible: boolean = false;
}
