import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RmwComponent } from './rmw.component';

describe('RmwComponent', () => {
  let component: RmwComponent;
  let fixture: ComponentFixture<RmwComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RmwComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RmwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
