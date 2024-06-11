import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultCustomstrategyComponent } from './default-customstrategy.component';

describe('DefaultCustomstrategyComponent', () => {
  let component: DefaultCustomstrategyComponent;
  let fixture: ComponentFixture<DefaultCustomstrategyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefaultCustomstrategyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultCustomstrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
