import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {
  @Input() newUser: boolean;
  @Input() user: User;
  @Output() userEmitter = new EventEmitter();

  form: FormGroup;

  constructor(
    public fb: FormBuilder
  ) { }

  ngOnInit() {
    this.newUser ? this.createNewUserForm() : this.createEditUserForm();
  }

  createNewUserForm(): void {
    if (this.form) { return; }

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPass: ['', [Validators.required]]
    }, { validator: this.checkPasswords });
  }

  createEditUserForm(): void {
    if (this.form) { return; }

    this.form = this.fb.group({
      email: [this.user.email, [Validators.required, Validators.email]],
      name: [this.user.name || ''],
      surname: [this.user.surname || ''],
      phone: [this.user.phone || '']
    });
  }

  submitUser(): void {
    this.newUser ? this.emitNewUser() : this.emitEditUser();
  }

  emitNewUser(): void {
    const newUserObject = {
      email: this.form.value.email,
      name: this.form.value.name,
      surname: this.form.value.surname,
      phone: this.form.value.phone,
      password: this.form.value.password
    };
    this.userEmitter.emit(newUserObject);
  }

  emitEditUser(): void {
    const editUserObject = {
      email: this.form.value.email,
      name: this.form.value.name,
      surname: this.form.value.surname,
      phone: this.form.value.phone
    };
    this.userEmitter.emit(editUserObject);
  }

  checkPasswords(group: FormGroup) {
    const pass = group.get('password').value;
    const confirmPass = group.get('confirmPass').value;

    return pass === confirmPass ? null : { notSame: true };
  }
}
