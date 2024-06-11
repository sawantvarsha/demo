import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UCPUploadComponent } from './ucp-upload.component';

describe('UCPUploadComponent', () => {
  let component: UCPUploadComponent;
  let fixture: ComponentFixture<UCPUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UCPUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UCPUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
