import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ToastMessageService } from 'src/app/services/toast-messages.service';
import { TranslateService } from '@ngx-translate/core';
import { SessionService } from 'src/app/modules/login/services/session.service';
import { LoginService } from 'src/app/modules/login/services/login.service';
import { ModalController, NavController } from '@ionic/angular';
import { User } from 'src/app/models/user.model';
import { Plugins } from '@capacitor/core';
import { UseTermsModal } from 'src/app/modules/shared/components/use-terms-modal/use-terms.modal';
import { TranslationService } from 'src/app/services/translation.service';

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
    private navCtrl: NavController,
    private modalController: ModalController,
    private translationService: TranslationService
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

  updatePaymentPreference(_newPaymentPreference: any): void {
    this.userService.updatePaymentPreferences({newPaymentPreference: _newPaymentPreference}).subscribe(
      response => {
        this.translate.get("USER.PAYMENT_PREFERENCES_EDITED").subscribe(
          translated => this.toastMessageService.showMessage(translated, 'success')
        );
      },
      error => {
        this.translate.get("USER.PAYMENT_PREFERENCES_EDIT_ERROR").subscribe(
          translated => this.toastMessageService.showMessage(translated, 'danger')
        );
      }
    );
  }

  updateNotificationPreferences(_newNotificationPreference: any): void {
    this.userService.updateNotificationPreferences({newNotificationPreference: _newNotificationPreference}).subscribe(
      response => {
        this.translate.get("USER.NOTIFICATION_PREFERENCES_EDITED").subscribe(
          translated => this.toastMessageService.showMessage(translated, 'success')
        );
      },
      error => {
        this.translate.get("USER.NOTIFICATION_PREFERENCES_EDIT_ERROR").subscribe(
          translated => this.toastMessageService.showMessage(translated, 'danger')
        );
      }
    );
  }

  async logout() {
    if (this.sessionService.loggedWithGoogle()) {
      await Plugins.GoogleAuth.signOut();
    }
    this.loginService.logout().subscribe(
      response => {
        this.sessionService.clearAuthToken();
        this.sessionService.clearLoginMethod();
        this.translationService.clearLanguage();
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

  async openUseTerms() {
    const modal = await this.modalController.create({
      component: UseTermsModal
    });
    await modal.present();
  }

  reload() {
    window.location.reload();
  }
}
