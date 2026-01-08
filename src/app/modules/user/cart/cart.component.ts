import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CartService } from '../../../core/services/cart.service';
import { Cart, CartItem } from '../../../shared/model/cart.model';
import { RouterModule } from '@angular/router';
import { Product } from '../../../shared/model/product.model';

@Component({
	selector: 'app-cart',
	imports: [CommonModule, RouterModule],
	templateUrl: './cart.component.html',
	styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
	cart$!: Observable<Cart>;
	private cartService = inject(CartService);

	ngOnInit(): void {
		this.cart$ = this.cartService.getCart();
		// Reload cart from server
		this.cartService.loadCart();
	}

	onUpdateQuantity(item: CartItem, quantity: number): void {
		const productId = this.getProductId(item);
		if (productId) {
			this.cartService.updateQuantity(productId, quantity).subscribe();
		}
	}

	onIncreaseQuantity(item: CartItem): void {
		const product = this.getProduct(item);
		const productId = this.getProductId(item);
		
		if (productId && product && item.quantity < product.stockCount) {
			this.cartService.updateQuantity(productId, item.quantity + 1).subscribe();
		}
	}

	onDecreaseQuantity(item: CartItem): void {
		const productId = this.getProductId(item);
		
		if (productId && item.quantity > 1) {
			this.cartService.updateQuantity(productId, item.quantity - 1).subscribe();
		}
	}

	onRemoveItem(item: CartItem): void {
		const productId = this.getProductId(item);
		if (productId) {
			this.cartService.removeFromCart(productId).subscribe();
		}
	}

	onClearCart(): void {
		if (confirm('Are you sure you want to clear your cart?')) {
			this.cartService.clearCart().subscribe();
		}
	}

	onCheckout(): void {
		// TODO: Implement checkout functionality
		console.log('Proceeding to checkout...');
	}

	// Helper methods to handle both populated and non-populated products
	getProduct(item: CartItem): Product | null {
		return typeof item.product === 'object' ? item.product : null;
	}

	getProductId(item: CartItem): string | null {
		return typeof item.product === 'string' ? item.product : (item.product as Product)?._id || null;
	}

	getProductName(item: CartItem): string {
		const product = this.getProduct(item);
		return product ? product.name : 'Product';
	}

	getProductImage(item: CartItem): string {
		const product = this.getProduct(item);
		return product ? product.image : '';
	}

	getProductPrice(item: CartItem): number {
		const product = this.getProduct(item);
		return product ? product.price : 0;
	}

	getProductDiscount(item: CartItem): number {
		const product = this.getProduct(item);
		return product?.discount || 0;
	}

	getProductDiscountedPrice(item: CartItem): number {
		const product = this.getProduct(item);
		return product?.discountedPrice || product?.price || 0;
	}

	getProductStockCount(item: CartItem): number {
		const product = this.getProduct(item);
		return product?.stockCount || 0;
	}

	// Calculate totals
	calculateTotalItems(items: CartItem[]): number {
		return items.reduce((sum, item) => sum + item.quantity, 0);
	}

	calculateTotalPrice(items: CartItem[]): number {
		return items.reduce((sum, item) => {
			const price = this.getProductDiscountedPrice(item);
			return sum + (price * item.quantity);
		}, 0);
	}
}
