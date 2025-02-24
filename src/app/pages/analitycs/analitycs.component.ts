import { HttpService } from './../../services/http.service';
import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { ChartModule } from 'primeng/chart';
import { AccountResponse } from '../../interfaces/account-response';
import { CalendarModule } from 'primeng/calendar';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { CategoryExpense } from '../../interfaces/category-expense';
import { LoginResponse } from '../../interfaces/LoginResponse';

@Component({
  selector: 'app-analitycs',
  standalone: true,
  imports: [ChartModule, CalendarModule, FloatLabelModule, FormsModule],
  templateUrl: './analitycs.component.html',
  styleUrl: './analitycs.component.scss',
})
export class AnalitycsComponent implements OnInit {
  loginResponse: LoginResponse | null = null;
  dataByCategory: ChartData = this.initializeChartData();
  optionsByCategory: ChartOptions = this.initializeChartOptions();
  dataDailyExpense: ChartData = this.initializeChartData();
  optionsDailyExpense: ChartOptions = this.initializeChartOptions();
  accountSelected?: AccountResponse;

  rangeDates: Date[] = this.initializeDateRange();
  constructor(private http: HttpService) {}
  ngOnInit(): void {
    this.loadUserSession();
    this.refreshDashboardData();
  }

  private loadUserSession(): void {
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) return;

    this.loginResponse = JSON.parse(storedUser) as LoginResponse;

    if (this.loginResponse.user.accountList.length > 0) {
      this.accountSelected = this.loginResponse.user.accountList[0];
      this.refreshDashboardData();
    }
  }

  private initializeDateRange(): Date[] {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return [startDate, endDate];
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

  private formatDate(date: Date): string {
    return date.toISOString().replace('Z', '');
  }

  public onDateSelect(): void {
    this.refreshDashboardData();
  }

  private refreshDashboardData(): void {
    this.getSpendingByCategory();
    this.getTransactionsGroupedByDate();
  }

  private getTransactionsGroupedByDate(): void {
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
}
