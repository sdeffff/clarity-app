import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSubjectPageComponent } from './select-subject-page.component';

describe('SelectSubjectPageComponent', () => {
  let component: SelectSubjectPageComponent;
  let fixture: ComponentFixture<SelectSubjectPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectSubjectPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectSubjectPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
