import { Component, Input } from '@angular/core';
import { SpecialSchedule } from 'src/app/models/special-schedule.model';
import { ModalController, AlertController } from '@ionic/angular';
import { Company } from 'src/app/models/company.model';
import { SpecialSchedulesService } from 'src/app/services/special-schedules.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastMessageService } from 'src/app/services/toast-messages.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.modal.html'
})
export class ScheduleModal {
  @Input() schedule: SpecialSchedule;
  @Input() company: Company;
  weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  constructor(
    private modalController: ModalController,
    private schedulesService: SpecialSchedulesService,
    private translate: TranslateService,
    private alertController: AlertController,
    private toastMessageService: ToastMessageService
  ) { }

  mainSchedule(): boolean {
    return this.company !== undefined;
  }

  specialSchedule(): boolean {
    return this.schedule !== undefined;
  }

  async deleteScheduleAlert() {
    const translated: any = {};
    this.translate.get('COMPANIES.DELETE_SPECIAL_SCHEDULE').subscribe(response => translated.header = response);
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
            this.deleteSchedule();
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

  deleteSchedule(): void {
    this.schedulesService.deleteSchedule(this.schedule.id).subscribe(
      response => {
        this.translate.get("COMPANIES.SCHEDULE_DELETED").subscribe(
          translated => this.toastMessageService.showMessage(translated, 'success')
        );
        this.modalController.dismiss();
      },
      error => this.toastMessageService.showMessage(error.error, 'danger')
    );
  }

  filterHours(day: string): any[] {
    if (this.mainSchedule()) {
      return this.company.hours.filter(hour => hour.day === day);
    } else {
      return this.schedule.hours.filter(hour => hour.day === day);
    }
  }

  addHour(hour: any): void {
    if (this.mainSchedule()) {
      this.company.hours.push(hour);
    } else {
      this.schedule.hours.push(hour);
    }
  }

  deleteHour(hour: any): void {
    if (this.mainSchedule()) {
      this.company.hours.splice(this.company.hours.indexOf(hour), 1);
    } else {
      this.schedule.hours.splice(this.schedule.hours.indexOf(hour), 1);
    }
  }

  cancel(): void {
    this.modalController.dismiss();
  }
}
