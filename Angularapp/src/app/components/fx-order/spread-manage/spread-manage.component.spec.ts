import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpreadManageComponent } from './spread-manage.component';

describe('SpreadManageComponent', () => {
  let component: SpreadManageComponent;
  let fixture: ComponentFixture<SpreadManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpreadManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpreadManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
