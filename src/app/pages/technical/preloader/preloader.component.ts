import { Component } from '@angular/core';
@Component({
  selector: 'app-preloader',
  template: `
    <section>
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
}