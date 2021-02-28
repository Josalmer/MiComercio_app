import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-stars-input',
  templateUrl: './stars-input.component.html'
})
export class StarsInputComponent implements OnInit {
  @Input() text: string;
  @Output() puntuationChanged = new EventEmitter();
  
  puntuation = 1;

  filledStars: any;
  emptyStars: any;

  constructor(
  ) { }

  ngOnInit(): void {
    this.setStars();
  }

  setStars(): void {
    this.filledStars = Array(this.puntuation).fill(0);
    this.emptyStars = Array(5 - this.puntuation).fill(0);
  }

  selectPuntuation(newPuntuation: number): void {
    this.puntuation = newPuntuation;
    this.setStars();
    this.puntuationChanged.emit(this.puntuation);
  }
}
