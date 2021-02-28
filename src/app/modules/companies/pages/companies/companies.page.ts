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
import { Plugins } from '@capacitor/core';
import { environment } from 'src/environments/environment';

const { Geolocation } = Plugins;

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

  orderBy: string;

  companyTypes: any[];
  companyLocations: string[];

  bussinessType: string;
  selectedLocation: string;

  today = new Date().toISOString();
  startDate: Date;
  endDate: Date;
  maxDate: any;
  eventsInDate: any[];

  currentPosition: any;
  DISTANCES = ['1', '2', '3', '5', '10', '20', 'ထ'];
  sliderPosition: number;
  distanceLimit: string;

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
    this.getCurrentPosition();
    this.initalizeDistanceSlider();
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
      console.log(this.companyTypes)
      this.companyLocations = locations;
    });
  }

  async getCurrentPosition() {
    this.currentPosition = await Geolocation.getCurrentPosition();
    if (environment.debug) {
      this.toastMessageService.showMessage(`Current Position: lat=${this.currentPosition.coords.latitude}, long=${this.currentPosition.coords.longitude}`, 'secondary');
    }
  }

  initalizeDistanceSlider(): void {
    this.sliderPosition = this.DISTANCES.length - 1;
    this.distanceLimit = this.DISTANCES[this.sliderPosition];
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

  toggleOrderBy(orderBy: string): void {
    if (orderBy === this.orderBy) {
      this.orderBy = null;
    } else {
      this.orderBy = orderBy;
    }
    this.sortCompanies();
  }

  resetFilters(): void {
    this.bussinessType = undefined;
    this.selectedLocation = undefined;
    this.startDate = undefined;
    this.endDate = undefined;
    this.initalizeDistanceSlider();
    this.orderBy = undefined;
  }

  applyFilter(): void {
    if (this.startDate && !this.endDate) {
      this.translate.get("COMPANIES.FILTERS_MODAL.MANDATORY_END_DATE").subscribe(
        translated => this.toastMessageService.showMessage(translated, 'danger')
      );
    } else {
      this.filteredCompanies = this.search === '' ? this.companies : this.companies.filter(company => this.discardName(company.name, this.search));
      this.filteredCompanies = this.bussinessType ? this.filteredCompanies.filter(company => company.type === this.bussinessType) : this.filteredCompanies;
      this.filteredCompanies = this.distanceLimit !== this.DISTANCES[this.DISTANCES.length - 1] ? this.filteredCompanies.filter(company => this.inRange(company)) : this.filteredCompanies;
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
        case 'distance':
          if (!this.currentPosition) {
            this.translate.get("COMPANIES.FILTERS_MODAL.LOCATION_NEEDED").subscribe(
              translated => this.toastMessageService.showMessage(translated, 'danger')
            );
            this.orderBy = undefined;
          } else {
            if ((b.address.latitude && b.address.longitude) && (a.address.latitude && a.address.longitude)) {
              return this.calculateDistance(a.address.latitude, a.address.longitude) - this.calculateDistance(b.address.latitude, b.address.longitude)
            } else if ((b.address.latitude && b.address.longitude) && (!a.address.latitude || !a.address.longitude)) {
              return 1;
            } else if ((!b.address.latitude || !b.address.longitude) && (a.address.latitude && a.address.longitude)) {
              return -1;
            } else {
              return 0;
            }
          }
        default:
      }
    })
    this.showFilterModal = false;
  }

  checkEndDate(): void {
    if (this.startDate && (!this.endDate || this.endDate < this.startDate)) {
      this.endDate = undefined;
      this.maxDate = new Date(this.startDate);
      this.maxDate.setDate(this.maxDate.getDate() + 5);
      this.maxDate = this.maxDate.toISOString();
      setTimeout(() => {
        this.endDateField.open();
      },200)
    }
  }

  calculateDistance(lat1, lon1): number { // Haversine formula, Fórmula del semiverseno
    let lat2  = this.currentPosition.coords.latitude;
    let lon2 = this.currentPosition.coords.longitude;

    const r: number = 6371;
    const dlat = (lat2 - lat1) * Math.PI / 180;
    const dlon = (lon2 - lon1) * Math.PI /180;
    lat1 = lat1 * Math.PI /180;
    lat2 = lat2 * Math.PI /180;
    const a = Math.sin(dlat/2) * Math.sin(dlat/2) +
              Math.sin(dlon/2) * Math.sin(dlon/2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = r * c;
    return distance;
  }

  updateDistanceLimit( value: string ) {
    this.distanceLimit = value;
  }

  watchSlider() {
    this.updateDistanceLimit(this.DISTANCES[this.sliderPosition]);
  }

  sliderClicked(): void {
    if (!this.currentPosition) {
      this.translate.get("COMPANIES.FILTERS_MODAL.LOCATION_NEEDED_FILTER").subscribe(
        translated => this.toastMessageService.showMessage(translated, 'danger')
      );
    }
  }

  inRange(company: Company): boolean {
    if (company.address.latitude && company.address.longitude) {
      return this.calculateDistance(company.address.latitude, company.address.longitude) < parseFloat(this.distanceLimit);
    } else { 
      return false;
    }
  }
}
