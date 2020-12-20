import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NotificationPreference } from 'src/app/models/notification-preference';

@Component({
  selector: 'app-notification-preferences',
  templateUrl: './notification-preferences.component.html',
})
export class NotificationPreferencesComponent {
  @Input() userIsManager: boolean;
  @Input() notificationPreferences: NotificationPreference;
  @Output() updateNotificationPreferences = new EventEmitter();

  updateData(): void {
    const newNotificationPreference = {
      active: this.notificationPreferences.active,
      user_1_week_before: this.notificationPreferences.user1WeekBefore,
      user_1_day_before: this.notificationPreferences.user1DayBefore,
      user_1_hour_before: this.notificationPreferences.user1HourBefore,
      user_when_manager_cancel_appointment: this.notificationPreferences.userWhenManagerCancelAppointment,
      manager_appointment_requested: this.notificationPreferences.managerAppointmentRequested,
      manager_appointment_cancelled: this.notificationPreferences.managerAppointmentCancelled
    };
    this.updateNotificationPreferences.emit(newNotificationPreference);
  }
}
