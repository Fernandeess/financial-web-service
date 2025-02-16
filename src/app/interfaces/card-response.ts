import { Currency } from '../enum/currency.enum';

export interface CardResponse {
  lastFourDigits: string;
  cardHolderName: string;
  network: String;
  expirationDate: Date;
  isActive: boolean;
  balance: number;
  currency: Currency;
}
