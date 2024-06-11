import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecuComponent } from './decu.component';

describe('DecuComponent', () => {
  let component: DecuComponent;
  let fixture: ComponentFixture<DecuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DecuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DecuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
