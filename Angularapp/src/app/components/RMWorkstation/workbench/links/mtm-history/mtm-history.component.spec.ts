import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MtmHistoryComponent } from './mtm-history.component';

describe('MtmHistoryComponent', () => {
  let component: MtmHistoryComponent;
  let fixture: ComponentFixture<MtmHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MtmHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MtmHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
