import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { User } from 'src/app/models/user.model';
import { TranslationService } from 'src/app/services/translation.service';
import { UseTermsModal } from '../use-terms-modal/use-terms.modal';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {
  @Input() newUser: boolean;
  @Input() user: User;
  @Output() userEmitter = new EventEmitter();
  @Output() langEmitter = new EventEmitter();

  userRole: string;
  form: FormGroup;
  selectedLanguage: string;
  languages = [{name: 'Español', code: 'es'}, {name: 'English', code: 'en'}]

  constructor(
    public fb: FormBuilder,
    private modalController: ModalController,
    private translationService: TranslationService
  ) { }

  async ngOnInit() {
    this.newUser ? this.createNewUserForm() : this.createEditUserForm();
    this.selectedLanguage = await this.translationService.getCurrentLanguage();
  }

  createNewUserForm(): void {
    this.userRole = 'user';
    if (this.form) { return; }

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPass: ['', [Validators.required]],
      acceptTerms: [false, [Validators.required, Validators.requiredTrue]]
    }, { validator: this.checkPasswords });
  }

  createEditUserForm(): void {
    this.userRole = this.user.userRole;
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
      password: this.form.value.password,
      organization_manager: this.userRole === 'manager'
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

  async openUseTerms() {
    const modal = await this.modalController.create({
      component: UseTermsModal
    });
    await modal.present();
  }
  
  setLanguage(languageCode: string) {
    if (this.selectedLanguage !== languageCode) {
      this.selectedLanguage = languageCode;
      this.translationService.setLanguage(languageCode);
      this.langEmitter.emit();
    }
  }
}
