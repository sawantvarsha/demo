import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldTemplatesComponent } from './field-templates.component';

describe('FieldTemplatesComponent', () => {
  let component: FieldTemplatesComponent;
  let fixture: ComponentFixture<FieldTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
