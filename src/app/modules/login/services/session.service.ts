import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  authToken: string;
  authStorageKey = 'auth_token';
  loginMethod: string;
  loginStorageKey = 'login_method';

  constructor(
    private storage: Storage
  ) { }

  async getAuthToken(): Promise<string> {
    if (!this.authToken) {
      await this.storage.get(this.authStorageKey).then(authToken => {
        this.authToken = authToken;
      });
    }
    return this.authToken;
  }

  async setAuthToken(authToken: string) {
    this.storage.set(this.authStorageKey, authToken);
    this.authToken = authToken;
  }

  async clearAuthToken() {
    this.storage.remove(this.authStorageKey);
    this.authToken = undefined;
  }

  isUserLogged(): boolean {
    return !!this.authToken;
  }

  async getLoginMethod(): Promise<string> {
    if (!this.loginMethod) {
      await this.storage.get(this.loginStorageKey).then(loginMethod => {
        this.loginMethod = loginMethod;
      });
    }
    return this.loginMethod;
  }

  setLoginMethod(loginMethod: string) {
    this.storage.set(this.loginStorageKey, loginMethod);
    this.loginMethod = loginMethod;
  }

  clearLoginMethod() {
    this.storage.remove(this.loginStorageKey);
    this.loginMethod = undefined;
  }

  loggedWithGoogle(): boolean {
    return this.loginMethod === 'GOOGLE';
  }
}
