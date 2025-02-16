import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-category-expending-values',
  standalone: true,
  imports: [],
  templateUrl: './category-expending-values.component.html',
  styleUrl: './category-expending-values.component.scss',
})
export class CategoryExpendingValuesComponent {
  @Input() name: String = '';
  @Input() value: Number = 0;
}
