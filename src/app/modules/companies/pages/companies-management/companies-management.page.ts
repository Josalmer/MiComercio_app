import { Component, OnInit } from '@angular/core';
import { CompaniesService } from 'src/app/services/companies.service';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';
import { Address } from 'src/app/models/address.model';
import { Company } from 'src/app/models/company.model';

@Component({
  selector: 'app-companies-management',
  templateUrl: 'companies-management.page.html'
})
export class CompaniesManagementPage implements OnInit {

  userCompanies: Company[] = [];

  constructor(
    private companiesService: CompaniesService,
    private router: Router,
    private utils: UtilsService
  ) {}

  ngOnInit(): void {
    this.loadUserCompanies();
  }

  loadUserCompanies(): void {
    this.companiesService.getManagerCompanies().subscribe(
      response => {
        this.userCompanies = response.companies;
      }
    );
  }

  goToCompany(id: string): void {
    this.router.navigateByUrl('/company_management/' + id);
  }

  printDirection(address: Address): string {
    return this.utils.printShortDirection(address);
  }
}
