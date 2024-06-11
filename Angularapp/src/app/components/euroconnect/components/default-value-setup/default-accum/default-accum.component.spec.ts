import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultAccumComponent } from './default-accum.component';

describe('DefaultAccumComponent', () => {
  let component: DefaultAccumComponent;
  let fixture: ComponentFixture<DefaultAccumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefaultAccumComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultAccumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
