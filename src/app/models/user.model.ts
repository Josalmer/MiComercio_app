import { PaymentPreference } from './payment-preference';

export class User {
  id: string;
  email: string;
  name: string;
  surname: string;
  phone: string;
  userRole: string;
  password: string;
  paymentPreference: PaymentPreference;

  constructor(user) {
    Object.assign(this, user);
  }
}
