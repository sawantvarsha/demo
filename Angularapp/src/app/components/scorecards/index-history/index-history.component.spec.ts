import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexHistoryComponent } from './index-history.component';

describe('IndexHistoryComponent', () => {
  let component: IndexHistoryComponent;
  let fixture: ComponentFixture<IndexHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
