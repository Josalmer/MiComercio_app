import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Company } from 'src/app/models/company.model';
import { CompaniesService } from 'src/app/services/companies.service';

@Component({
  selector: 'app-company-selector',
  templateUrl: './company-selector.component.html'
})
export class CompanySelectorComponent implements OnInit {
  @Output() selectCompany = new EventEmitter();
  managerCompanies: Company[];

  selection = 'all';

  constructor(
    private companiesService: CompaniesService
  ) { }

  ngOnInit() {
    this.companiesService.getManagerCompanies().subscribe(
      response => this.managerCompanies = response.companies
    );
  }

  toggleCompany(selectedCompany: string): void {
    this.selectCompany.emit(selectedCompany);
  }

  compareWith = (o1, o2) => {
    return o1 === o2;
  }
}
