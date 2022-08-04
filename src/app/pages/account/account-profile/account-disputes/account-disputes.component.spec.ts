import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDisputesComponent } from './account-disputes.component';

describe('AccountDisputesComponent', () => {
  let component: AccountDisputesComponent;
  let fixture: ComponentFixture<AccountDisputesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountDisputesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountDisputesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
