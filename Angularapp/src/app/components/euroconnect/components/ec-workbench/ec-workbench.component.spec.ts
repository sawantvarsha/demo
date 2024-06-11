import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcWorkbenchComponent } from './ec-workbench.component';

describe('EcWorkbenchComponent', () => {
  let component: EcWorkbenchComponent;
  let fixture: ComponentFixture<EcWorkbenchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcWorkbenchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcWorkbenchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
