import { NotificationPreference } from './notification-preference';
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
  notificationPreference: NotificationPreference;

  constructor(user) {
    Object.assign(this, user);
  }
}
