import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramViewComponent } from './program-view.component';

describe('ProgramViewComponent', () => {
  let component: ProgramViewComponent;
  let fixture: ComponentFixture<ProgramViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProgramViewComponent]
    });
    fixture = TestBed.createComponent(ProgramViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
