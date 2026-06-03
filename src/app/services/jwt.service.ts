import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  protected tokenStorageKey = 'authToken';

  getPayload<T>(): T | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    return jwtDecode<T>(token);
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.tokenStorageKey);

    if (!token) {
      this.removeToken();
      return null;
    }

    return token;
  }

  setToken(token: string) {
    localStorage.setItem(this.tokenStorageKey, token);
  }

  removeToken() {
    localStorage.removeItem(this.tokenStorageKey);
  }
}