import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HoursService {

  constructor( private http: HttpClient ) { }

  deleteHour(id: string): Observable<any> {
    return this.http.delete('company_hours/' + id);
  }

  createHour(params: {}): Observable<any> {
    return this.http.post('company_hours', params);
  }
}
