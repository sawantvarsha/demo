import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingMaterialCardComponent } from './marketing-material-card.component';

describe('MarketingMaterialCardComponent', () => {
  let component: MarketingMaterialCardComponent;
  let fixture: ComponentFixture<MarketingMaterialCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketingMaterialCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingMaterialCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
