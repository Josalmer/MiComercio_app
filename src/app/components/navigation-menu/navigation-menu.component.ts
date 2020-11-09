import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html'
})
export class NavigationMenuComponent implements OnInit {
  userRole: string;

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadUserRole();
  }

  loadUserRole(): void {
    this.userService.getApplicationUser().subscribe(
      response => this.userRole = response.userRole
    );
  }

  user(): boolean {
    return this.userRole === 'user';
  }

  navigateToCalendar(): void {
    this.router.navigateByUrl('/calendar');
  }

  navigateToCompanies(): void {
    this.router.navigateByUrl('/companies');
  }

  navigateToProfile(): void {
    this.router.navigateByUrl('/user');
  }
}
