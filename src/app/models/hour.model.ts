import { Time } from '@angular/common';

export class Hour {
  id: string;
  day: string;
  openingAt: Time;
  closingAt: Time;

  constructor(hour) {
    Object.assign(this, hour);
  }
}
