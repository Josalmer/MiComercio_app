import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {

  constructor( private http: HttpClient ) { }

  getCategories(): Observable<any> {
    return this.http.get('categories');
  }

  getTypes(): Observable<any> {
    return this.http.get('types');
  }

  getLocations(): Observable<any> {
    return this.http.get('locations');
  }

  createCompany(params: any): Observable<any> {
    return this.http.post('companies', params);
  }

  getCompanies(): Observable<any> {
    return this.http.get('companies');
  }

  getCompany(id: string): Observable<any> {
    return this.http.get('companies/' + id);
  }

  getManagerCompanies(): Observable<any> {
    return this.http.get('manager_companies');
  }

  updateCompany(id, params): Observable<any> {
    return this.http.patch('companies/' + id, params);
  }

  updateCompanyImage(id, params): Observable<any> {
    return this.http.patch('company_image/' + id, params);
  }
}
