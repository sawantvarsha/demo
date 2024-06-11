import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreemapPayoffComponent } from './treemap-payoff.component';

describe('TreemapPayoffComponent', () => {
  let component: TreemapPayoffComponent;
  let fixture: ComponentFixture<TreemapPayoffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreemapPayoffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreemapPayoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
