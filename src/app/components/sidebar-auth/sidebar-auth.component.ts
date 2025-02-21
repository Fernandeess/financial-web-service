import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClassModule } from 'primeng/styleclass';
import { Sidebar } from 'primeng/sidebar';
import { TreeModule } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { Router, RouterOutlet } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AccountResponse } from '../../interfaces/account-response';
import { LoginResponse } from '../../interfaces/LoginResponse';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-sidebar-auth',
  standalone: true,
  imports: [
    ButtonModule,
    RippleModule,
    AvatarModule,
    StyleClassModule,
    TreeModule,
    MatSidenavModule,
    RouterOutlet,
  ],
  templateUrl: './sidebar-auth.component.html',
  styleUrl: './sidebar-auth.component.scss',
})
export class SidebarAuthComponent implements OnInit {
  visible: boolean = false;
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;
  items: TreeNode[] | undefined;
  hidePassword: boolean = false;
  accountList?: AccountResponse[] = [];
  accountSelected?: AccountResponse = undefined;
  loginResponse: LoginResponse | null = null;
  firstName: String = '';

  closeCallback(event: Event): void {
    this.sidebarRef.close(event);
  }
  toggleSidebar() {
    this.visible = !this.visible;
  }

  sidebarVisible: boolean = false;

  constructor(
    private router: Router,
    private http: HttpService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.getAccountList();
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
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
    var fullBalance = 0;
    this.accountList?.map((acc) => {
      fullBalance += acc.balance;
    });
    return `R$ ${fullBalance.toFixed(2)}`;
  }

  getBalanceVisibilityOff() {
    var balance = `R$ ${this.accountSelected?.balance?.toFixed(2)}`;
    return balance.replace(/./g, '-');
  }
  selectUser(acc: AccountResponse) {
    console.log('AccountSelected');
    this.accountSelected = acc;
  }
}
