import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MpgGridComponent } from './mpg-grid.component';

describe('MpgGridComponent', () => {
  let component: MpgGridComponent;
  let fixture: ComponentFixture<MpgGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MpgGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MpgGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
