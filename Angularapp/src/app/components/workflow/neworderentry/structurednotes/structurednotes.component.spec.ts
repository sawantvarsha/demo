import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StructurednotesComponent } from './structurednotes.component';

describe('StructurednotesComponent', () => {
  let component: StructurednotesComponent;
  let fixture: ComponentFixture<StructurednotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StructurednotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StructurednotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
