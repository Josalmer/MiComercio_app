import { Address } from './address.model';
import { Hour } from './hour.model';
import { SpecialSchedule } from './special-schedule.model';

export class Company {
  id: string;
  name: string;
  fistAvailableAppointment: {
    start: Date,
    end: Date
  };
  logo: any;
  type: string;
  category: string;
  simultaneousNumber: number;
  appointmentDuration: number;
  diaryClientLimit: number;
  monthlyClientLimit: number;
  web: string;
  mail: string;
  phone: string;
  description: string;
  address: Address;
  published: boolean;
  validated: boolean;
  hours: Hour[];
  specialSchedules: SpecialSchedule[];

  constructor(company) {
    Object.assign(this, company);
  }
}
