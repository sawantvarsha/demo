import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnFilterMpgComponent } from './column-filter-mpg.component';

describe('ColumnFilterMpgComponent', () => {
  let component: ColumnFilterMpgComponent;
  let fixture: ComponentFixture<ColumnFilterMpgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColumnFilterMpgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnFilterMpgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
