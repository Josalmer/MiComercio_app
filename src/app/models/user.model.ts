export class User {
  id: string;
  email: string;
  name: string;
  surname: string;
  phone: string;
  userRole: Date;
  password: string;

  constructor(user) {
    Object.assign(this, user);
  }
}
