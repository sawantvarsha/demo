import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BENComponent } from './ben.component';

describe('BENComponent', () => {
  let component: BENComponent;
  let fixture: ComponentFixture<BENComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BENComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BENComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
