import { CommonModule } from '@angular/common';
import { Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { MasterService } from '../../../core/services/master-service';
import { Category } from '../../../shared/model/category.model';
import { Product } from '../../../shared/model/product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-product',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-product.component.html',
  styleUrl: './manage-product.component.css',
})
export class ManageProductComponent implements OnInit {
  categories$!: Observable<Category[]>;
  products$!: Observable<Product[]>;
  productForm!: FormGroup;

  private service = inject(MasterService);
  private route = inject(Router);
  private refreshTrigger = new BehaviorSubject<void>(undefined);
  private editingMongoId: string | null = null;

  showForm = false;
  isEditing = false;


  constructor() { }


  ngOnInit(): void {
    this.categories$ = this.service.getAllCategories();
    this.products$ = this.refreshTrigger.pipe(switchMap(() => this.service.getAllProducts()));

    this.productForm = new FormGroup({
      id: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      stockCount: new FormControl('', Validators.required),
      image: new FormControl(''),
      shortDescription: new FormControl('', Validators.required),
      description: new FormControl(''),
      category: new FormControl<number | null>(null, Validators.required),
      discount: new FormControl(0),
      expiryDate: new FormControl('', Validators.required),
      featured: new FormControl(false),
      isNewProduct: new FormControl(false),
      isLimited: new FormControl(false),

    });
  }

  onAddProduct(): void {
    this.showForm = true;
    this.isEditing = false;
    this.resetForm();

  }



  onEditProduct(product: Product): void {
    this.showForm = true;
    this.isEditing = true;
    this.editingMongoId = product._id;
    this.productForm.patchValue({
      id: product.id,
      name: product.name,
      price: product.price,
      stockCount: product.stockCount,
      image: product.image,
      shortDescription: product.shortDescription,
      description: product.description,
      category: (product.category as unknown as number) ?? null,
      discount: product.discount ?? 0,
      expiryDate: product.expiryDate ?? '',
      featured: product.featured ?? false,
      isNewProduct: product.isNewProduct ?? false,
      isLimited: product.isLimited ?? false,

    })

  }

  resetForm(): void {
    this.productForm.reset({
      id: '',
      name: '',
      price: '',
      stockCount: '',
      image: '',
      shortDescription: '',
      description: '',
      category: null,
      discount: 0,
      expiryDate: '',
      featured: false,
      isNewProduct: false,
      isLimited: false,
    })
  }

  onCancel(): void {
    this.showForm = false;
    this.isEditing = false;
    this.resetForm();
  }

  onSaveProduct(): void {
    if (this.productForm.invalid) return;
    const formValue = this.productForm.value;
    const payload: Partial<Product> = {
      ...formValue,
      ...(this.isEditing ? {} : ({ isNew: formValue.isNewProduct } as any))
    }
    

    if (this.isEditing && this.editingMongoId) {
      this.service.updateProduct(this.editingMongoId, {
        name: payload.name,
        description: payload.description,
        price: payload.price as any,
        discount: payload.discount as any,
        category: payload.category as any,
        image: payload.image,
        stockCount: payload.stockCount as any,
      }).subscribe({
        next: () => {
          this.refreshTrigger.next();
          this.resetForm();
        },
        error: (err) => console.error('Error updating product:', err),
      })
      return;
    }

    this.service.saveProduct(payload as Product).subscribe({
      next: () => {
        this.refreshTrigger.next();
        this.resetForm();
      },
      error: (err) => console.error('Error saving product:', err),
    })
  }

  onViewProduct(mongoId: string): void {
    this.route.navigate(['view-product', mongoId]);
  }

  onDeleteProduct(product: Product): void {
    this.service.deleteProduct(product._id).subscribe({
      next: () => this.refreshTrigger.next(),
      error: (err) => console.error('Error deleting product:', err),
    })
  }
    
}

