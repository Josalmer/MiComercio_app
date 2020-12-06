import { Component, Input, OnInit, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Company } from 'src/app/models/company.model';
import { AppointmentsService } from 'src/app/services/appointments.service';
import { Appointment } from 'src/app/models/appointment.model';
import { ModalController, AlertController } from '@ionic/angular';
import { CalendarModal } from 'src/app/modules/shared/components/calendar-modal/calendar.modal';
import { TranslateService } from '@ngx-translate/core';
import { ToastMessageService } from 'src/app/services/toast-messages.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-company-gestion',
  templateUrl: './company-gestion.component.html'
})
export class CompanyGestionComponent implements OnInit, OnChanges {
  @Input() company: Company;
  @Input() selectedDate: Date;
  @Output() changeDate = new EventEmitter();
  @Output() reloadCompany = new EventEmitter();
  appointments: Appointment[] = [];

  constructor(
    private appointmentsService: AppointmentsService,
    private modalController: ModalController,
    private translate: TranslateService,
    private alertController: AlertController,
    private toastMessageService: ToastMessageService,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.loadAppointments();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedDate) {
      this.loadAppointments();
    }
  }

  loadAppointments(): void {
    this.appointmentsService.getCompanyAppointmentsByDate(this.company.id, this.selectedDate).subscribe(
      response => this.appointments = response.appointments
    );
  }

  removeAppointment(appointmentId: string): void {
    this.appointments.splice(this.appointments.indexOf(this.appointments.find(n => n.id === appointmentId)), 1);
    this.reloadCompany.emit();
  }

  async showCalendar() {
    const modal = await this.modalController.create({
      component: CalendarModal,
      componentProps: { company: this.company }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if ( data ) {
      if (data.selectedDate) {
        this.selectedDate = data.selectedDate;
        this.changeDate.emit(this.selectedDate);
      }
    }
  }

  async requestFirstAvailableAppointment() {
    const translated: any = {};
    this.translate.get('APPOINTMENTS.APPOINTMENT_DATA').subscribe(response => translated.header = response);
    this.translate.get('APPOINTMENTS.APPOINTMENT_DATE').subscribe(response => translated.message = response);
    this.translate.get('APPOINTMENTS.CLIENT_NAME').subscribe(response => translated.name = response);
    this.translate.get('APPOINTMENTS.CLIENT_PHONE').subscribe(response => translated.phone = response);
    this.translate.get('COMMON.CONFIRM').subscribe(response => translated.confirm = response);
    this.translate.get('COMMON.CANCEL').subscribe(response => translated.cancel = response);

    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: translated.header,
      message: translated.message + ': ' + this.utilsService.datePipe.transform(this.company.fistAvailableAppointment.start, 'dd/MM - HH:mm'),
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: translated.name
        },
        {
          name: 'phone',
          type: 'text',
          placeholder: translated.phone
        },
      ],
      buttons: [
        {
          text: translated.confirm,
          handler: data => {
            if (data.name !== '' && data.phone !== '') {
              const params = {  'company_id': this.company.id,
                                'created_by_manager': true,
                                'user_name': data.name,
                                'user_phone': data.phone,
                                'start_date': this.company.fistAvailableAppointment.start,
                                'end_date': this.company.fistAvailableAppointment.end
              };
              this.newAppointment(params);
            } else {
              return false;
            }
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

  newAppointment(params: {}): void {
    this.appointmentsService.createAppointment(params).subscribe(
      response => {
        this.translate.get("APPOINTMENTS.CORRECTLY_CREATED").subscribe(
          translated => this.toastMessageService.showMessage(translated, 'success')
        );
        this.reloadCompany.emit();
        this.loadAppointments();
      },
      error => {
        if (error.error.error !== undefined) {
          this.toastMessageService.showMessage(error.error.error, 'danger');
        } else {
          this.translate.get("COMMON.UNDEFINED_ERROR").subscribe(
            translated => this.toastMessageService.showMessage(translated, 'danger')
          );
        }
      }
    );
  }
}
