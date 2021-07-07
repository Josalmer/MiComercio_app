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
    {top: 'TUTORIAL.welcome', image: '../../../../../assets/img/user-tutorial/1.png', bot: 'TUTORIAL.1'},
    {top: 'TUTORIAL.user.2-top', image: '../../../../../assets/img/user-tutorial/2.png', bot: 'TUTORIAL.user.2-bot'},
    {top: 'TUTORIAL.user.3-top', image: '../../../../../assets/img/user-tutorial/3.png', bot: 'TUTORIAL.user.3-bot'},
    {top: 'TUTORIAL.user.4-top', image: '../../../../../assets/img/user-tutorial/4.png', bot: 'TUTORIAL.user.4-bot'},
    {top: 'TUTORIAL.user.5-top', image: '../../../../../assets/img/user-tutorial/5.png', bot: 'TUTORIAL.user.5-bot'},
    {top: 'TUTORIAL.user.6-top', image: '../../../../../assets/img/user-tutorial/6.png', bot: 'TUTORIAL.user.6-bot'}
  ];
  managerContent = [
    {top: 'TUTORIAL.welcome', image: '../../../../../assets/img/manager-tutorial/1.png', bot: 'TUTORIAL.1'},
    {top: 'TUTORIAL.manager.2-top', image: '../../../../../assets/img/manager-tutorial/2.png', bot: 'TUTORIAL.manager.2-bot'},
    {top: 'TUTORIAL.manager.3-top', image: '../../../../../assets/img/manager-tutorial/3.png', bot: 'TUTORIAL.manager.3-bot'},
    {top: 'TUTORIAL.manager.4-top', image: '../../../../../assets/img/manager-tutorial/4.png', bot: 'TUTORIAL.manager.4-bot'},
    {top: 'TUTORIAL.manager.5-top', image: '../../../../../assets/img/manager-tutorial/5.png', bot: 'TUTORIAL.manager.5-bot'},
    {top: 'TUTORIAL.manager.6-top', image: '../../../../../assets/img/manager-tutorial/6.png', bot: 'TUTORIAL.manager.6-bot'},
    {top: 'TUTORIAL.manager.7-top', image: '../../../../../assets/img/manager-tutorial/7.png', bot: 'TUTORIAL.manager.7-bot'}
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
