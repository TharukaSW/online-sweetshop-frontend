import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { Cart, CartItem } from '../../shared/model/cart.model';
import { Product } from '../../shared/model/product.model';

@Injectable({
	providedIn: 'root',
})
export class CartService {
	readonly baseUrl = 'http://localhost:5000/api';

	private cartSubject = new BehaviorSubject<Cart>({
		items: [],
	});

	cart$ = this.cartSubject.asObservable();
	cartCount = signal(0);

	constructor(private http: HttpClient) {
		this.loadCart();
	}

	// Load cart from server
	loadCart(): void {
		const token = this.getAuthToken();
		if (!token) {
			// If not authenticated, just use empty cart
			this.cartSubject.next({ items: [] });
			this.cartCount.set(0);
			return;
		}

		this.http.get<Cart>(`${this.baseUrl}/cart`, {
			headers: { Authorization: `Bearer ${token}` }
		}).pipe(
			catchError((error) => {
				console.error('Error loading cart:', error);
				return of({ items: [] } as Cart);
			})
		).subscribe(cart => {
			this.cartSubject.next(cart);
			this.cartCount.set(this.calculateTotalItems(cart.items));
		});
	}

	// Get authentication token from localStorage
	private getAuthToken(): string | null {
		return localStorage.getItem('token');
	}

	// Calculate total items in cart
	private calculateTotalItems(items: CartItem[]): number {
		return items.reduce((sum, item) => sum + item.quantity, 0);
	}

	// Add item to cart
	addToCart(productId: string, quantity: number = 1): Observable<Cart> {
		const token = this.getAuthToken();
		if (!token) {
			console.error('User not authenticated');
			return of({ items: [] } as Cart);
		}

		return this.http.post<Cart>(`${this.baseUrl}/cart/add`, 
			{ productId, quantity },
			{ headers: { Authorization: `Bearer ${token}` } }
		).pipe(
			tap(cart => {
				this.cartSubject.next(cart);
				this.cartCount.set(this.calculateTotalItems(cart.items));
			}),
			catchError((error) => {
				console.error('Error adding to cart:', error);
				return of(this.cartSubject.value);
			})
		);
	}

	// Update item quantity
	updateQuantity(productId: string, quantity: number): Observable<Cart> {
		const token = this.getAuthToken();
		if (!token) {
			console.error('User not authenticated');
			return of({ items: [] } as Cart);
		}

		if (quantity <= 0) {
			return this.removeFromCart(productId);
		}

		return this.http.put<Cart>(`${this.baseUrl}/cart/update`,
			{ productId, quantity },
			{ headers: { Authorization: `Bearer ${token}` } }
		).pipe(
			tap(cart => {
				this.cartSubject.next(cart);
				this.cartCount.set(this.calculateTotalItems(cart.items));
			}),
			catchError((error) => {
				console.error('Error updating cart:', error);
				return of(this.cartSubject.value);
			})
		);
	}

	// Remove item from cart
	removeFromCart(productId: string): Observable<Cart> {
		const token = this.getAuthToken();
		if (!token) {
			console.error('User not authenticated');
			return of({ items: [] } as Cart);
		}

		return this.http.request<Cart>('DELETE', `${this.baseUrl}/cart/remove`, {
			headers: { Authorization: `Bearer ${token}` },
			body: { productId }
		}).pipe(
			tap(cart => {
				this.cartSubject.next(cart);
				this.cartCount.set(this.calculateTotalItems(cart.items));
			}),
			catchError((error) => {
				console.error('Error removing from cart:', error);
				return of(this.cartSubject.value);
			})
		);
	}

	// Clear cart
	clearCart(): Observable<Cart> {
		const token = this.getAuthToken();
		if (!token) {
			console.error('User not authenticated');
			return of({ items: [] } as Cart);
		}

		return this.http.delete<Cart>(`${this.baseUrl}/cart/clear`, {
			headers: { Authorization: `Bearer ${token}` }
		}).pipe(
			tap(cart => {
				this.cartSubject.next(cart);
				this.cartCount.set(0);
			}),
			catchError((error) => {
				console.error('Error clearing cart:', error);
				return of(this.cartSubject.value);
			})
		);
	}

	// Get current cart
	getCart(): Observable<Cart> {
		return this.cart$;
	}

	// Get cart count
	getCartCount(): number {
		return this.cartCount();
	}
}
