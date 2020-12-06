export class Appointment {
  id: string;
  userId: string;
  companyId: string;
  companyName: string;
  companyType: string;
  createdByManager: boolean;
  userName: string;
  userPhone: string;
  requestedAt: Date;
  startDate: Date;
  endDate: Date;
  finishedAt: Date;
  removedAt: Date;

  constructor(appointment) {
    Object.assign(this, appointment);
  }
}
