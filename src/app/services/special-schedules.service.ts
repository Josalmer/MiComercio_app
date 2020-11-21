import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpecialSchedulesService {

  constructor( private http: HttpClient ) { }

  deleteSchedule(id: string): Observable<any> {
    return this.http.delete('special_schedules/' + id);
  }

  createSchedule(params: {}): Observable<any> {
    return this.http.post('special_schedules', params);
  }
}
