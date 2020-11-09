import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from 'src/app/modules/login/services/login.service';
import { ToastMessageService } from 'src/app/services/toast-messages.service';

@Component({
  selector: 'app-new-session',
  templateUrl: './new-session.component.html',
})
export class NewSessionComponent implements OnInit {
  @Output() selectAction = new EventEmitter();

  form: FormGroup;

  constructor(
    public fb: FormBuilder,
    private loginService: LoginService,
    private toastMessageService: ToastMessageService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    if (this.form) { return; }
    this.form = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  login(): void {
    this.loginService.login(
      {
        api_v1_user: {
          email: this.form.value.email,
          password: this.form.value.password
        }
      }
    ).subscribe(
      _ => { },
      error => this.toastMessageService.showMessage(error.error.error, 'danger')
    );
  }

  goNextField(nextElement): void {
    nextElement.setFocus();
  }

  newAccount() {
    this.selectAction.emit('newUser');
  }

  recoverPass() {
    this.selectAction.emit('recoverPass');
  }
}
