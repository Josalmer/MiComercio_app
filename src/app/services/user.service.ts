import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, filter } from 'rxjs/operators';
import { SessionService } from '../modules/login/services/session.service';
import { Assessment } from '../models/assessment.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private applicationUser = new BehaviorSubject<any>(undefined);

    constructor(
        private http: HttpClient,
        private sessionService: SessionService
        ) {
        if (this.sessionService.isUserLogged()) { this.requestUser(); }
    }

    private getUser(): Observable<any> {
        return this.http.get('user');
    }

    deleteApplicationUser(): void {
        this.applicationUser.next(undefined);
    }

    requestUser() {
        this.getUser().subscribe(response => this.applicationUser.next(response));
    }

    updateUser(params) {
        return this.http.patch('user', params).pipe(
            tap(response => this.applicationUser.next(response))
        );
    }

    updatePaymentPreferences(params) {
        return this.http.patch('update_manager_preferences', params).pipe(
            tap(response => this.applicationUser.next(response))
        );
    }

    updateNotificationPreferences(params) {
        return this.http.patch('update_notification_preferences', params).pipe(
            tap(response => this.applicationUser.next(response))
        );
    }

    getApplicationUser(): Observable<any> {
        return this.applicationUser.asObservable().pipe( filter(x => x) );
    }

    getUserAssessments(): Observable<any> {
        return this.http.get('assessments');
    }

    createAssessment(companyId: string, params: {}): Observable<any> {
        return this.http.patch(`assessments/${companyId}`, params);
    }
}
