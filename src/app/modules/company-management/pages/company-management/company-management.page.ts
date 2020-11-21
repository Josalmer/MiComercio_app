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

  view = 'gestion';

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
}
