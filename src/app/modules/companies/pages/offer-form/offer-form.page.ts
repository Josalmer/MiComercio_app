import { Component, OnInit } from '@angular/core';
import { Offer } from 'src/app/models/offer.model';
import { PaymentServicesService } from 'src/app/services/payment_services.service';

@Component({
  selector: 'app-offer-form',
  templateUrl: 'offer-form.page.html'
})
export class OfferFormPage implements OnInit {
  offers: Offer[];
  filteredOffers: Offer[];
  selectedCompanyId: string;

  constructor(
    private paymentServices: PaymentServicesService
  ) { }

  ngOnInit(): void {
    this.paymentServices.getOffers().subscribe(
      response => {
        this.offers = response.offers;
        this.filteredOffers = this.offers;
      }
    )
  }

  filterCompanies(companySelected: string): void {
    this.selectedCompanyId = companySelected;
    if (this.selectedCompanyId !== 'all') {
      this.filteredOffers = this.offers.filter(x => x.companyId === this.selectedCompanyId);
    } else {
      this.filteredOffers = this.offers;
    }
  }
}
