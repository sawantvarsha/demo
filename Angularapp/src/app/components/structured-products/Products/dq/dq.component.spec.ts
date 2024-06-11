import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DqComponent } from './dq.component';

describe('DqComponent', () => {
  let component: DqComponent;
  let fixture: ComponentFixture<DqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DqComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
