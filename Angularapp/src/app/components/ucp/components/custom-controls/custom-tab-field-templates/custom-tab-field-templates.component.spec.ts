import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTabFieldTemplatesComponent } from './custom-tab-field-templates.component';

describe('CustomTabFieldTemplatesComponent', () => {
  let component: CustomTabFieldTemplatesComponent;
  let fixture: ComponentFixture<CustomTabFieldTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomTabFieldTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomTabFieldTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
