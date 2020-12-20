export class NotificationPreference {
  active: boolean;
  user1WeekBefore: boolean;
  user1DayBefore: boolean;
  user1HourBefore: boolean;
  userWhenManagerCancelAppointment: boolean;
  managerAppointmentRequested: boolean;
  managerAppointmentCancelled: boolean;

  constructor(notificationPreference) {
    Object.assign(this, notificationPreference);
  }
}
