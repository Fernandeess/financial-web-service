import { AccountResponse } from './account-response';

export interface User {
  email: string;
  id: string;
  name: string;
  accountList: AccountResponse[];
}
