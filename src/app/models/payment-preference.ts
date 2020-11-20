export class PaymentPreference {
  type: string;
  number: string;
  bank: string;
  expirationMonth: string;
  expirationYear: string;
  validated: boolean;

  constructor(paymentPreference) {
    Object.assign(this, paymentPreference);
  }
}
