import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, distinctUntilChanged, map, of, ReplaySubject, tap } from 'rxjs';
import { JwtService } from './jwt.service';
import { User } from '../entities/user.entity';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  protected http = inject(HttpClient);
  protected jwtSrv = inject(JwtService);
  protected router = inject(Router);

  protected _currentUser$ = new ReplaySubject<User | null>(1);
  currentUser$ = this._currentUser$.asObservable();

  constructor() {
    // emit either the user decoded from a stored token *or* null. this
    // guarantees `currentUser$` (and therefore `isAuthenticated$`) will
    // always emit once, allowing guards to resolve even when nobody is
    // logged in.
    const user = this.jwtSrv.getPayload<User>();
    if (user) {
      this._currentUser$.next(user);
    } else {
      this._currentUser$.next(null);
    }
  }

    private apiUrl = 'https://localhost:7193/api/user';


  isAuthenticated$ = this.currentUser$
                      .pipe(
                        map(user => !!user),
                        distinctUntilChanged()
                      );

  login(Email: string, Password: string) {
  return this.http.post<any>(`${this.apiUrl}/login`, { Email, Password }).pipe(
    tap(res => console.log('LOGIN RESPONSE', res)),
    tap(res => this.jwtSrv.setToken(res.token)),
    tap(res => this._currentUser$.next(res.user)),
    map(res => res.user)
  );
}

  register(Nome: string, Cognome: string, Email: string, Password: string) {
  return this.http.post<any>(`${this.apiUrl}/register`, { Nome, Cognome, Email, Password });
}

  /*refresh() {
    const authTokens = this.jwtSrv.getToken();
    if (!authTokens) {
      throw new Error('Missing refresh token');
    }
    return this.http.post<{token: string}>('/api/refresh', {refreshToken: ""})
      .pipe(
        tap(res => this.jwtSrv.setToken(res.token)),
        tap(_ => {
          const user = this.jwtSrv.getPayload<User>();
          this._currentUser$.next(user);
        })
      );
  }*/

  fetchUser() {
    return this.http.get<User>('/api/users/me')
      .pipe(
        catchError(_ => {
          return of(null);
        }),
        tap(user => this._currentUser$.next(user))
      );
  }

  /**
   * Extracts the user's role from the JWT payload (or null if none).
   * This is a thin wrapper around the JwtService so guards can remain
   * decoupled from the implementation details of token parsing.
   */
  getRole(): string | null {
    const payload: any = this.jwtSrv.getPayload();
    if (!payload) {
      return null;
    }
    return payload.role || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
  }

  logout() {
    this.jwtSrv.removeToken();
    this._currentUser$.next(null);
    this.router.navigate(['/login']);
  }

}
