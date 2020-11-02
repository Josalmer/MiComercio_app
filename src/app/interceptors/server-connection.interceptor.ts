import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ToastMessageService } from '../services/toast-messages.service';

@Injectable()
export class ServerConnectionInterceptor implements HttpInterceptor {

    constructor(
        private toastMessageService: ToastMessageService,
        private translate: TranslateService
        ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return next.handle(req).pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.status === 0) {
            this.translate.get("COMMON.NO_RESPONSE_FROM_SERVER").subscribe(
              translated => this.toastMessageService.showMessage(translated, 'danger')
            );
        }

          return throwError( err );

        })
      );
    }
}
