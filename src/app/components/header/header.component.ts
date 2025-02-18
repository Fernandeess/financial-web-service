import { AccountResponse } from './../../interfaces/account-response';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LoginResponse } from '../../interfaces/LoginResponse';

import { HttpService } from '../../services/http.service';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, ButtonModule, MenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  items: MenuItem[] | undefined;
  updateVisibility() {
    this.hidePassword = !this.hidePassword;
    this.getAccountList();
  }
  hidePassword: boolean = false;
  accountList?: AccountResponse[] = [];
  accountSelected?: AccountResponse = undefined;
  loginResponse: LoginResponse | null = null;
  firstName: String = '';
  constructor(public authService: AuthService, private http: HttpService) {}
  ngOnInit(): void {
    this.items = [
      { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.logout() },
    ];
    this.getAccountList();
  }

  logout(): void {
    this.authService.logout();
  }

  getAccountList() {
    if (this.loginResponse == null) {
      if (this.authService.isAuthenticated()) {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
          this.loginResponse = JSON.parse(storedUser) as LoginResponse;
          this.firstName = this.loginResponse?.user?.name?.split(' ')[0] || '';
        }

        this.getAccountList();
      }
    }
    this.http
      .get<AccountResponse[]>(
        `accounts?email=${this.loginResponse?.user.email}`
      )
      .subscribe({
        next: (value) => {
          this.accountList = value;
          this.accountSelected = value[0];
        },
      });
  }

  getBalance() {
    return `R$ ${this.accountSelected?.balance?.toFixed(2)}`;
  }

  getBalanceVisibilityOff() {
    var balance = `R$ ${this.accountSelected?.balance?.toFixed(2)}`;
    return balance.replace(/./g, '-');
  }
}
