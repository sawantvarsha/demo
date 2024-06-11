import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalGenerationComponent } from './proposal-generation.component';

describe('ProposalGenerationComponent', () => {
  let component: ProposalGenerationComponent;
  let fixture: ComponentFixture<ProposalGenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProposalGenerationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
