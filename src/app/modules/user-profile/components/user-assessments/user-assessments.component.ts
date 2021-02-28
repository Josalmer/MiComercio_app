import { Component, OnInit } from '@angular/core';
import { Assessment } from 'src/app/models/assessment.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-assessments',
  templateUrl: './user-assessments.component.html',
})
export class UserAssessmentsComponent implements OnInit {
  assessments: Assessment[];

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userService.getUserAssessments().subscribe(
      response => this.assessments = response.assessments
    );
  }
}
