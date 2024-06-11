import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharesNewComponent } from './shares-new.component';

describe('SharesNewComponent', () => {
  let component: SharesNewComponent;
  let fixture: ComponentFixture<SharesNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharesNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharesNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
