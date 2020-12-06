import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarEventsService {

  constructor( private http: HttpClient ) { }

  getEvents(companyId: string, dayFrom: Date, dayTo: Date): Observable<any> {
    const params = {
      id: companyId,
      from: dayFrom.toISOString(),
      to: dayTo.toISOString()
    };
    return this.http.get('calendar_events/', { params });
  }
}
