import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapleCashFXComponent } from './maple-cash-fx.component';

describe('MapleCashFXComponent', () => {
  let component: MapleCashFXComponent;
  let fixture: ComponentFixture<MapleCashFXComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapleCashFXComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapleCashFXComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
