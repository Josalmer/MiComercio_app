import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CompaniesService } from 'src/app/services/companies.service';
import { ToastMessageService } from 'src/app/services/toast-messages.service';

@Component({
  selector: 'app-new-company-form',
  templateUrl: 'new-company-form.page.html'
})
export class NewCompanyFormPage implements OnInit {
  @Output() backFromCreatingCompany = new EventEmitter();

  name: string;
  type: any;
  image: any;

  types: any;

  constructor(
    private companiesService: CompaniesService,
    private toastMessageService: ToastMessageService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.companiesService.getTypes().subscribe(
      response => this.types = response.types
    );
  }

  createCompany(): void {
    if (this.name === undefined || this.type === undefined) {
      this.translate.get("COMPANIES.NAME_AND_TYPE_MANDATORY").subscribe(
        translated => this.toastMessageService.showMessage(translated, 'danger')
      );
      return;
    }
    const created_company_object = {
      name: this.name,
      company_type: this.type.id,
      logo: this.image
    };
    this.companiesService.createCompany({ created_company_object }).subscribe(
      response => this.backFromCreatingCompany.emit(),
      error => {
        if (error.error.name !== undefined) {
          this.translate.get("COMPANIES.NAME_USED").subscribe(
            translated => this.toastMessageService.showMessage(translated, 'danger')
          );
        } else {
          alert(error.error);
        }
      }
    );
  }

  onInputFileChange(event) {
    event.target.getInputElement().then(el => {
      if (el.files && el.files[0]) {
        const image = el.files[0];
        let reader = new FileReader();
        reader.onload = () => this.image = reader.result;
        reader.readAsDataURL(image);
      }
    });
  }
}
