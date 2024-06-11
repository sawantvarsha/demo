import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GreekLCMComponent } from './greek-lcm.component';

describe('GreekLCMComponent', () => {
  let component: GreekLCMComponent;
  let fixture: ComponentFixture<GreekLCMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GreekLCMComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GreekLCMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
