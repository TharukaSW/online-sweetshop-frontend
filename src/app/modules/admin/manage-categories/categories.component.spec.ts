import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCategoriesComponent } from './categories.component';

describe('ManageCategoriesComponent', () => {
  let component: ManageCategoriesComponent;
  let fixture: ComponentFixture<ManageCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageCategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageCategoriesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
