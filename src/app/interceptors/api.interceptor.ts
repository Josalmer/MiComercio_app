import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(private _translate: TranslateService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let lang = this._translate.currentLang || 'es';
    req = req.clone({
      setHeaders: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        "language": lang
      },
      url: `${environment.API_URL}/${req.url}`
    });
    return next.handle(req);
  }
}
