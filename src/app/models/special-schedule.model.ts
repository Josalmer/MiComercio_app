import { Hour } from './hour.model';

export class SpecialSchedule {
  id: string;
  closed: boolean;
  startDate: Date;
  endDate: Date;
  hours: Hour[];

  constructor(specialSchedule) {
    Object.assign(this, specialSchedule);
  }
}
