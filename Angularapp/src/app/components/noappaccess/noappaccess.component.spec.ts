import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoappaccessComponent } from './noappaccess.component';

describe('NoappaccessComponent', () => {
  let component: NoappaccessComponent;
  let fixture: ComponentFixture<NoappaccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoappaccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoappaccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
