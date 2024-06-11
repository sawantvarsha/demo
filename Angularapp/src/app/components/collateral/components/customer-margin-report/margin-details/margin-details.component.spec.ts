import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarginDetailsComponent } from './margin-details.component';

describe('MarginDetailsComponent', () => {
  let component: MarginDetailsComponent;
  let fixture: ComponentFixture<MarginDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarginDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarginDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
