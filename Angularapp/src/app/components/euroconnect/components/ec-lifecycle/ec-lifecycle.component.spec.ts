import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcLifecycleComponent } from './ec-lifecycle.component';

describe('EcLifecycleComponent', () => {
  let component: EcLifecycleComponent;
  let fixture: ComponentFixture<EcLifecycleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcLifecycleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcLifecycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
