import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MylabsComponent } from './mylabs.component';

describe('MylabsComponent', () => {
  let component: MylabsComponent;
  let fixture: ComponentFixture<MylabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MylabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MylabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
