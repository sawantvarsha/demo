import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxgraphComponent } from './fxgraph.component';

describe('FxgraphComponent', () => {
  let component: FxgraphComponent;
  let fixture: ComponentFixture<FxgraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxgraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FxgraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
