import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCreateTransactionComponent } from './form-create-transaction.component';

describe('FormCreateTransactionComponent', () => {
  let component: FormCreateTransactionComponent;
  let fixture: ComponentFixture<FormCreateTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCreateTransactionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormCreateTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
