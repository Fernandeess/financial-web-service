import { CardResponse } from './card-response';

export interface AccountResponse {
  id: string;
  accountNumber: string;
  balance: number;
  accountName: string;
  user: string;
  userName: string;
  cardList: CardResponse[];
}
