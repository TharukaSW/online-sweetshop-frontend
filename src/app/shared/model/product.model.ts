
export interface Product {
	_id: string;
	id: string;
	name: string;
	price: number;
	stockCount: number;
	image: string;
	shortDescription: string;
	description: string;
	category: string;
	demand: string;
	featured: boolean;
	isNewProduct: boolean;
	isLimited: boolean;
	ingredients: string[];
	discount: number;
	season: string;
	rating: number;
	reviews: number;
	expiryDate: string;
	createdAt: string;
	updatedAt: string;
	discountedPrice: number;
	
}
