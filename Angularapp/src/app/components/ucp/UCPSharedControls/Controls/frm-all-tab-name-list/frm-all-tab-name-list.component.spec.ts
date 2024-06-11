import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmAllTabNameListComponent } from './frm-all-tab-name-list.component';

describe('FrmAllTabNameListComponent', () => {
  let component: FrmAllTabNameListComponent;
  let fixture: ComponentFixture<FrmAllTabNameListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmAllTabNameListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmAllTabNameListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
