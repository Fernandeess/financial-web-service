import { HttpService } from './http.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { LoginResponse } from '../interfaces/LoginResponse';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey: String = '';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.isAuthenticated()
  );
  constructor(private http: HttpService, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    var response = this.http.post<LoginResponse>('auth/login', {
      email,
      password,
    });

    return response;
  }

  logout(): void {
    sessionStorage.removeItem('user');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return sessionStorage.getItem('user') !== null;
  }

  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  setAuthenticated(): void {
    this.isAuthenticatedSubject.next(true);
  }
}
