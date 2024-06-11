import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreemapCurrencyComponent } from './treemap-currency.component';

describe('TreemapCurrencyComponent', () => {
  let component: TreemapCurrencyComponent;
  let fixture: ComponentFixture<TreemapCurrencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreemapCurrencyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreemapCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
