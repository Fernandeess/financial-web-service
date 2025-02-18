import { Category } from './../../interfaces/category';
import { Component, Input, OnInit } from '@angular/core';
import { CategoryExpense } from '../../interfaces/category-expense';

@Component({
  selector: 'app-category-expending-values',
  standalone: true,
  imports: [],
  templateUrl: './category-expending-values.component.html',
  styleUrl: './category-expending-values.component.scss',
})
export class CategoryExpendingValuesComponent implements OnInit {
  @Input() category?: CategoryExpense = undefined;
  ngOnInit(): void {
    console.log(this.category);
  }
}
