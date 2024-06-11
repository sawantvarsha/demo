import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WfFindComponent } from './wf-find.component';

describe('WfFindComponent', () => {
  let component: WfFindComponent;
  let fixture: ComponentFixture<WfFindComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WfFindComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WfFindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
