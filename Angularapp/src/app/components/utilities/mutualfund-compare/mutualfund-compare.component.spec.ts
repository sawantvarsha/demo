import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MutualfundCompareComponent } from './mutualfund-compare.component';

describe('MutualfundCompareComponent', () => {
  let component: MutualfundCompareComponent;
  let fixture: ComponentFixture<MutualfundCompareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MutualfundCompareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MutualfundCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
