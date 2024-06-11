import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiDecuComponent } from './multi-decu.component';

describe('MultiDecuComponent', () => {
  let component: MultiDecuComponent;
  let fixture: ComponentFixture<MultiDecuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiDecuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiDecuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
