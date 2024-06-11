import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MtmAndKiComponent } from './mtm-and-ki.component';

describe('MtmAndKiComponent', () => {
  let component: MtmAndKiComponent;
  let fixture: ComponentFixture<MtmAndKiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MtmAndKiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MtmAndKiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
