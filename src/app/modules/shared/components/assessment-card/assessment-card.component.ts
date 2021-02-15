import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Assessment } from 'src/app/models/assessment.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-assessment-card',
  templateUrl: './assessment-card.component.html'
})
export class AssessmentCardComponent implements OnInit {
  @Input() assessment: Assessment;
  @Input() userView: boolean = false;

  showDetails = false;
  filledStars: any;
  emptyStars: any;
  currentUserId: string;

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loadUserId();
    this.filledStars = Array(this.assessment.averagePuntuation).fill(0);
    this.emptyStars = Array(5 - this.assessment.averagePuntuation).fill(0);
  }

  loadUserId(): void {
    this.userService.getApplicationUser().subscribe(
      response => this.currentUserId = response.id
    );
  }

  navigate(): void {
    this.router.navigateByUrl('/company/' + this.assessment.companyId);
  }

  ownAssessment(): boolean {
    return this.assessment.userId === this.currentUserId;
  }
}
