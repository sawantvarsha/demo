import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpsComponent } from './sps.component';

describe('SpsComponent', () => {
  let component: SpsComponent;
  let fixture: ComponentFixture<SpsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
