import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionUsersComponent } from './subscription-users.component';

describe('SubscriptionUsersComponent', () => {
  let component: SubscriptionUsersComponent;
  let fixture: ComponentFixture<SubscriptionUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
