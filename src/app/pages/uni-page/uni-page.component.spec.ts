import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniPageComponent } from './uni-page.component';

describe('UniPageComponent', () => {
  let component: UniPageComponent;
  let fixture: ComponentFixture<UniPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UniPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UniPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
