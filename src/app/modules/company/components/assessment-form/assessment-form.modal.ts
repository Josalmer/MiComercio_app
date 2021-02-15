import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Company } from 'src/app/models/company.model';
import { ToastMessageService } from 'src/app/services/toast-messages.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-assessment-form',
  templateUrl: './assessment-form.modal.html'
})
export class AssessmentFormModal implements OnInit {

  @Input() company: Company;

  form: FormGroup;

  text: string = '';
  attention: number = 1;
  satisfaction: number = 1;
  puntuality: number = 1;

  constructor(
    private modalController: ModalController,
    private fb: FormBuilder,
    private userService: UserService,
    private toastMessageService: ToastMessageService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    if (this.form) { return; }

    this.form = this.fb.group({
        text: ['', [Validators.required]]
    });

  }

  createAssessment(): void {
    if (this.form.valid) {
      const params = {
        company_id: this.company.id,
        text: this.form.get("text").value,
        puntuality: this.puntuality,
        attention: this.attention,
        satisfaction: this.satisfaction
      }
      this.userService.createAssessment(params).subscribe(
        _ => this.modalController.dismiss({created: true})
      );
    } else {
      this.translate.get('COMPANIES.INCOMPLETE_ASSESSMENT').subscribe(translation => {
        this.toastMessageService.showMessage(translation, 'danger');
      });
    }
  }

  cancel(): void {
    this.modalController.dismiss();
  }
}
