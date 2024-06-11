import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultirequestComponent } from './multirequest.component';

describe('MultirequestComponent', () => {
  let component: MultirequestComponent;
  let fixture: ComponentFixture<MultirequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultirequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultirequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
