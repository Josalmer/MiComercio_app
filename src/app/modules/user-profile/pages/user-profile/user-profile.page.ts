import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ToastMessageService } from 'src/app/services/toast-messages.service';
import { TranslateService } from '@ngx-translate/core';
import { SessionService } from 'src/app/modules/login/services/session.service';
import { LoginService } from 'src/app/modules/login/services/login.service';
import { NavController } from '@ionic/angular';
import { User } from 'src/app/models/user.model';
import { PaymentPreference } from 'src/app/models/payment-preference';

@Component({
  selector: 'app-user-profile',
  templateUrl: 'user-profile.page.html'
})
export class UserProfilePage implements OnInit {
  user: User;
  view = 'personal';

  constructor(
    private userService: UserService,
    private toastMessageService: ToastMessageService,
    private translate: TranslateService,
    private sessionService: SessionService,
    private loginService: LoginService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.loadUser();
  }

  loadUser(): void {
    this.userService.getApplicationUser().subscribe(
      response => this.user = response
    );
  }

  toggleView(selection: string): void {
    if (this.view !== selection) {
      this.loadUser();
      this.view = selection;
    }
  }

  updateUser(editUserObject: User): void {
    this.userService.updateUser(editUserObject).subscribe(
      response => {
        this.translate.get("USER.CORRECTLY_EDITED").subscribe(
          translated => this.toastMessageService.showMessage(translated, 'success')
        );
      },
      error => {
        this.translate.get("USER.EDIT_ERROR").subscribe(
          translated => this.toastMessageService.showMessage(translated, 'danger')
        );
      }
    );
  }

  updatePaymentPreference(_newPaymentPreference: PaymentPreference): void {
    this.userService.updatePaymentPreferences({newPaymentPreference: _newPaymentPreference}).subscribe(
      response => {
        this.translate.get("USER.CORRECTLY_EDITED").subscribe(
          translated => this.toastMessageService.showMessage(translated, 'success')
        );
      },
      error => {
        this.translate.get("USER.EDIT_ERROR").subscribe(
          translated => this.toastMessageService.showMessage(translated, 'danger')
        );
      }
    );
  }

  logout(): void {
    this.loginService.logout().subscribe(
      response => {
        this.sessionService.clearAuthToken();
        this.userService.deleteApplicationUser();
        this.navCtrl.navigateRoot(['/login']);
      }
    );
  }

  pendingPaymentData(): boolean {
    return this.user.paymentPreference.type === null || this.user.paymentPreference.number === null;
  }

  pendingValidation(): boolean {
    return !this.pendingPaymentData() && !this.user.paymentPreference.validated;
  }
}
