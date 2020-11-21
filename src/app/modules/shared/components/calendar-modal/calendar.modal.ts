import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { CalendarComponent  } from 'ionic2-calendar';
import { Company } from 'src/app/models/company.model';
import { UserService } from 'src/app/services/user.service';
import { CalendarEventsService } from 'src/app/services/calendar-events.service';
import { AppointmentsService } from 'src/app/services/appointments.service';
import { ToastMessageService } from 'src/app/services/toast-messages.service';
import { UtilsService } from 'src/app/services/utils.service';

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.modal.html'
})
export class CalendarModal implements OnInit {
  @ViewChild(CalendarComponent, null) myCalendar: CalendarComponent;
  @Input() company: Company;
  userRole = 'user';

  selectedTime: Date;
  currentDate: Date;
  monthsLoaded: number;
  daysPerMonth = 31;
  lastDayLoaded = new Date();
  eventSource = [];
  calendar = {
    mode: 'month',
    today: new Date()
  };

  constructor(
    private modalController: ModalController,
    private translate: TranslateService,
    private alertController: AlertController,
    private userService: UserService,
    private eventsService: CalendarEventsService,
    private appointmentsService: AppointmentsService,
    private toastMessageService: ToastMessageService,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.initializeCalendar();
    this.loadUserRole();
  }

  initializeCalendar(): void {
    this.calendar.today.setHours(0, 0, 0, 0);
    this.currentDate = this.calendar.today;
    this.monthsLoaded = 0;
    this.lastDayLoaded.setDate(43);
    this.lastDayLoaded.setHours(0, 0, 0);
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventsService.getEvents(this.company.id, this.currentDate, this.lastDayLoaded).subscribe(
      response => this.loadEventSource(response.events)
    );
  }

  loadUserRole(): void {
    this.userService.getApplicationUser().subscribe(
      response => this.userRole = response.userRole
    );
  }

  user(): boolean {
    return this.userRole === 'user';
  }

  manager(): boolean {
    return this.userRole === 'manager';
  }

  cancel(): void {
    this.modalController.dismiss();
  }

  getMonthName(): string {
    return 'MONTHS.' + monthNames[this.currentDate.getMonth()].toUpperCase();
  }

  updateEvents(): void {
    this.monthsLoaded++;
    const prevDate = this.lastDayLoaded;
    this.lastDayLoaded = new Date();
    this.lastDayLoaded.setDate((this.monthsLoaded * this.daysPerMonth) + 43);
    this.lastDayLoaded.setHours(0, 0, 0);
    this.eventsService.getEvents(this.company.id, prevDate, this.lastDayLoaded).subscribe(
      response => this.loadEventSource(response.events)
    );
  }

  loadEventSource(events): void {
    events.forEach(event => {
      this.eventSource.push({
        startTime: new Date(event.startTime),
        endTime: new Date(event.endTime),
        freeSlot: event.totalSlot - event.busySlot,
        totalSlot: event.totalSlot
      });
    });
    this.myCalendar.loadEvents();
  }

  onCurrentDateChanged(event: Date): void {
    this.currentDate = event;
    const auxDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 28);
    if (auxDate > this.lastDayLoaded) {
      this.updateEvents();
    }
  }

  onTimeSelected(event: { selectedTime: Date, events: any[] }) {
    if (event.selectedTime >= this.calendar.today) {
      this.selectedTime = event.selectedTime;
    }
    const auxDate = new Date(event.selectedTime.getFullYear(), event.selectedTime.getMonth(), 28);
    if (auxDate > this.lastDayLoaded) {
      this.updateEvents();
    }
  }

  async requestAppointment(event: any) {
    if (event.freeSlot <= 0) {
      return;
    }
    const translated: any = {};
    this.translate.get('APPOINTMENTS.NEW_APPOINTMENT').subscribe(response => translated.header = response);
    this.translate.get('APPOINTMENTS.APPOINTMENT_AT').subscribe(response => translated.message = response);
    this.translate.get('APPOINTMENTS.REQUEST').subscribe(response => translated.request = response);
    this.translate.get('COMMON.CANCEL').subscribe(response => translated.cancel = response);

    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: translated.header,
      message: translated.message + this.utilsService.datePipe.transform(event.startTime, 'HH:mm'),
      buttons: [
        {
          text: translated.request,
          handler: () => {
            if (this.user()) {
              const params = {  'company_id': this.company.id,
                                'created_by_manager': false,
                                'start_date': event.startTime,
                                'end_date': event.endTime
              };
              this.newAppointment(params);
            } else {
              this.newAppointmentManagerForm(event);
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

  async newAppointmentManagerForm(event: any) {
    const translated: any = {};
    this.translate.get('APPOINTMENTS.APPOINTMENT_DATA').subscribe(response => translated.header = response);
    this.translate.get('APPOINTMENTS.APPOINTMENT_AT').subscribe(response => translated.message = response);
    this.translate.get('APPOINTMENTS.CLIENT_NAME').subscribe(response => translated.name = response);
    this.translate.get('APPOINTMENTS.CLIENT_PHONE').subscribe(response => translated.phone = response);
    this.translate.get('COMMON.CONFIRM').subscribe(response => translated.confirm = response);
    this.translate.get('COMMON.CANCEL').subscribe(response => translated.cancel = response);

    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: translated.header,
      message: translated.message + this.utilsService.datePipe.transform(event.startTime, 'HH:mm'),
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
                                'start_date': event.startTime,
                                'end_date': event.endTime
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
        this.modalController.dismiss({newAppointment: response});
      },
      error => {
        if (error.error.error !== undefined) {
          this.toastMessageService.showMessage(error.error.error, 'danger');
        } else {
          this.translate.get("COMMON.UNDEFINED_ERROR").subscribe(
            translated => this.toastMessageService.showMessage(translated, 'danger')
          );
          this.modalController.dismiss();
        }
      }
    );
  }

  manageDay(date: Date): void {
    this.modalController.dismiss({selectedDate: date});
  }

  markDisabled = (date: Date) => {
    return date < this.calendar.today;
  }

  getHourStyle(freeSlots: number): {} {
    const style = {};
    if (freeSlots === 0) {
      style['color'] = 'red';
    } else {
      style['color'] = 'green';
      style['font-weight'] = 'bold';
    }
    return style;
  }

}
