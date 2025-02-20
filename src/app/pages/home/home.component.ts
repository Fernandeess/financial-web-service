import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ChartModule } from 'primeng/chart';
import { ChartData, ChartOptions } from 'chart.js';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { HttpService } from '../../services/http.service';
import { LoginResponse } from '../../interfaces/LoginResponse';
import { AccountResponse } from '../../interfaces/account-response';
import { CategoryExpense } from '../../interfaces/category-expense';
import { TransactionResponse } from '../../interfaces/transaction-response';
import { Page } from '../../interfaces/page';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { CardInfoComponent } from '../../components/card-info/card-info.component';
import { CategoryExpendingValuesComponent } from '../../components/category-expending-values/category-expending-values.component';
import { FormCreateTransactionComponent } from '../../components/form-create-transaction/form-create-transaction.component';
import { FormEditTransactionComponent } from '../../components/form-edit-transaction/form-edit-transaction.component';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Currency } from '../../enum/currency.enum';

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
    ChartModule,
    MenuModule,
    ButtonModule,
    DialogModule,
    FormEditTransactionComponent,
    TieredMenuModule,
  ],
})
export class HomeComponent implements OnInit {
  items: MenuItem[] | undefined;
  dataDailyExpense: ChartData = this.initializeChartData();
  optionsDailyExpense: ChartOptions = this.initializeChartOptions();

  dataByCategory: ChartData = this.initializeChartData();
  optionsByCategory: ChartOptions = this.initializeChartOptions();

  displayedColumns: string[] = [
    'value',
    'valueInBaseCurrency',
    'description',
    'type',
    'date',
    'category',
  ];

  first = 0;
  rows = 10;
  createTransactionDialog = false;
  showDialogEditTransaction: boolean = false;
  rangeDates: Date[] = this.initializeDateRange();
  loginResponse: LoginResponse | null = null;
  accountSelected?: AccountResponse;
  categoryExpenses: CategoryExpense[] = [];
  pageResponse: Page<TransactionResponse> = this.initializePageResponse();
  expenseValueOverSelectedPeriod = 0;
  incomeValueOverSelectedPeriod = 0;
  firstName = '';
  pageSize = 10;
  selectedTransaction?: TransactionResponse = undefined;

  constructor(
    private readonly http: HttpService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUserSession();
    this.loadInitialData();
  }

  private initializeChartData(): ChartData {
    return {
      labels: [],
      datasets: [
        {
          label: 'Valor',
          data: [],
          backgroundColor: [],
          borderColor: [],
          borderWidth: 1,
        },
      ],
    };
  }

