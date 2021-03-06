import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-companies',
  templateUrl: 'companies.component.html'
})
export class CompaniesComponent implements OnInit {
  userRole = 'user';
  creatingCompany = false;

  constructor(
    private userService: UserService
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

  manager(): boolean {
    return this.userRole === 'manager';
  }
}
