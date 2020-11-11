import { Component, OnInit } from '@angular/core';
import { Company } from 'src/app/models/company.model';
import { CompaniesService } from 'src/app/services/companies.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-company',
  templateUrl: 'company.page.html'
})
export class CompanyPage implements OnInit {

  companyId: string;
  company: Company;

  constructor(
    private companiesService: CompaniesService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.companyId = params['id'];
      this.loadCompany();
    });
  }

  loadCompany(event ?: any): void {
    this.companiesService.getCompany(this.companyId).subscribe(
      response => {
        this.company = response;
        if (event) { event.target.complete(); }
      }
    );
  }

  refreshData(event): void {
    this.loadCompany(event);
  }
}
