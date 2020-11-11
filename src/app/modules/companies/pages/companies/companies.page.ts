import { Component, OnInit } from '@angular/core';
import { Company } from 'src/app/models/company.model';
import { Router } from '@angular/router';
import { CompaniesService } from 'src/app/services/companies.service';
import { Address } from 'src/app/models/address.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-companies',
  templateUrl: 'companies.page.html'
})
export class CompaniesPage implements OnInit {

  companies: Company[] = [];
  filteredCompanies: Company[] = [];

  constructor(
    private companiesService: CompaniesService,
    private router: Router,
    private utils: UtilsService
  ) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.companiesService.getCompanies().subscribe(
      response => {
        this.companies = response.companies;
        this.filteredCompanies = this.companies;
      }
    );
  }

  searchCompany(search: string): void {
    this.filteredCompanies = search === '' ? this.companies : this.companies.filter(company => this.discardName(company.name, search));
  }

  discardName(name, nameSearched) {
    return name.toLowerCase().includes(nameSearched);
  }

  goToCompany(id: string): void {
    this.router.navigateByUrl('/company/' + id);
  }

  printDirection(direction: Address): string {
    return this.utils.printShortDirection(direction);
  }
}
