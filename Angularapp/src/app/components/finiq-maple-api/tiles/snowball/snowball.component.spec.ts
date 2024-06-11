import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnowballComponent } from './snowball.component';

describe('SnowballComponent', () => {
  let component: SnowballComponent;
  let fixture: ComponentFixture<SnowballComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnowballComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnowballComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
