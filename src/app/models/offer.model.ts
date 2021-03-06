export class Offer {
  id: string;
  companyId: string;
  companyName: string;
  text: string;
  discount: number;
  validity: Date;

  constructor(offer) {
    Object.assign(this, offer);
  }
}
