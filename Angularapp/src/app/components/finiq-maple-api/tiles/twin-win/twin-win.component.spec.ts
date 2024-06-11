import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwinWinComponent } from './twin-win.component';

describe('TwinWinComponent', () => {
  let component: TwinWinComponent;
  let fixture: ComponentFixture<TwinWinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwinWinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwinWinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
