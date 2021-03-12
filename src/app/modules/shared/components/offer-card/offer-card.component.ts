import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Offer } from 'src/app/models/offer.model';

@Component({
  selector: 'app-offer-card',
  templateUrl: './offer-card.component.html'
})
export class OfferCardComponent {
  @Input() offer: Offer;
  @Input() userView: boolean = false;

  constructor(
    private router: Router
  ) { }

  navigate(): void {
    this.router.navigateByUrl('/company/' + this.offer.companyId);
  }
}
