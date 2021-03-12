import { Component, Input, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Company } from 'src/app/models/company.model';
import { PaymentServicesService } from 'src/app/services/payment_services.service';
import { ToastMessageService } from 'src/app/services/toast-messages.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-boost-company-slider',
  templateUrl: 'boost-company-slider.component.html'
})
export class BoostCompanySliderComponent implements OnInit {

  @Input() company: Company;

  sliderValue = 1;
  cost: number;

  constructor(
    private toastMessageService: ToastMessageService,
    private translate: TranslateService,
    private utilsService: UtilsService,
    private alertController: AlertController,
    private paymentServicesService: PaymentServicesService
  ) { }

  ngOnInit(): void {
    this.sliderValue = this.company.boostFactor;
  }

  sliderClicked(): void {
    if (!this.company.published) {
      this.translate.get("COMPANIES.MUST_BE_PUBLISHED").subscribe(
        translated => this.toastMessageService.showMessage(translated, 'secondary')
      );
    } else if (this.company.boostValidity) {
      let validityDate = this.utilsService.datePipe.transform(this.company.boostValidity, 'dd/MM/yy');
      this.translate.get("COMPANIES.ALREADY_BOOSTED", {date: validityDate}).subscribe(
        translated => this.toastMessageService.showMessage(translated, 'secondary')
      );
    }
  }

  updateBoostFactor(): void {
    if (!this.company.boostValidity && this.company.published) {
      this.cost = Math.round(100 * (5 + this.sliderValue * (20 / 100))) / 100;
      this.newBoostFactor();
    }
  }

  async newBoostFactor() {
    const translated: any = {};
    this.translate.get('COMPANIES.BOOST_FACTOR_FORM.HEADER').subscribe(response => translated.header = response);
    this.translate.get('COMPANIES.BOOST_FACTOR_FORM.BODY', {boostFactor: this.sliderValue, cost: this.cost}).subscribe(response => translated.message = response);
    this.translate.get('COMPANIES.BOOST_FACTOR_FORM.1_YEAR').subscribe(response => translated.year = response);
    this.translate.get('COMPANIES.BOOST_FACTOR_FORM.1_MONTH').subscribe(response => translated.month = response);
    this.translate.get('COMMON.CANCEL').subscribe(response => translated.cancel = response);

    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: translated.header,
      message: translated.message,
      buttons: [
        {
          text: translated.month,
          handler: data => {
            this.postBoostCompany(1);
          }
        },
        {
          text: translated.year,
          handler: data => {
            this.postBoostCompany(12);
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

  postBoostCompany(duration: number): void {
    const params = {
      company_id: this.company.id, 
      cost: this.cost,
      duration: duration,
      boost_factor: this.sliderValue
    };
    this.paymentServicesService.boostCompany(params).subscribe(
      response => this.company = response
    )
  }
}
