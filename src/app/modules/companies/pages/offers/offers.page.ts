import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Offer } from 'src/app/models/offer.model';
import { PaymentServicesService } from 'src/app/services/payment_services.service';
import { NewOfferFormModal } from '../../components/new-offer-form/new-offer-form.modal';

@Component({
  selector: 'app-offers',
  templateUrl: 'offers.page.html'
})
export class OffersPage implements OnInit {
  offers: Offer[];
  filteredOffers: Offer[];
  selectedCompanyId: string = 'all';

  constructor(
    private paymentServices: PaymentServicesService,
    private modalController: ModalController
  ) { }

  ngOnInit(): void {
    this.loadOffers();
  }

  loadOffers(): void {
    this.paymentServices.getOffers().subscribe(
      response => {
        this.offers = response.offers;
        this.filterCompanies(this.selectedCompanyId);
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

  async newOfferForm() {
    const modal = await this.modalController.create({
      component: NewOfferFormModal
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if ( data ) {
      this.loadOffers();
    }
  }
}
