import { Pipe, PipeTransform } from '@angular/core';
import { Currency } from '../enum/currency.enum';

@Pipe({
  name: 'currencyFormat',
  standalone: true,
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number, currency: keyof typeof Currency): string {
    if (value == null || currency == null) return ''; // Trata valores nulos

    // Obtém o símbolo da moeda a partir do enum
    const currencySymbol = Currency[currency];

    // Formata o valor com duas casas decimais
    const formattedValue = value.toFixed(2);

    // Retorna o símbolo da moeda + valor formatado
    return `${currencySymbol} ${formattedValue}`;
  }
}
