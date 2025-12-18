import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageProductComponent } from './addProduct.component';

describe('ManageProductComponent', () => {
  let component: ManageProductComponent;
  let fixture: ComponentFixture<ManageProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageProductComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
