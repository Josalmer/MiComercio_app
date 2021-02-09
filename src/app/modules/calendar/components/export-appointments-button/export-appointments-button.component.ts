import { Component, Input } from '@angular/core';
import { AppointmentsService } from 'src/app/services/appointments.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastMessageService } from 'src/app/services/toast-messages.service';
import { AlertController } from '@ionic/angular';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-export-appointments-button',
  templateUrl: './export-appointments-button.component.html'
})
export class ExportAppointmentsButtonComponent {
  @Input() user: User;

  constructor(
    private appointmentsService: AppointmentsService,
    private toastMessageService: ToastMessageService,
    private translate: TranslateService,
    private alertController: AlertController
  ) { }

  export(): void {
    if (this.gmailUser()) {
      this.exportForm();
    } else {
      this.translate.get("APPOINTMENTS.GMAIL_NEEDED").subscribe(
        translated => this.toastMessageService.showMessage(translated, 'danger')
      );
    }
  }

  async exportForm() {
    const translated: any = {};
    this.translate.get('APPOINTMENTS.EXPORT_CONFIRMATION').subscribe(response => translated.header = response);
    this.translate.get('COMMON.CANCEL').subscribe(response => translated.cancel = response);
    this.translate.get('COMMON.CONFIRM').subscribe(response => translated.confirm = response);

    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: translated.header,
      buttons: [
        {
          text: translated.confirm,
          cssClass: 'bold-text',
          handler: () => {
            this.exportAppointments();
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

  exportAppointments(): void {
    this.appointmentsService.exportAppointments().subscribe(
      response => {
        this.translate.get("APPOINTMENTS.SUCESSFULLY_EXPORTED").subscribe(
          translated => this.toastMessageService.showMessage(translated, 'success')
        );
      },
      error => {
        this.translate.get("APPOINTMENTS.ERROR_WHILE_EXPORTING").subscribe(
          translated => this.toastMessageService.showMessage(translated, 'danger')
        );
      }
    );
  }

  gmailUser(): boolean {
    let gmailRegex = new RegExp('^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$');
    return gmailRegex.test(this.user.email);
  }
}
