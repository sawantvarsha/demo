import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FcnFlxComponent } from './fcn-flx.component';

describe('FcnFlxComponent', () => {
  let component: FcnFlxComponent;
  let fixture: ComponentFixture<FcnFlxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FcnFlxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FcnFlxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
