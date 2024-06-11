import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcMultiYieldEnhancementComponent } from './ec-multi-yield-enhancement.component';

describe('EcMultiYieldEnhancementComponent', () => {
  let component: EcMultiYieldEnhancementComponent;
  let fixture: ComponentFixture<EcMultiYieldEnhancementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcMultiYieldEnhancementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcMultiYieldEnhancementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
