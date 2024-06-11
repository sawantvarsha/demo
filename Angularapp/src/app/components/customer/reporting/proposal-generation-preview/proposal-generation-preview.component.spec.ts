import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalGenerationPreviewComponent } from './proposal-generation-preview.component';

describe('ProposalGenerationPreviewComponent', () => {
  let component: ProposalGenerationPreviewComponent;
  let fixture: ComponentFixture<ProposalGenerationPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProposalGenerationPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalGenerationPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
