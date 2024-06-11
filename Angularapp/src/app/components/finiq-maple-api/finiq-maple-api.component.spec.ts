import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiniqMapleAPIComponent } from './finiq-maple-api.component';

describe('FiniqMapleAPIComponent', () => {
  let component: FiniqMapleAPIComponent;
  let fixture: ComponentFixture<FiniqMapleAPIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiniqMapleAPIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiniqMapleAPIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
