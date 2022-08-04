import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountMySalesComponent } from './account-my-sales.component';

describe('AccountMySalesComponent', () => {
  let component: AccountMySalesComponent;
  let fixture: ComponentFixture<AccountMySalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountMySalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountMySalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
