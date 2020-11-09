import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  @Input() pathRoute: string;

  constructor(
    private router: Router
  ) { }

  navigateBack(): void {
    this.router.navigateByUrl(this.pathRoute);
  }
}
