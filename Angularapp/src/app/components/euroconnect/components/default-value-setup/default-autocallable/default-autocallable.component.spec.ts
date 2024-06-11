import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultAutocallableComponent } from './default-autocallable.component';

describe('DefaultAutocallableComponent', () => {
  let component: DefaultAutocallableComponent;
  let fixture: ComponentFixture<DefaultAutocallableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefaultAutocallableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultAutocallableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
