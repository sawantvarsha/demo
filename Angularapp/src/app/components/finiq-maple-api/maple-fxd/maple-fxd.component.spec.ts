import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapleFxdComponent } from './maple-fxd.component';

describe('MapleFxdComponent', () => {
  let component: MapleFxdComponent;
  let fixture: ComponentFixture<MapleFxdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapleFxdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapleFxdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
