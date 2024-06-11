import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldTemplatesEWComponent } from './field-templates-ew.component';

describe('FieldTemplatesEWComponent', () => {
  let component: FieldTemplatesEWComponent;
  let fixture: ComponentFixture<FieldTemplatesEWComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldTemplatesEWComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldTemplatesEWComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
