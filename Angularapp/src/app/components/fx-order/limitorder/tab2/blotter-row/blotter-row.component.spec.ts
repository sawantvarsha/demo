import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlotterRowComponent } from './blotter-row.component';

describe('BlotterRowComponent', () => {
  let component: BlotterRowComponent;
  let fixture: ComponentFixture<BlotterRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlotterRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlotterRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
