import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { LoginService } from 'src/app/modules/login/services/login.service';
import { ToastMessageService } from 'src/app/services/toast-messages.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
})
export class RecoverPasswordComponent implements OnInit {
  @Output() selectAction = new EventEmitter();

  form: FormGroup;
  formError: boolean;

  constructor(
    public fb: FormBuilder,
    private loginService: LoginService,
    private toastMessageService: ToastMessageService,
    private translate: TranslateService
    ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    if (this.form) { return; }

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  sendPasswordRecovery() {
    this.formError = false;
    if (!this.form.value.email || !this.form.get('email').valid) {
      this.formError = true;
    } else {
      this.loginService.sendPasswordRecovery(this.form.value.email)
        .pipe(
          finalize(() => {
            this.translate.get('LOGIN.RECOVER_PASS_SENT').subscribe(translation => {
              this.toastMessageService.showMessage(translation, 'success');
            });
          })
        ).subscribe();
    }
  }

  backToLogin() {
    this.selectAction.emit('login');
  }
}
