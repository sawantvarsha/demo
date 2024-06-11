import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YieldEnhancementComponent } from './yield-enhancement.component';

describe('YieldEnhancementComponent', () => {
  let component: YieldEnhancementComponent;
  let fixture: ComponentFixture<YieldEnhancementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YieldEnhancementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YieldEnhancementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
