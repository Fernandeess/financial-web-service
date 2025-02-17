import { TransactionResponse } from './../../interfaces/transaction-response';
import { Page } from './../../interfaces/page';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginResponse } from '../../interfaces/LoginResponse';
import { CardInfoComponent } from '../../components/card-info/card-info.component';
import { MatTableModule } from '@angular/material/table';
import {
  MatPaginatorModule,
  PageEvent,
  MatPaginator,
} from '@angular/material/paginator';
import { HttpService } from '../../services/http.service';
import { CommonModule, DatePipe } from '@angular/common';
import { AccountResponse } from '../../interfaces/account-response';
import { CategoryExpense } from '../../interfaces/category-expense';
import { CategoryExpendingValuesComponent } from '../../components/category-expending-values/category-expending-values.component';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [DatePipe],
  imports: [
    CardInfoComponent,
    MatPaginatorModule,
    MatTableModule,
    CommonModule,
    FloatLabelModule,
    CategoryExpendingValuesComponent,
    CalendarModule,
    FormsModule,
  ],
})
export class HomeComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'value',
    'valueInBaseCurrency',
    'description',
    'type',
    'date',
    'category',
  ];

  now = new Date();
  startDate = new Date(this.now.getFullYear(), this.now.getMonth(), 1);
  endDate = new Date(this.now.getFullYear(), this.now.getMonth() + 1, 0);
  rangeDates: Date[] = [this.startDate, this.endDate];

  loginResponse: LoginResponse | null = null;
  accountSelected?: AccountResponse;
  categoryExpenses: CategoryExpense[] = [];
  pageResponse: Page<TransactionResponse> = {
    content: [],
    page: { totalElements: 10, totalPages: 0, size: 10, number: 0 },
  };
  expenseValueOverSelectedPeriod = 0;
  firstName = '';
  totalElements = 0;
  pageSize = 10;

  constructor(private http: HttpService) {}

  ngOnInit(): void {
    this.loadUserSession();
    this.getTransactions(0, this.pageSize);
  }

  private loadUserSession(): void {
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) return;

    this.loginResponse = JSON.parse(storedUser) as LoginResponse;
    this.firstName = this.loginResponse?.user?.name?.split(' ')[0] || '';

    if (this.loginResponse.user.accountList.length > 0) {
      this.accountSelected = this.loginResponse.user.accountList[0];
      this.refreshDashboardData();
    }
  }

  private refreshDashboardData(): void {
    this.getSpendingByCategory();
    this.calculateTotalExpenses();
  }

  getTransactions(pageIndex: number, pageSize: number): void {
    if (!this.accountSelected) return;

    this.http
      .get<Page<TransactionResponse>>(
        `transactions?startDate=${this.formatDate(this.rangeDates[0])}
        &endDate=${this.formatDate(this.rangeDates[1])}
        &accountId=${this.accountSelected.id}
        &page=${pageIndex}&size=${pageSize}`
      )
      .subscribe({
        next: (response) => (this.pageResponse = response),
        error: (err) => console.error('Erro ao buscar transações:', err),
      });
  }

  onPageChange(event: PageEvent): void {
    this.getTransactions(event.pageIndex, event.pageSize);
  }

  getSpendingByCategory(): void {
    if (!this.accountSelected) return;

    this.http
      .get<CategoryExpense[]>(
        `accounts/${
          this.accountSelected.id
        }/dashboard/category?start=${this.formatDate(
          this.rangeDates[0]
        )}&end=${this.formatDate(this.rangeDates[1])}`
      )
      .subscribe({
        next: (categories) => (this.categoryExpenses = categories),
        error: (err) =>
          console.error('Erro ao buscar gastos por categoria:', err),
      });
  }

  calculateTotalExpenses(): void {
    if (!this.accountSelected) return;

    this.http
      .get<number>(
        `accounts/${
          this.accountSelected.id
        }/dashboard/expense?start=${this.formatDate(
          this.rangeDates[0]
        )}&end=${this.formatDate(this.rangeDates[1])}`
      )
      .subscribe({
        next: (total) => (this.expenseValueOverSelectedPeriod = total),
        error: (err) => console.error('Erro ao calcular despesas totais:', err),
      });
  }

  onDateSelect(): void {
    this.getTransactions(0, this.pageSize);
    this.refreshDashboardData();
  }

  private formatDate(date: Date): string {
    return date.toISOString().replace('Z', '');
  }
}
