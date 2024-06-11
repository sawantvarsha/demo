import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MtmAndKoComponent } from './mtm-and-ko.component';

describe('MtmAndKoComponent', () => {
  let component: MtmAndKoComponent;
  let fixture: ComponentFixture<MtmAndKoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MtmAndKoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MtmAndKoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
