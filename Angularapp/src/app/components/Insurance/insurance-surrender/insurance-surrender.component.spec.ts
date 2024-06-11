import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceSurrenderComponent } from './insurance-surrender.component';

describe('InsuranceSurrenderComponent', () => {
  let component: InsuranceSurrenderComponent;
  let fixture: ComponentFixture<InsuranceSurrenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceSurrenderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceSurrenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
