import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-selector',
  templateUrl: 'selector.page.html'
})
export class SelectorPage implements OnInit {
  userRole = 'user';

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
