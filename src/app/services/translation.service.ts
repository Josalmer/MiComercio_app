import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  defaultLanguage = 'es';

  constructor(
    private translateService: TranslateService,
  ) { }

  public async init() {
    this.translateService.use(this.defaultLanguage);
  }
}
