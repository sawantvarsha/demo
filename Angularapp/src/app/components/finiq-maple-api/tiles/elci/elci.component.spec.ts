import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElciComponent } from './elci.component';

describe('ElciComponent', () => {
  let component: ElciComponent;
  let fixture: ComponentFixture<ElciComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElciComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
