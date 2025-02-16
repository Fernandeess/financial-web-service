import { Transaction } from './transaction';
import { Category } from './category';
import { Currency } from '../enum/currency.enum';

export interface TransactionResponse {
  id: number;
  description: string;
  value: number;
  valueInBaseCurrency: number;
  type: string;
  date: string;
  category: Category;
  currency: Currency;
}
