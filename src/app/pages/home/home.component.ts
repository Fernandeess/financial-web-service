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
import { Currency } from '../../enum/currency.enum';
import { CurrencyFormatPipe } from '../../pipe/currency-format.pipe';
import { CommonModule, DatePipe } from '@angular/common';
import { AccountResponse } from '../../interfaces/account-response';

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
    CurrencyFormatPipe,
  ],
})
export class HomeComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'value',
    'valueInBRL',
    'description',
    'type',
    'date',
    'category',
  ];
  accountSelected?: AccountResponse = undefined;
  totalElements: number = 0;
  pageSize: number = 10;
  loginResponse: LoginResponse | null = null;
  firstName: String = '';
  pageResponse: Page<TransactionResponse> = {
    content: [],
    page: {
      totalElements: 10,
      totalPages: 0,
      size: 10,
      number: 0,
    },
  };
  now = new Date(Date.now());

  startDate = new Date(this.now.getFullYear(), this.now.getMonth(), 1)
    .toISOString()
    .replace('Z', '');
  endDate = new Date(this.now.getFullYear(), this.now.getMonth() + 1, 0)
    .toISOString()
    .replace('Z', '');

  constructor(private http: HttpService, private date: DatePipe) {}

  ngOnInit(): void {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      this.loginResponse = JSON.parse(storedUser) as LoginResponse;
      this.firstName = this.loginResponse?.user?.name?.split(' ')[0] || '';
      var accList = this.loginResponse.user.accountList;
      if (accList.length != 0) {
        this.accountSelected = accList[0];
      }
    }

    this.getTransactions(0, this.pageSize);
    console.log(
      sessionStorage.getItem('user')
        ? JSON.parse(sessionStorage.getItem('user')!)
        : "Nenhum dado encontrado para a chave 'user'."
    );
  }

  getTransactions(pageIndex: number, pageSize: number) {
    this.http
      .get<Page<TransactionResponse>>(
        `transactions?startDate=${this.startDate}&endDate=${this.endDate}&accountId=636bb19a-1c13-4a0b-a37f-ded95d7fa50c&page=${pageIndex}&size=${pageSize}`
      )
      .subscribe({
        next: (value) => {
          console.log('Resposta da API:', value); // 🔍 Verificar se está retornando os dados corretamente
          this.pageResponse = value;
          console.log(this.pageResponse);
        },
        error: (err) => {
          console.error('Erro ao buscar transações:', err);
        },
      });
  }

  onPageChange(event: PageEvent) {
    this.getTransactions(event.pageIndex, event.pageSize);
  }
}
