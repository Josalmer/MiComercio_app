import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Company } from 'src/app/models/company.model';
import { CompaniesService } from 'src/app/services/companies.service';
import { ToastMessageService } from 'src/app/services/toast-messages.service';
import { TranslateService } from '@ngx-translate/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html'
})
export class CompanyFormComponent implements OnInit {
  @Input() company: Company;
  @Output() companyEmitter = new EventEmitter();

  form: FormGroup;
  published: boolean;

  constructor(
    public fb: FormBuilder,
    private companiesService: CompaniesService,
    private toastMessageService: ToastMessageService,
    private translate: TranslateService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.published = this.company.published;
    this.createCompanyForm();
  }

  createCompanyForm(): void {
    if (this.form) { return; }

    this.form = this.fb.group({
      web: [this.company.web],
      simultaneousNumber: [this.company.simultaneousNumber],
      appointmentDuration: [this.company.appointmentDuration],
      diaryClientLimit: [this.company.diaryClientLimit],
      monthlyClientLimit: [this.company.monthlyClientLimit],
      mail: [this.company.mail],
      phone: [this.company.phone],
      description: [this.company.description],
      cp: [this.company.address ? this.company.address.cp : ''],
      town: [this.company.address ? this.company.address.town : ''],
      province: [this.company.address ? this.company.address.province : ''],
      country: [this.company.address ? this.company.address.country : ''],
      direction: [this.company.address ? this.company.address.direction : ''],
      latitude: [this.company.address ? this.company.address.latitude : ''],
      longitude: [this.company.address ? this.company.address.longitude : '']
    });
  }

  submitCompany(): void {
    const editedCompanyObject = {
      edited_company_object: {
        diary_client_limit: this.form.value.diaryClientLimit,
        monthly_client_limit: this.form.value.monthlyClientLimit,
        simultaneous_appointment_number: this.form.value.simultaneousNumber,
        appointment_duration: this.form.value.appointmentDuration,
        web: this.form.value.web,
        mail: this.form.value.mail,
        phone: this.form.value.phone,
        description: this.form.value.description,
        published: this.published
      },
      edited_direction_object: {
        cp: this.form.value.cp,
        town: this.form.value.town,
        province: this.form.value.province,
        country: this.form.value.country,
        direction: this.form.value.direction,
        latitude: this.form.value.latitude,
        longitude: this.form.value.longitude
      }
    };

    this.companiesService.updateCompany(this.company.id, editedCompanyObject).subscribe(
      response => {
        this.companyEmitter.emit(response);
        this.translate.get("COMPANIES.SUCCESS_EDITED").subscribe(
          translated => this.toastMessageService.showMessage(translated, 'success')
        );
      },
      error => {
        this.toastMessageService.showMessage(error.error.error[0], 'danger');
      }
    );
  }

  async togglePublished() {
    const translated: any = {};
    this.translate.get((this.company.published ? 'COMPANIES.HIDE_COMPANY' : 'COMPANIES.PUBLISH_COMPANY')).subscribe(response => translated.header = response);
    this.translate.get('COMMON.ACTION_ALERT').subscribe(response => translated.message = response);
    this.translate.get('COMMON.CONFIRM').subscribe(response => translated.confirm = response);
    this.translate.get('COMMON.CANCEL').subscribe(response => translated.cancel = response);

    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: translated.header,
      message: translated.message,
      buttons: [
        {
          text: translated.confirm,
          handler: () => {
            this.published = !this.published;
            this.submitCompany();
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
