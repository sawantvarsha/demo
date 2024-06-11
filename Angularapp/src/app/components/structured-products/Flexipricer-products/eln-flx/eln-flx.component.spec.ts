import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElnFlxComponent } from './eln-flx.component';

describe('ElnFlxComponent', () => {
  let component: ElnFlxComponent;
  let fixture: ComponentFixture<ElnFlxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElnFlxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElnFlxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
