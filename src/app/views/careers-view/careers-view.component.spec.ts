import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareersViewComponent } from './careers-view.component';

describe('CareersViewComponent', () => {
  let component: CareersViewComponent;
  let fixture: ComponentFixture<CareersViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CareersViewComponent]
    });
    fixture = TestBed.createComponent(CareersViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
