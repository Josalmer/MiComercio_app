import { Component, OnInit } from '@angular/core';
import { Company } from 'src/app/models/company.model';
import { CompaniesService } from 'src/app/services/companies.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-company-management',
  templateUrl: 'company-management.page.html'
})
export class CompanyManagementPage implements OnInit {

  companyId: string;
  company: Company;
  selectedDate: Date = new Date();

  view = 'edit';

  constructor(
    private companiesService: CompaniesService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.companyId = params['id'];
      this.route.queryParams.subscribe(queryParams => {
        if (queryParams['date']) {
          this.selectedDate = new Date(Date.parse(queryParams['date']));
        }
        this.loadCompany();
      });
    });
  }

  loadCompany(): void {
    this.companiesService.getCompany(this.companyId).subscribe(
      response => {
        this.company = response;
      }
    );
  }

  toggleView(selection: string): void {
    if (this.view !== selection) {
      this.loadCompany();
      this.view = selection;
    }
  }

  onInputFileChange(event) {
    event.target.getInputElement().then(el => {
      if (el.files && el.files[0]) {
        const image = el.files[0];
        let reader = new FileReader();
        reader.onload = () => this.updateLogo(reader.result);
        reader.readAsDataURL(image);
      }
    });
  }

  updateLogo(base64Image) {
    const edited_logo_object = { logo: base64Image };
    this.companiesService.updateCompanyImage(this.companyId, edited_logo_object).subscribe(
      response => this.company  = response
    );
  }
}
