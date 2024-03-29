import { Component, OnInit } from '@angular/core';
import { Company } from 'src/app/models/company.model';
import { CompaniesService } from 'src/app/services/companies.service';
import { ActivatedRoute } from '@angular/router';
import { Appointment } from 'src/app/models/appointment.model';
import { AlertController, ModalController } from '@ionic/angular';
import { AppointmentsService } from 'src/app/services/appointments.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastMessageService } from 'src/app/services/toast-messages.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CalendarModal } from 'src/app/modules/shared/components/calendar-modal/calendar.modal';
import { AssessmentFormModal } from '../../components/assessment-form/assessment-form.modal';
import { Assessment } from 'src/app/models/assessment.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-company',
  templateUrl: 'company.page.html'
})
export class CompanyPage implements OnInit {

  companyId: string;
  company: Company;
  userAppointments: Appointment[] = [];
  filledStars: any;
  emptyStars: any;
  currentUserId: string;

  currentUserAssesments: Assessment[];
  otherUsersAssessments: Assessment[];

  constructor(
    private companiesService: CompaniesService,
    private route: ActivatedRoute,
    private modalController: ModalController,
    private appointmentsService: AppointmentsService,
    private translate: TranslateService,
    private alertController: AlertController,
    private toastMessageService: ToastMessageService,
    private utilsService: UtilsService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.companyId = params['id'];
      this.loadUserId();
      this.loadUserAppointments();
    });
  }

  loadCompany(event ?: any): void {
    this.companiesService.getCompany(this.companyId).subscribe(
      response => {
        this.company = response;
        this.currentUserAssesments = this.company.assessments.filter(x => x.userId === this.currentUserId)
        this.otherUsersAssessments = this.company.assessments.filter(x => x.userId !== this.currentUserId)
        this.filledStars = Array(this.company.averagePuntuation).fill(0);
        this.emptyStars = Array(5 - this.company.averagePuntuation).fill(0);
        if (event) { event.target.complete(); }
      }
    );
  }

  loadUserId(): void {
    this.userService.getApplicationUser().subscribe(
      response => {
        this.currentUserId = response.id;
        this.loadCompany();
      }
    );
  }

  loadUserAppointments(): void {
    this.appointmentsService.getCurrentUserAppointmentsForCompany(this.companyId).subscribe(
      response => this.userAppointments = response.appointments
    );
  }

  removeAppointment(appointmentId: string): void {
    this.userAppointments.splice(this.userAppointments.indexOf(this.userAppointments.find(n => n.id === appointmentId)), 1);
    this.loadCompany();
  }

  async requestAppointment() {
    const modal = await this.modalController.create({
      component: CalendarModal,
      componentProps: { company: this.company }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if ( data ) {
      this.loadUserAppointments();
    }
  }

  async requestFirstAvailableAppointment() {
    const translated: any = {};
    this.translate.get('COMPANIES.FIRST_AVAILABLE_APPOINTMENT').subscribe(response => translated.header = response);
    this.translate.get('APPOINTMENTS.APPOINTMENT_DATE').subscribe(response => translated.message = response);
    this.translate.get('COMMON.CONFIRM').subscribe(response => translated.confirm = response);
    this.translate.get('COMMON.CANCEL').subscribe(response => translated.cancel = response);

    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: translated.header,
      message: translated.message + ': ' + this.utilsService.datePipe.transform(this.company.fistAvailableAppointment.start, 'dd/MM - HH:mm'),
      buttons: [
        {
          text: translated.confirm,
          handler: data => {
            const params = {  'company_id': this.company.id,
                              'created_by_manager': false,
                              'start_date': this.company.fistAvailableAppointment.start,
                              'end_date': this.company.fistAvailableAppointment.end
            };
            this.newAppointment(params);
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
        this.loadCompany();
        this.loadUserAppointments();
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

  async newAssessment() {
    const modal = await this.modalController.create({
      component: AssessmentFormModal,
      componentProps: { company: this.company }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if ( data ) {
      this.loadCompany();
    }
  }

  refreshData(event): void {
    this.loadCompany(event);
    this.loadUserAppointments();
  }
}
