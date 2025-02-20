import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEditTransactionComponent } from './form-edit-transaction.component';

describe('FormEditTransactionComponent', () => {
  let component: FormEditTransactionComponent;
  let fixture: ComponentFixture<FormEditTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormEditTransactionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormEditTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
