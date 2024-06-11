import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CAEvenetDiaryComponent } from './ca-evenet-diary.component';

describe('CAEvenetDiaryComponent', () => {
  let component: CAEvenetDiaryComponent;
  let fixture: ComponentFixture<CAEvenetDiaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CAEvenetDiaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CAEvenetDiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
