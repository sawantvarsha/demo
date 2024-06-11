import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnderlyingComponent } from './underlying.component';

describe('UnderlyingComponent', () => {
  let component: UnderlyingComponent;
  let fixture: ComponentFixture<UnderlyingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnderlyingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnderlyingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
