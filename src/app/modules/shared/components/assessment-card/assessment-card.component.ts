import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Assessment } from 'src/app/models/assessment.model';

@Component({
  selector: 'app-assessment-card',
  templateUrl: './assessment-card.component.html'
})
export class AssessmentCardComponent implements OnInit {
  @Input() assessment: Assessment;
  @Input() userView: boolean = false;
  @Input() ownAssessment: boolean = false;

  showDetails = false;
  filledStars: any;
  emptyStars: any;
  currentUserId: string;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.filledStars = Array(this.assessment.averagePuntuation).fill(0);
    this.emptyStars = Array(5 - this.assessment.averagePuntuation).fill(0);
  }

  navigate(): void {
    this.router.navigateByUrl('/company/' + this.assessment.companyId);
  }
}
