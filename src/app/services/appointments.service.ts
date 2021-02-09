import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {

  constructor( private http: HttpClient ) { }

  createAppointment(params = {}): Observable<any> {
    return this.http.post('appointments', params);
  }

  getAppointments(): Observable<any> {
    return this.http.get('appointments');
  }

  getCurrentUserAppointmentsForCompany(companyId: string): Observable<any> {
    return this.http.get('user_appointments_for_company/' + companyId);
  }

  getCompanyAppointmentsByDate(companyId: string, date = new Date()): Observable<any> {
    const params = {
      date: date.toISOString()
    };
    return this.http.get('company_appointments/' + companyId, { params });
  }

  cancelAppointment(appointmentId: string): Observable<any> {
    return this.http.patch('cancel_appointment/' + appointmentId, {});
  }

  exportAppointments(): Observable<any> {
    return this.http.patch('export_appointments/', {});
  }
}
