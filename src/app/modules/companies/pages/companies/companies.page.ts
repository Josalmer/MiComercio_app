import { Component, OnInit } from '@angular/core';
import { Company } from 'src/app/models/company.model';
import { Router } from '@angular/router';
import { CompaniesService } from 'src/app/services/companies.service';
import { Address } from 'src/app/models/address.model';
import { UtilsService } from 'src/app/services/utils.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-companies',
  templateUrl: 'companies.page.html'
})
export class CompaniesPage implements OnInit {

  companies: Company[] = [];
  filteredCompanies: Company[] = [];

  showFilterModal: boolean = false;
  filterForm: FormGroup;
  orderBy = 'default';

  constructor(
    private companiesService: CompaniesService,
    private router: Router,
    private utils: UtilsService,
    public fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadCompanies();
    this.initFilterForm();
  }

  loadCompanies(): void {
    this.companiesService.getCompanies().subscribe(
      response => {
        this.companies = response.companies;
        this.filteredCompanies = this.companies;
        this.sortCompanies();
      }
    );
  }

  initFilterForm(): void {
    this.filterForm = this.fb.group({
      bussinessType: [''],
      location: [''],
      startDate: [''],
      endDate: ['']
    });
  }

  searchCompany(search: string): void {
    this.filteredCompanies = search === '' ? this.companies : this.companies.filter(company => this.discardName(company.name, search));
    this.sortCompanies();
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

  resetFilters(): void {
    // reset form
    this.orderBy = 'default';
    this.sortCompanies();
  }

  applyFilter(): void {
    // check form
    this.sortCompanies();
  }

  sortCompanies(): void {
    this.filteredCompanies = this.filteredCompanies.sort((a, b) => {
      switch (this.orderBy) {
        case 'valoration':
          return b.averagePuntuation - a.averagePuntuation;
        case 'appointment':
          if (b.fistAvailableAppointment && a.fistAvailableAppointment) {
            return new Date(a.fistAvailableAppointment.start).getTime() - new Date(b.fistAvailableAppointment.start).getTime();
          } else if (a.fistAvailableAppointment && !b.fistAvailableAppointment) {
            return -1;
          } else if (!a.fistAvailableAppointment && b.fistAvailableAppointment) {
            return 1;
          } else {
            return 0;
          }
        case 'distance': // pending
        default:
      }
    })
    this.showFilterModal = false;
  }
}
