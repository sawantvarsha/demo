import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeiComponent } from './bei.component';

describe('BeiComponent', () => {
  let component: BeiComponent;
  let fixture: ComponentFixture<BeiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
