import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaymentPreference } from 'src/app/models/payment-preference';

@Component({
  selector: 'app-payment-preferences',
  templateUrl: './payment-preferences.component.html',
})
export class PaymentPreferencesComponent {
  @Input() paymentPreferences: PaymentPreference;
  @Output() updatePreferences = new EventEmitter();

  types = ['card', 'bank'];

  invalidData(): boolean {
    let invalid = true;
    if (this.paymentPreferences.type === 'card') {
      if (this.paymentPreferences.expirationMonth !== null && this.paymentPreferences.expirationYear !== null && this.paymentPreferences.number !== null) {
        invalid = false;
      }
    } else if (this.paymentPreferences.type === 'bank') {
      if (this.paymentPreferences.number !== null && this.paymentPreferences.bank !== null) {
        invalid = false;
      }
    }
    return invalid;
  }

  updateData(): void {
    const newPaymentPreference = {
      payment_type: this.paymentPreferences.type,
      bank: this.paymentPreferences.bank,
      number: this.paymentPreferences.number,
      expiration_month: this.paymentPreferences.expirationMonth,
      expiration_year: this.paymentPreferences.expirationYear
    };
    this.updatePreferences.emit(newPaymentPreference);
  }
}
