import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Appointment } from 'src/app/models/appointment.model';
import { TranslateService } from '@ngx-translate/core';
import { AlertController } from '@ionic/angular';
import { AppointmentsService } from 'src/app/services/appointments.service';
import { ToastMessageService } from 'src/app/services/toast-messages.service';

@Component({
  selector: 'app-appointment-card',
  templateUrl: './appointment-card.component.html'
})
export class AppointmentCardComponent {
  @Input() appointment: Appointment;
  @Input() section: string;
  @Input() role: string;
  @Output() deleteAppointment = new EventEmitter();
  @Output() navigateToCompany = new EventEmitter();

  showDetails = false;

  constructor(
    private translate: TranslateService,
    private alertController: AlertController,
    private appointmentsService: AppointmentsService,
    private toastMessageService: ToastMessageService
  ) { }

  user(): boolean {
    return this.role === 'user';
  }

  manager(): boolean {
    return this.role === 'manager';
  }

  calendar(): boolean {
    return this.section === 'calendar';
  }

  company(): boolean {
    return this.section === 'company';
  }

  toggleDetails(): void {
    if (this.manager()) {
      this.showDetails = !this.showDetails;
    }
  }

  navigate(): void {
    this.navigateToCompany.emit({id: this.appointment.companyId, date: this.appointment.startDate});
  }

  async cancel() {
    const translated: any = {};
    this.translate.get('APPOINTMENTS.CANCEL').subscribe(response => translated.header = response);
    this.translate.get('COMMON.ACTION_ALERT').subscribe(response => translated.message = response);
    this.translate.get('COMMON.CANCEL').subscribe(response => translated.cancel = response);
    this.translate.get('COMMON.DELETE').subscribe(response => translated.delete = response);

    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: translated.header,
      message: translated.message,
      buttons: [
        {
          text: translated.delete,
          handler: () => {
            this.appointmentsService.cancelAppointment(this.appointment.id).subscribe(
              response => {
                this.deleteAppointment.emit(this.appointment.id);
                this.translate.get("APPOINTMENTS.CORRECTLY_CANCELLED").subscribe(
                  translated => this.toastMessageService.showMessage(translated, 'success')
                );
              },
              error => {
                this.translate.get("APPOINTMENTS.NOT_CANCELLED").subscribe(
                  translated => this.toastMessageService.showMessage(translated, 'danger')
                );
              }
            );
          }
        },
        {
          text: translated.cancel,
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });

    await alert.present();
  }
}