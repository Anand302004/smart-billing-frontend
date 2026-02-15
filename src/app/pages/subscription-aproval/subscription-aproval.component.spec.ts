import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionAprovalComponent } from './subscription-aproval.component';

describe('SubscriptionAprovalComponent', () => {
  let component: SubscriptionAprovalComponent;
  let fixture: ComponentFixture<SubscriptionAprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionAprovalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionAprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
