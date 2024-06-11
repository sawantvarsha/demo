import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericDivComponent } from './generic-div.component';

describe('GenericDivComponent', () => {
  let component: GenericDivComponent;
  let fixture: ComponentFixture<GenericDivComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericDivComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericDivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
