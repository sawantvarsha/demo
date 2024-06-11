import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedRequestsCardComponent } from './saved-requests-card.component';

describe('SavedRequestsCardComponent', () => {
  let component: SavedRequestsCardComponent;
  let fixture: ComponentFixture<SavedRequestsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavedRequestsCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedRequestsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
