import { Product } from './product.model';

export interface CartItem {
	_id?: string;
	product: Product | string; // Can be populated Product or just productId
	quantity: number;
}

export interface Cart {
	_id?: string;
	user?: string;
	items: CartItem[];
	createdAt?: Date;
	updatedAt?: Date;
}
