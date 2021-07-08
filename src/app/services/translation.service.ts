import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  readonly STORAGE_KEY = 'language';

  selectedLanguage: string;

  defaultLanguage: string = 'es';

  constructor(
    private storage: Storage,
    private _translate: TranslateService,
  ) {}

  public async init() {
    const language = await this.getLanguage();
    this.setLanguage(language ? language : this.defaultLanguage);
  }

  public setLanguage(language) {
    this.saveLanguage(language);
    this.selectedLanguage = language;
    this._translate.use(language);
  }

  public async getLanguage() {
    return await this.storage.get(this.STORAGE_KEY);
  }

  public async getCurrentLanguage() {
    return this._translate.currentLang;
  }

  private saveLanguage(language) {
    this.storage.set(this.STORAGE_KEY, this.validLanguage(language) ? language : this.defaultLanguage);
  }

  private validLanguage(language) {
    return /(en|es)/gi.test(language);
  }

  clearLanguage() {
    this.storage.remove(this.STORAGE_KEY);
    this.defaultLanguage = undefined;
  }
}
