import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MasterService } from '../../../core/services/master-service';
import { Category } from '../../../shared/model/category.model';
import { Product } from '../../../shared/model/product.model';

@Component({
  selector: 'app-manage-product',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-product.component.html',
  styleUrl: './manage-product.component.css',
})
export class ManageProductComponent implements OnInit {
  productForm!: FormGroup;
  categories$!: Observable<Category[]>;
  products$!: Observable<Product[]>;

  showForm = false;
  isEditing = false;
  editingMongoId: string | null = null;

  constructor(private masterService: MasterService) {}

  ngOnInit(): void {
    this.categories$ = this.masterService.getAllCategories();
    this.refreshProducts();

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

  refreshProducts(): void {
    this.products$ = this.masterService.getAllProducts();
  }

  onAddProduct(): void {
    this.showForm = true;
    this.isEditing = false;
    this.editingMongoId = null;
    this.productForm.reset({
      _id: '',
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
    });
  }

  onEditProduct(product: Product): void {
    this.showForm = true;
    this.isEditing = true;
    this.editingMongoId = product._id;
    this.productForm.patchValue({
      _id: product.id,
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
    });
  }

  onCancel(): void {
    this.showForm = false;
    this.isEditing = false;
    this.editingMongoId = null;
    this.productForm.reset();
  }

  onSaveProduct(): void {
    this.productForm.markAllAsTouched();
    if (this.productForm.invalid) return;

    const formValue = this.productForm.value;
    const payload: Partial<Product> = {
      ...formValue,
      image: formValue.image || '/placeholder.svg',
      // backend expects isNew (not isNewProduct)
      ...(this.isEditing ? {} : ({ isNew: formValue.isNewProduct } as any)),
    };

    if (this.isEditing && this.editingMongoId) {
      this.masterService
        .updateProduct(this.editingMongoId, {
          name: payload.name,
          description: payload.description,
          price: payload.price as any,
          discount: payload.discount as any,
          category: payload.category as any,
          image: payload.image,
          stockCount: payload.stockCount as any,
        })
        .subscribe({
          next: () => {
            this.refreshProducts();
            this.onCancel();
          },
          error: (err) => console.error('Error updating product:', err),
        });
      return;
    }

    this.masterService.saveProduct(payload as Product).subscribe({
      next: () => {
        this.refreshProducts();
        this.onCancel();
      },
      error: (err) => console.error('Error saving product:', err),
    });
  }

  onDeleteProduct(product: Product): void {
    if (!product._id) return;
    this.masterService.deleteProduct(product._id).subscribe({
      next: () => this.refreshProducts(),
      error: (err) => console.error('Error deleting product:', err),
    });
  }
}
