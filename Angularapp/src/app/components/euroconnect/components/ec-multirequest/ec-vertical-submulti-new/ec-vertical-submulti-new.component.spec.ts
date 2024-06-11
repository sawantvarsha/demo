import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcVerticalSubmultiNewComponent } from './ec-vertical-submulti-new.component';

describe('EcVerticalSubmultiNewComponent', () => {
  let component: EcVerticalSubmultiNewComponent;
  let fixture: ComponentFixture<EcVerticalSubmultiNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcVerticalSubmultiNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcVerticalSubmultiNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
