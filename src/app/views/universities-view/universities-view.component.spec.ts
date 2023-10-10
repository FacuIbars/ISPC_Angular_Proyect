import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversitiesViewComponent } from './universities-view.component';

describe('UniversitiesViewComponent', () => {
  let component: UniversitiesViewComponent;
  let fixture: ComponentFixture<UniversitiesViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UniversitiesViewComponent]
    });
    fixture = TestBed.createComponent(UniversitiesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
