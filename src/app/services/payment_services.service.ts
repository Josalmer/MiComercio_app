import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentServicesService {

  constructor( private http: HttpClient ) { }

  boostCompany(params: {}): Observable<any> {
    return this.http.patch('boost_company/', { params });
  }

  createOffer(params: {}): Observable<any> {
    return this.http.patch('create_offer/', { params });
  }

  getOffers(): Observable<any> {
    return this.http.get('offers');
  }
}
