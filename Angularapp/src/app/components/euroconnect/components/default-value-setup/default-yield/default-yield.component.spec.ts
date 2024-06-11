import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultYieldComponent } from './default-yield.component';

describe('DefaultYieldComponent', () => {
  let component: DefaultYieldComponent;
  let fixture: ComponentFixture<DefaultYieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefaultYieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultYieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
