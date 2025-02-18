import { HttpService } from './../../services/http.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TransactionRequest } from '../../interfaces/transaction-request';
import { CommonModule, Time } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectButtonModule } from 'primeng/selectbutton';
import { Category } from '../../interfaces/category';
import { DropdownModule } from 'primeng/dropdown';
import { AuthService } from '../../services/auth.service';
import { AccountResponse } from '../../interfaces/account-response';
import { CardResponse } from '../../interfaces/card-response';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-form-create-transaction',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    InputNumberModule,
    SelectButtonModule,
    DialogModule,
    DropdownModule,
    ButtonModule,
    CalendarModule,
  ],
  templateUrl: './form-create-transaction.component.html',
  styleUrl: './form-create-transaction.component.scss',
})
export class FormCreateTransactionComponent implements OnInit {
  @Input() createTransactionDialog: boolean = true;
  @Input() account?: AccountResponse;
  @Output() closeDialog = new EventEmitter<void>();
  showBtn: boolean = true;
  categoriesList: any[] = [];
  cardList: CardResponse[] = [];
  typeOptions: any[] = [
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
  statusOptions: any[] = [
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
  date: Date = new Date();

  constructor(private http: HttpService, private auth: AuthService) {}

  ngOnInit(): void {
    this.getCategoriesList();
    this.getCardList();
  }
  getCategoriesList() {
    this.http.get<Category[]>('category').subscribe({
      next: (value) => {
        this.categoriesList = value;
      },
    });
  }
  getCardList() {
    console.log(this.account?.cardList);
    this.cardList = this.account?.cardList || [];
  }

  createTransaction() {
    var data = this.formRequestData;
    if (data.value <= 0) {
      console.error('Value must be greater than zero.');
      return;
    }

    if (!data.description || data.description.trim() === '') {
      console.error('Description is required.');
      return;
    }

    if (!data.transactionTime || isNaN(Date.parse(data.transactionTime))) {
      console.error('Transaction time is invalid.');
      return;
    }

    if (data.installments < 0) {
      console.error('Installments must be at least 0.');
      return;
    }

    if (!data.accountId || data.accountId.trim() === '') {
      console.error('Account ID is required.');
      return;
    }

    data.accountId = this.account?.id || '';
    data.transactionTime = this.date.toISOString().replace('Z', '');

    this.http.post('transactions', data).subscribe({
      next: (value) => {
        this.close();
        console.log(value);
      },
      error(err) {
        console.log(err);
      },
    });
  }

  close() {
    this.closeDialog.emit();
  }
}
