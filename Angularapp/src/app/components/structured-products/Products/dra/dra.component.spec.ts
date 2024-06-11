import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DRAComponent } from './dra.component';

describe('DRAComponent', () => {
  let component: DRAComponent;
  let fixture: ComponentFixture<DRAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DRAComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DRAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
