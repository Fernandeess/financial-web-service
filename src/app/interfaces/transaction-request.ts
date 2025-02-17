export interface TransactionRequest {
  value: number;
  description: string;
  status: string;
  type: string;
  paymentMethod: string;
  currency: string;
  categoryId: number;
  transactionTime: string;
  installments: number;
  cardId: string;
  accountId: string;
}
