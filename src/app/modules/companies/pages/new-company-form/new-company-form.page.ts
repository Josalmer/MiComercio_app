import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CompaniesService } from 'src/app/services/companies.service';
import { ToastMessageService } from 'src/app/services/toast-messages.service';
import { LoadingController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-company-form',
  templateUrl: 'new-company-form.page.html'
})
export class NewCompanyFormPage implements OnInit {
  name: string;
  type: any;
  image: any;

  types: any;

  loadingSpinner: any;

  constructor(
    private companiesService: CompaniesService,
    private toastMessageService: ToastMessageService,
    private translate: TranslateService,
    public loadingController: LoadingController,
    private router: Router
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
    this.presentLoading();
    this.companiesService.createCompany({ created_company_object }).pipe(
      finalize( () => this.loadingSpinner.dismiss() )
    ).subscribe(
      response => this.router.navigateByUrl(''),
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

  async presentLoading() {
    this.loadingSpinner = await this.loadingController.create({
      message: 'Cargando imagen...',
      showBackdrop: false
    });
    await this.loadingSpinner.present();
  }
}
