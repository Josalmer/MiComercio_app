import { Component, OnInit, ViewChild } from '@angular/core';
import { Company } from 'src/app/models/company.model';
import { Router } from '@angular/router';
import { CompaniesService } from 'src/app/services/companies.service';
import { Address } from 'src/app/models/address.model';
import { UtilsService } from 'src/app/services/utils.service';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ToastMessageService } from 'src/app/services/toast-messages.service';
import { TranslateService } from '@ngx-translate/core';
import { CalendarEventsService } from 'src/app/services/calendar-events.service';

@Component({
  selector: 'app-companies',
  templateUrl: 'companies.page.html'
})
export class CompaniesPage implements OnInit {

  loaded = false;

  companies: Company[] = [];
  filteredCompanies: Company[] = [];

  showFilterModal: boolean = false;

  search = '';

  orderBy = 'default';

  companyTypes: string[];
  companyLocations: string[];

  bussinessType: string;
  selectedLocation: string;

  today = new Date().toISOString();
  startDate: Date;
  endDate: Date;
  eventsInDate: any[];

  @ViewChild("endDateField") endDateField: any;

  constructor(
    private companiesService: CompaniesService,
    private router: Router,
    private utils: UtilsService,
    private toastMessageService: ToastMessageService,
    private translate: TranslateService,
    private eventsService: CalendarEventsService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    forkJoin([
      this.companiesService.getCompanies(),
      this.companiesService.getTypes(),
      this.companiesService.getLocations()
    ]).pipe(
      finalize(() => this.loaded = true)
    ).subscribe(([companies, types, locations]) => {
      this.companies = companies.companies;
      this.filteredCompanies = this.companies;
      this.sortCompanies();
      this.companyTypes = types.types;
      this.companyLocations = locations;
    });
  }

  searchCompany(search: string): void {
    if (search !== this.search) {
      this.search = search;
      this.applyFilter();
    }
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
    this.bussinessType = undefined;
    this.selectedLocation = undefined;
    this.startDate = undefined;
    this.endDate = undefined;
    this.orderBy = 'default';
  }

  applyFilter(): void {
    if (this.startDate && !this.endDate) {
      this.translate.get("COMPANIES.FILTERS_MODAL.MANDATORY_END_DATE").subscribe(
        translated => this.toastMessageService.showMessage(translated, 'danger')
      );
    } else {
      this.filteredCompanies = this.search === '' ? this.companies : this.companies.filter(company => this.discardName(company.name, this.search));
      this.filteredCompanies = this.bussinessType ? this.filteredCompanies.filter(company => company.type === this.bussinessType) : this.filteredCompanies;
      this.filteredCompanies = this.selectedLocation ? this.filteredCompanies.filter(company => company.address?.town.toUpperCase() === this.selectedLocation.toUpperCase()) : this.filteredCompanies;
      if (this.startDate && this.endDate) {
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
        forkJoin(
          this.filteredCompanies.map(company => this.eventsService.getEvents(company.id, start, end))
        ).pipe(
          finalize(() => {
            this.eventsInDate.forEach((events, index) => this.filteredCompanies[index].withAppointmentInSelectedDate = events.events.length > 0)
            this.filteredCompanies = this.filteredCompanies.filter(company => company.withAppointmentInSelectedDate);
            this.sortCompanies();
          })
        ).subscribe(
          events => this.eventsInDate = events
        );
      } else {
        this.sortCompanies();
      }
    }
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

  checkEndDate(): void {
    if (!this.endDate || this.startDate > this.endDate) {
      this.endDate = undefined;
      setTimeout(() => {
        this.endDateField.open();
      },200)
    }
  }
}
