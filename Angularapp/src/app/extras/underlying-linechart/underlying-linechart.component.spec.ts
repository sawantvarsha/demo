import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnderlyingLinechartComponent } from './underlying-linechart.component';

describe('UnderlyingLinechartComponent', () => {
  let component: UnderlyingLinechartComponent;
  let fixture: ComponentFixture<UnderlyingLinechartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnderlyingLinechartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnderlyingLinechartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
