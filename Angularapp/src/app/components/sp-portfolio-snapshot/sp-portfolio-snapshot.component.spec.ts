import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpPortfolioSnapshotComponent } from './sp-portfolio-snapshot.component';

describe('SpPortfolioSnapshotComponent', () => {
  let component: SpPortfolioSnapshotComponent;
  let fixture: ComponentFixture<SpPortfolioSnapshotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpPortfolioSnapshotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpPortfolioSnapshotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
