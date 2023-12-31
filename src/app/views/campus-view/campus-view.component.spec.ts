import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampusViewComponent } from './campus-view.component';

describe('CampusViewComponent', () => {
  let component: CampusViewComponent;
  let fixture: ComponentFixture<CampusViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CampusViewComponent]
    });
    fixture = TestBed.createComponent(CampusViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
