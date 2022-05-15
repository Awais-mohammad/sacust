import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDashboardLabsComponent } from './student-dashboard-labs.component';

describe('StudentDashboardLabsComponent', () => {
  let component: StudentDashboardLabsComponent;
  let fixture: ComponentFixture<StudentDashboardLabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentDashboardLabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentDashboardLabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
