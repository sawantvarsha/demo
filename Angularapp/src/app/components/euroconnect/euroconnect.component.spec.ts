import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { EuroconnectComponent } from './euroconnect.component';

describe('EuroconnectComponent', () => {
  let component: EuroconnectComponent;
  let fixture: ComponentFixture<EuroconnectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EuroconnectComponent ],
      imports : [FormsModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EuroconnectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
