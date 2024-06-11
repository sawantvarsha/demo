import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultValueSetupComponent } from './default-value-setup.component';

describe('DefaultValueSetupComponent', () => {
  let component: DefaultValueSetupComponent;
  let fixture: ComponentFixture<DefaultValueSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefaultValueSetupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultValueSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
