import { Component, inject, Input } from '@angular/core';
import { Product } from '../../model/product.model';
import { CartService } from '../../../core/services/cart.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCardComponent {
  @Input() product!: Product;

  private cartService = inject(CartService);

  onAddToCart(): void {
    this.cartService.addToCart(this.product._id, 1).subscribe({
      next: () => {
        console.log('Product added to cart successfully');
      },
      error: (error) => {
        console.error('Error adding product to cart:', error);
        alert('Please login to add items to cart');
      }
    });
  }

  onViewProduct(): void {
    // Navigation handled by routerLink in template
  }
}

