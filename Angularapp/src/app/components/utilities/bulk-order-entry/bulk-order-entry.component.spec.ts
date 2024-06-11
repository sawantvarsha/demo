import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkOrderEntryComponent } from './bulk-order-entry.component';

describe('BulkOrderEntryComponent', () => {
  let component: BulkOrderEntryComponent;
  let fixture: ComponentFixture<BulkOrderEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkOrderEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkOrderEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
