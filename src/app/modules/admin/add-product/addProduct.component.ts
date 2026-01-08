import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Form, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MasterService } from '../../../core/services/master-service';
import { Category } from '../../../shared/model/category.model';
import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-addProduct',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './addProduct.component.html',
  styleUrls: ['./addProduct.component.css'],
})
export class AddProductComponent implements OnInit, OnDestroy {

  productForm!: FormGroup;
  categories!: Observable<Category[]>;
  subscribe: Subscription[] = [];

  private masterService = inject(MasterService);

  constructor() {
    this.categories = this.masterService.getAllCategories();
  }

  ngOnInit(): void {
    this.productForm = new FormGroup({
      id: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      stockCount: new FormControl('', Validators.required),
      image: new FormControl('', Validators.required),
      shortDescription: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
      demand: new FormControl(''),
      featured: new FormControl(false),
      isNewProduct: new FormControl(false),
      isLimited: new FormControl(false),
      ingredients: new FormControl([], Validators.required),
      discount: new FormControl(0),
      season: new FormControl(''),
      rating: new FormControl(0),
      reviews: new FormControl(0),
      expiryDate: new FormControl('', Validators.required),
    })
  }

  onSaveProduct() {
    if (this.productForm.valid) {
      this.masterService.saveProduct(this.productForm.value).subscribe({
        next: () => {
          this.productForm.reset();
          console.log('Product saved successfully');
        },
        error: (err) => {
          console.error('Error saving product:', err);
        }
      }

      )
    }
  }

  ngOnDestroy(): void {
    this.subscribe.forEach(sub => sub.unsubscribe());
  }

}
