import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcypairselectorComponent } from './ccypairselector.component';

describe('CcypairselectorComponent', () => {
  let component: CcypairselectorComponent;
  let fixture: ComponentFixture<CcypairselectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CcypairselectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CcypairselectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
