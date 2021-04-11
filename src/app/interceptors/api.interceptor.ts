import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TranslationService } from 'src/app/services/translation.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(private translationService: TranslationService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      setHeaders: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        "language": this.translationService.getSavedLanguage()
      },
      url: `${environment.API_URL}/${req.url}`
    });
    return next.handle(req);
  }
}
