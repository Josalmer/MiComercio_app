import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {

  constructor( private http: HttpClient ) { }

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
}
