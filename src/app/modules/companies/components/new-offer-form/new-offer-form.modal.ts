import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { PaymentServicesService } from 'src/app/services/payment_services.service';

@Component({
  selector: 'app-new-offer-form',
  templateUrl: './new-offer-form.modal.html'
})
export class NewOfferFormModal implements OnInit {

  form: FormGroup;
  today = new Date().toISOString();

  constructor(
    private modalController: ModalController,
    private fb: FormBuilder,
    private paymentServices: PaymentServicesService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    if (this.form) { return; }

    this.form = this.fb.group({
        text: ['', [Validators.required]],
        company_id: [null, [Validators.required]],
        discount: [null],
        validity: [null, [Validators.required]]
    });
  }

  selectCompany(companyId): void {
    if (companyId !== 'all') {
      this.form.get("company_id").setValue(companyId);
    }
  }

  create(): void {
    this.paymentServices.createOffer(this.form.value).subscribe(
      response => this.modalController.dismiss(true)
    );
  }

  cancel(): void {
    this.modalController.dismiss();
  }
}
