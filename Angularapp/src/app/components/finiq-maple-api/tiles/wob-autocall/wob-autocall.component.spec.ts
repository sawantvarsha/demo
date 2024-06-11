import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WobAutocallComponent } from './wob-autocall.component';

describe('WobAutocallComponent', () => {
  let component: WobAutocallComponent;
  let fixture: ComponentFixture<WobAutocallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WobAutocallComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WobAutocallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
