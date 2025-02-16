import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryExpendingValuesComponent } from './category-expending-values.component';

describe('CategoryExpendingValuesComponent', () => {
  let component: CategoryExpendingValuesComponent;
  let fixture: ComponentFixture<CategoryExpendingValuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryExpendingValuesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoryExpendingValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
