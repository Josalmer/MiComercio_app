import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.page.html'
})
export class TutorialPage implements OnInit {
  userRole: string;
  userContent = [
    {top: 'TUTORIAL.user.welcome', image: '../../../../../assets/img/user-tutorial/1.png', bot: 'TUTORIAL.user.1'},
    // {top: 'TUTORIAL.user.welcome', image: '../../../../../assets/img/user-tutorial/2.png', bot: 'TUTORIAL.user.1'},
    // {top: 'TUTORIAL.user.welcome', image: '../../../../../assets/img/user-tutorial/3.png', bot: 'TUTORIAL.user.1'},
    // {top: 'TUTORIAL.user.welcome', image: '../../../../../assets/img/user-tutorial/4.png', bot: 'TUTORIAL.user.1'}
  ];
  managerContent = [
    // {top: 'TUTORIAL.user.welcome', image: '../../../../../assets/img/manager-tutorial/0.png', bot: 'TUTORIAL.user.1'}
  ];

  content: any[];

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userService.getApplicationUser().subscribe(
      user => {
        this.userRole = user.userRole;
        this.content = this.userRole === 'user' ? this.userContent : this.managerContent;
      }
    );
  }

  turnOff(): void {
    this.userService.turnOffTutorial().subscribe();
    this.router.navigateByUrl('/companies');
  }
}
