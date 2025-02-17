import { HttpService } from './../../services/http.service';
import { Component, OnInit } from '@angular/core';
import { TransactionRequest } from '../../interfaces/transaction-request';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectButtonModule } from 'primeng/selectbutton';
import { Category } from '../../interfaces/category';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-form-create-transaction',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    InputNumberModule,
    SelectButtonModule,
    DropdownModule,
  ],
  templateUrl: './form-create-transaction.component.html',
  styleUrl: './form-create-transaction.component.scss',
})
export class FormCreateTransactionComponent implements OnInit {
  categoriesList: any[] = [];
  statusOptions: any[] = [
    { label: 'RECEITA', value: 'REVENUE' },
    { label: 'DESPESA', value: 'EXPENSE' },
    { label: 'RENDA', value: 'INCOME' },
  ];
  currencyOptions: any[] = [
    { label: 'BRL', value: 'BRL' },
    { label: 'USD', value: 'USD' },
    { label: 'CAD', value: 'CAD' },
    { label: 'EURO', value: 'EURO' },
    { label: 'LIBRA', value: 'LIBRA' },
  ];

  paymentOptions: any[] = [
    { label: 'Dinheiro', value: 'MONEY' },
    { label: 'Credito', value: 'CREDIT' },
    { label: 'Debito', value: 'DEBIT' },
    { label: 'Transferencia', value: 'TRANSFER' },
    { label: 'Outros', value: 'OTHER' },
    { label: 'Pix', value: 'PIX' },
  ];
  typeOptions: any[] = [
    { label: 'PENDENTE', value: 'PENDING' },
    { label: 'EM PROCESSO', value: 'PROCESSING' },
  ];
  formRequestData: TransactionRequest = {
    value: 0,
    description: '',
    status: '',
    type: '',
    paymentMethod: '',
    currency: '',
    categoryId: 0,
    transactionTime: '',
    installments: 0,
    cardId: '',
    accountId: '',
  };
  constructor(private http: HttpService) {}
  ngOnInit(): void {
    this.getCategoriesList();
  }
  getCategoriesList() {
    this.http.get<Category[]>('category').subscribe({
      next: (value) => {
        this.categoriesList = value;
      },
    });
  }
}
