import { TransactionResponse } from './../../interfaces/transaction-response';
import { Page } from './../../interfaces/page';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginResponse } from '../../interfaces/LoginResponse';
import { CardInfoComponent } from '../../components/card-info/card-info.component';
import { TableModule } from 'primeng/table';
import { HttpService } from '../../services/http.service';
import { CommonModule, DatePipe } from '@angular/common';
import { AccountResponse } from '../../interfaces/account-response';
import { CategoryExpense } from '../../interfaces/category-expense';
import { CategoryExpendingValuesComponent } from '../../components/category-expending-values/category-expending-values.component';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { FormCreateTransactionComponent } from '../../components/form-create-transaction/form-create-transaction.component';

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [DatePipe],
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule,
    FloatLabelModule,

    CardInfoComponent,
    CategoryExpendingValuesComponent,
    FormCreateTransactionComponent,
    TableModule,
    PaginatorModule,
  ],
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = [
    'value',
    'valueInBaseCurrency',
    'description',
    'type',
    'date',
    'category',
  ];

  first: number = 0;
  rows: number = 10;

  createTransactionDialog: boolean = false;
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

  getTransactions(pageIndex: number, pageSize: number) {
    this.http
      .get<Page<TransactionResponse>>(
        `transactions?start=${this.rangeDates[0]
          .toISOString()
          .replace('Z', '')}&end=${this.formatDate(
          this.rangeDates[1]
        )}&accountId=${
          this.accountSelected?.id
        }&page=${pageIndex}&size=${pageSize}`
      )
      .subscribe({
        next: (value) => {
          this.pageResponse = value;
          console.log('Resposta da API:', value);
          console.log('Resposta pageResponse:', this.pageResponse);
        },
        error: (err) => {
          console.error('Erro ao buscar transações:', err);
        },
      });
  }

  onPageChange(event: any): void {
    if (!event || event.rows === 0) return;
    const pageIndex = Math.floor(event.first / event.rows);
    const pageSize = event.rows;
    this.pageResponse.page.number = pageIndex;
    this.pageResponse.page.size = pageSize;
    this.getTransactions(pageIndex, pageSize);
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

  showDialogCreateTransaction() {
    this.createTransactionDialog = true;
  }

  closeDialog() {
    this.createTransactionDialog = false;
  }
}
