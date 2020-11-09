import { Component, Output, EventEmitter } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from 'src/app/modules/login/services/login.service';
import { ToastMessageService } from 'src/app/services/toast-messages.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html'
})
export class NewUserComponent {
  @Output() selectAction = new EventEmitter();

  constructor(
    private loginService: LoginService,
    private translate: TranslateService,
    private toastMessageService: ToastMessageService
  ) { }

  createAccount(newUserObject: User): void {
    this.loginService.createAccount(newUserObject).pipe(
      switchMap(response => this.loginService.login(
        {
          api_v1_user: {
            email: newUserObject.email,
            password: newUserObject.password
          }
        }
      ))
    ).subscribe(
      _ => { },
      error => {
        if (error.error.email) {
          this.translate.get('LOGIN.EMAIL_TAKEN').subscribe(
            response => this.toastMessageService.showMessage(response, 'danger')
          );
        }
      }
    );
  }

  backToLogin(): void {
    this.selectAction.emit('login');
  }
}