  private initializeChartOptions(): ChartOptions {
    return {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: undefined,
          },
        },
      },
      scales: {
        x: {
          ticks: { color: undefined },
          grid: { color: undefined },
        },
        y: {
          beginAtZero: true,
          ticks: { color: undefined },
          grid: { color: undefined },
        },
      },
    };
  }

  private initializeDateRange(): Date[] {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return [startDate, endDate];
  }

  private initializePageResponse(): Page<TransactionResponse> {
    return {
      content: [],
      page: { totalElements: 10, totalPages: 0, size: 10, number: 0 },
    };
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

  private loadInitialData(): void {
    this.getTransactions(0, this.pageSize);
    this.getTransactionsGroupedByDate();
  }

  private refreshDashboardData(): void {
    this.getSpendingByCategory();
    this.getTransactions(0, this.pageSize);
    this.calculateTotalExpenses();
    this.calculateTotalIncome();
    this.getTransactionsGroupedByDate();
  }

  getTransactionsGroupedByDate(): void {
    this.http
      .get<{ value: number; label: Date }[]>(
        `accounts/${
          this.accountSelected?.id
        }/dashboard/expense-per-day?start=${this.formatDate(
          this.rangeDates[0]
        )}&end=${this.formatDate(this.rangeDates[1])}`
      )
      .subscribe({
        next: (response) => {
          this.dataDailyExpense = {
            ...this.dataDailyExpense,
            labels: response.map((v) => {
              var date = new Date(v.label + 'T00:00:00').toLocaleDateString(
                'pt-BR'
              );
              var year = new Date().getFullYear();
              var replaceVal = `/${year}`;
              return date.toString().replace(replaceVal, '');
            }),
            datasets: [
              {
                ...this.dataDailyExpense.datasets[0],
                data: response.map((v) => {
                  return v.value;
                }),
                backgroundColor: ['#3B82F6'],
              },
            ],
          };
        },
        error: (err) => console.error('Erro ao buscar transações:', err),
      });
  }

  getTransactions(pageIndex: number, pageSize: number): void {
    this.http
      .get<Page<TransactionResponse>>(
        `transactions?start=${this.formatDate(
          this.rangeDates[0]
        )}&end=${this.formatDate(this.rangeDates[1])}&accountId=${
          this.accountSelected?.id
        }&page=${pageIndex}&size=${pageSize}`
      )
      .subscribe({
        next: (value) => (this.pageResponse = value),
        error: (err) => console.error('Erro ao buscar transações:', err),
      });
  }

  onPageChange(event: any): void {
    if (!event || event.rows === 0) return;
    const pageIndex = Math.floor(event.first / event.rows);
    this.getTransactions(pageIndex, event.rows);
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
        next: (categories) => {
          this.dataByCategory = {
            labels: categories.map((v) => v.name),
            datasets: [
              {
                label: 'Gastos por Categoria',
                data: categories.map((v) => v.value),
                backgroundColor: [
                  '#FF6384', // Cor para cada fatia do gráfico
                  '#36A2EB',
                  '#FFCE56',
                  '#4BC0C0',
                  '#9966FF',
                  '#FF9F40',
                ],
                hoverBackgroundColor: [
                  '#FF6384CC',
                  '#36A2EBCC',
                  '#FFCE56CC',
                  '#4BC0C0CC',
                  '#9966FFCC',
                  '#FF9F40CC',
                ],
              },
            ],
          };
        },
        error: (err) =>
          console.error('Erro ao buscar gastos por categoria:', err),
      });
  }

  calculateTotalExpenses(): void {
    if (!this.accountSelected) return;

    this.http
      .get<number>(
        `accounts/${this.accountSelected.id}/dashboard?start=${this.formatDate(
          this.rangeDates[0]
        )}&end=${this.formatDate(this.rangeDates[1])}&type=EXPENSE`
      )
      .subscribe({
        next: (total) => (this.expenseValueOverSelectedPeriod = total),
        error: (err) => console.error('Erro ao calcular despesas totais:', err),
      });
  }
  calculateTotalIncome(): void {
    if (!this.accountSelected) return;

    this.http
      .get<number>(
        `accounts/${this.accountSelected.id}/dashboard?start=${this.formatDate(
          this.rangeDates[0]
        )}&end=${this.formatDate(this.rangeDates[1])}&type=INCOME`
      )
      .subscribe({
        next: (total) => (this.incomeValueOverSelectedPeriod = total),
        error: (err) => console.error('Erro ao calcular lucros totais:', err),
      });
  }

  onDateSelect(): void {
    this.getTransactions(0, this.pageSize);
    this.refreshDashboardData();
  }

  private formatDate(date: Date): string {
    return date.toISOString().replace('Z', '');
  }

  showDialogCreateTransaction(): void {
    this.createTransactionDialog = true;
  }

  closeDialogCreate(): void {
    this.createTransactionDialog = false;
    this.refreshDashboardData();
  }
  closeDialogEdit(): void {
    this.showDialogEditTransaction = false;
  }
  openDialogEdit(transaction: TransactionResponse) {
    this.showDialogEditTransaction = true;

    this.selectedTransaction = transaction;

    this.cdr.detectChanges();
  }

  removeTransaction(transaction: TransactionResponse) {
    this.http.delete(`transactions/${transaction.id}`).subscribe({
      next: () => {},
      error: (err) => console.error('Erro ao deletar transaction:', err),
      complete: () => {
        this.refreshDashboardData();
      },
    });
  }

  getItems(transaction: TransactionResponse): MenuItem[] {
    return [
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => this.openDialogEdit(transaction),
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.removeTransaction(transaction),
      },
    ];
  }
}
