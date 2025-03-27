import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectPopupComponent } from './subject-popup.component';

describe('SubjectPopupComponent', () => {
  let component: SubjectPopupComponent;
  let fixture: ComponentFixture<SubjectPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubjectPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
