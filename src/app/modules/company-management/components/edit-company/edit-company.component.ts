import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Company } from 'src/app/models/company.model';
import { ScheduleModal } from '../schedule-modal/schedule.modal';

@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html'
})
export class EditCompanyComponent {
  @Input() company: Company;
  @Output() reloadCompany = new EventEmitter();
  showSpecialSchedules = false;

  constructor(
    private modalController: ModalController
  ) { }

  async editMainSchedule() {
    const modal = await this.modalController.create({
      component: ScheduleModal,
      componentProps: { company: this.company }
    });
    await modal.present();
    await modal.onWillDismiss();
    this.reloadCompany.emit();
  }
}
