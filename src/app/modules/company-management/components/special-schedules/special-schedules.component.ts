import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SpecialSchedule } from 'src/app/models/special-schedule.model';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ToastMessageService } from 'src/app/services/toast-messages.service';
import { SpecialSchedulesService } from 'src/app/services/special-schedules.service';
import { Company } from 'src/app/models/company.model';
import { ScheduleModal } from '../schedule-modal/schedule.modal';

@Component({
  selector: 'app-special-schedules',
  templateUrl: './special-schedules.component.html'
})
export class SpecialSchedulesComponent {
  @Input() schedules: SpecialSchedule[];
  @Input() company: Company;
  @Output() reloadCompany = new EventEmitter();

  constructor(
    private translate: TranslateService,
    private alertController: AlertController,
    private toastMessageService: ToastMessageService,
    private schedulesService: SpecialSchedulesService,
    private modalController: ModalController
  ) { }

  async newSpecialSchedule() {
    const translated: any = {};
    this.translate.get('COMPANIES.NEW_SPECIAL_SCHEDULE').subscribe(response => translated.header = response);
    this.translate.get('COMPANIES.SCHEDULE_START').subscribe(response => translated.startDate = response);
    this.translate.get('COMPANIES.SCHEDULE_END').subscribe(response => translated.endDate = response);
    this.translate.get('COMPANIES.NO_ACTIVITY').subscribe(response => translated.noActivity = response);
    this.translate.get('COMMON.ACCEPT').subscribe(response => translated.accept = response);
    this.translate.get('COMMON.CANCEL').subscribe(response => translated.cancel = response);

    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: translated.header,
      inputs: [
        {
          label: translated.startDate,
          name: 'startDate',
          type: 'date'
        },
        {
          label: translated.endDate,
          name: 'endDate',
          type: 'date'
        }
      ],
      buttons: [
        {
          text: translated.accept,
          handler: (alertData) => {
            if (alertData.startDate && alertData.endDate) {
              this.createSchedule(alertData.startDate, alertData.endDate);
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

  createSchedule(startDate: Date, endDate: Date): void {
    const params = {
      company_id: this.company.id,
      start_date: startDate,
      end_date: endDate
    };
    this.schedulesService.createSchedule(params).subscribe(
      response => {
        this.translate.get("COMPANIES.SCHEDULE_CREATED").subscribe(
          translated => this.toastMessageService.showMessage(translated, 'success')
        );
        this.reloadCompany.emit();
      },
      error => {
        this.toastMessageService.showMessage(error.error.error[0], 'danger');
      }
    );
  }

  async editSchedule(specialSchedule: SpecialSchedule) {
    const modal = await this.modalController.create({
      component: ScheduleModal,
      componentProps: { schedule: specialSchedule }
    });
    await modal.present();
    await modal.onWillDismiss();
    this.reloadCompany.emit();
  }
}
