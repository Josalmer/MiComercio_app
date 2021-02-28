import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-stars',
  templateUrl: './stars.component.html'
})
export class StarsComponent implements OnInit {
  @Input() text: string;
  @Input() puntuation: number;

  filledStars: any;
  emptyStars: any;

  constructor(
  ) { }

  ngOnInit(): void {
    this.filledStars = Array(this.puntuation).fill(0);
    this.emptyStars = Array(5 - this.puntuation).fill(0);
  }
}
