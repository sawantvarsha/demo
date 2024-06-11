import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioallocationComponent } from './portfolioallocation.component';

describe('PortfolioallocationComponent', () => {
  let component: PortfolioallocationComponent;
  let fixture: ComponentFixture<PortfolioallocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortfolioallocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioallocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
