import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsProductListComponent } from './news-product-list.component';

describe('NewsProductListComponent', () => {
  let component: NewsProductListComponent;
  let fixture: ComponentFixture<NewsProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsProductListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
