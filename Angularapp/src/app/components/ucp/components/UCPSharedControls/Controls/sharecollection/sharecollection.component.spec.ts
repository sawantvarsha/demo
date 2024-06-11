import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharecollectionComponent } from './sharecollection.component';

describe('SharecollectionComponent', () => {
  let component: SharecollectionComponent;
  let fixture: ComponentFixture<SharecollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharecollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharecollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
