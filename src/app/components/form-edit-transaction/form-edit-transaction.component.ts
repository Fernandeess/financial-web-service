import { Transaction } from './../../interfaces/transaction';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { TransactionResponse } from '../../interfaces/transaction-response';
import { CommonModule } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Category } from '../../interfaces/category';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-form-edit-transaction',
  standalone: true,
  imports: [
    DialogModule,
    CommonModule,
    InputNumberModule,
    SelectButtonModule,
    DialogModule,
    DropdownModule,
    ButtonModule,
    CalendarModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './form-edit-transaction.component.html',
  styleUrl: './form-edit-transaction.component.scss',
})
export class FormEditTransactionComponent implements OnInit {
  @Input()
  showDialogEditTransaction: boolean = true;

  @Input()
  transaction?: TransactionResponse;

  @Output() closeDialog = new EventEmitter<void>();

  categoriesList: any[] = [];

  close() {
    this.closeDialog.emit();
  }

  constructor(private cdr: ChangeDetectorRef, private http: HttpService) {}

  ngOnInit(): void {
    this.getCategoriesList();
  }

  ngOnChanges(): void {
    console.log('Transaction recebida no Edit:', this.transaction);
  }
  save(): void {
    if (this.transaction) {
      console.log('Transação atualizada:', this.transaction);
      this.close();
    }
  }

  getCategoriesList() {
    this.http.get<Category[]>('category').subscribe({
      next: (value) => {
        this.categoriesList = value;
      },
    });
  }
}
