import { HttpService } from './../../services/http.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TransactionRequest } from '../../interfaces/transaction-request';
import { CommonModule, Time } from '@angular/common';

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
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-form-create-transaction',
  standalone: true,
  imports: [
    CommonModule,
    InputNumberModule,
    SelectButtonModule,
    DialogModule,
    DropdownModule,
    ButtonModule,
    CalendarModule,
    ReactiveFormsModule,
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
  transactionForm!: FormGroup;
  date: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getCategoriesList();
    this.getCardList();
  }

  private initForm() {
    this.transactionForm = this.fb.group({
      value: [0, [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      status: ['', Validators.required],
      type: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      currency: ['', Validators.required],
      categoryId: [null, Validators.required],
      transactionTime: [new Date(), Validators.required],
      installments: [1, [Validators.required, Validators.min(0)]],
      cardId: [''],
      accountId: [''],
    });
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
    const formData: TransactionRequest = {
      ...this.transactionForm.value,
      transactionTime: new Date(
        this.transactionForm.value.transactionTime
      ).toISOString(),
      accountId: this.account?.id || '',
    };

    this.http.post('transactions', formData).subscribe({
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
