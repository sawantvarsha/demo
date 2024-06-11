import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MpgGridViewComponent } from './mpg-grid-view.component';

describe('MpgGridViewComponent', () => {
  let component: MpgGridViewComponent;
  let fixture: ComponentFixture<MpgGridViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MpgGridViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MpgGridViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
