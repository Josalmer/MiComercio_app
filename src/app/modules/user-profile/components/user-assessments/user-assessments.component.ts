import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Assessment } from 'src/app/models/assessment.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-assessments',
  templateUrl: './user-assessments.component.html',
})
export class UserAssessmentsComponent implements OnInit {
  assessments: Assessment[];
  loaded = false;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userService.getUserAssessments().pipe(
        finalize(() => this.loaded = true)
    ).subscribe(
      response => this.assessments = response.assessments
    );
  }
}
