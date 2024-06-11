import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcWorkflowBlotterComponent } from './ec-workflow-blotter.component';

describe('EcWorkflowBlotterComponent', () => {
  let component: EcWorkflowBlotterComponent;
  let fixture: ComponentFixture<EcWorkflowBlotterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcWorkflowBlotterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcWorkflowBlotterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
