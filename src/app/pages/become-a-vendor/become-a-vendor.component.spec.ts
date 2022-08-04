import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeAVendorComponent } from './become-a-vendor.component';

describe('BecomeAVendorComponent', () => {
  let component: BecomeAVendorComponent;
  let fixture: ComponentFixture<BecomeAVendorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BecomeAVendorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BecomeAVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
