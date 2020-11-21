import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertController } from '@ionic/angular';
import { ToastMessageService } from 'src/app/services/toast-messages.service';
import { HoursService } from 'src/app/services/hours.service';

@Component({
  selector: 'app-week-day',
  templateUrl: './week-day.component.html'
})
export class WeekDayComponent {
  showDetails = false;
  @Input() day: string;
  @Input() hours: any[];
  @Input() companyId: string;
  @Input() scheduleId: string;
  @Output() newHourEmitter = new EventEmitter();
  @Output() deleteHourEmitter = new EventEmitter();

  constructor(
    private translate: TranslateService,
    private alertController: AlertController,
    private toastMessageService: ToastMessageService,
    private hoursService: HoursService
  ) { }

  translatedDay(day: string): string {
    let translatedDay: string;
    this.translate.get('DAYS.' + day.toUpperCase()).subscribe(response => translatedDay = response);
    return translatedDay;
  }

  async newHour() {
    const translated: any = {};
    this.translate.get('COMPANIES.ADD_HOUR').subscribe(response => translated.header = response);
    this.translate.get('COMPANIES.OPENING_TIME').subscribe(response => translated.openingTime = response);
    this.translate.get('COMPANIES.CLOSING_TIME').subscribe(response => translated.closingTime = response);
    this.translate.get('COMMON.ACCEPT').subscribe(response => translated.accept = response);
    this.translate.get('COMMON.CANCEL').subscribe(response => translated.cancel = response);

    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: translated.header,
      inputs: [
        {
          label: translated.openingTime,
          name: 'openingTime',
          type: 'time'
        },
        {
          label: translated.closingTime,
          name: 'closingTime',
          type: 'time'
        }
      ],
      buttons: [
        {
          text: translated.accept,
          handler: (alertData) => {
            if (alertData.openingTime && alertData.closingTime) {
              this.createHour(alertData.openingTime, alertData.closingTime);
            } else {
              return false;
            }
          }
        },
        {
          text: translated.cancel,
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }
      ]
    });
    await alert.present();
  }

  createHour(opening: any, closing: any): void {
    const params = {
      company_id: this.companyId,
      special_schedule_id: this.scheduleId,
      day: this.day,
      opening_time: opening,
      closing_time: closing
    };
    this.hoursService.createHour(params).subscribe(
      response => {
        this.newHourEmitter.emit(response);
      },
      error => {
        this.toastMessageService.showMessage(error.error.error[0], 'danger');
      }
    );
  }

  async deleteHour(hour: any) {
    const translated: any = {};
    this.translate.get('COMPANIES.DELETE_HOUR').subscribe(response => translated.header = response);
    this.translate.get('COMMON.ACTION_ALERT').subscribe(response => translated.message = response);
    this.translate.get('COMMON.DELETE').subscribe(response => translated.delete = response);
    this.translate.get('COMMON.CANCEL').subscribe(response => translated.cancel = response);

    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: translated.header,
      message: translated.message,
      buttons: [
        {
          text: translated.delete,
          handler: () => {
            this.hoursService.deleteHour(hour.id).subscribe(
              response => {
                this.deleteHourEmitter.emit(hour);
              }
            );
          }
        }, {
          text: translated.cancel,
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }
      ]
    });

    await alert.present();
  }
}
