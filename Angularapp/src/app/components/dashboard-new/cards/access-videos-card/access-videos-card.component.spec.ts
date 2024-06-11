import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessVideosCardComponent } from './access-videos-card.component';

describe('AccessVideosCardComponent', () => {
  let component: AccessVideosCardComponent;
  let fixture: ComponentFixture<AccessVideosCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessVideosCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessVideosCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
