import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingPrintComponent } from './billing-print.component';

describe('BillingPrintComponent', () => {
  let component: BillingPrintComponent;
  let fixture: ComponentFixture<BillingPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingPrintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
