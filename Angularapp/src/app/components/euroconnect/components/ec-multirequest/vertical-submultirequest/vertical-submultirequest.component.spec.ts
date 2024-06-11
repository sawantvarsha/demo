import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalSubmultirequestComponent } from './vertical-submultirequest.component';

describe('VerticalSubmultirequestComponent', () => {
  let component: VerticalSubmultirequestComponent;
  let fixture: ComponentFixture<VerticalSubmultirequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerticalSubmultirequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerticalSubmultirequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
