import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAssignmentComponent } from './select-assignment.component';

describe('SelectAssignmentComponent', () => {
  let component: SelectAssignmentComponent;
  let fixture: ComponentFixture<SelectAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectAssignmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
