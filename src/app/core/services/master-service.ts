import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../../shared/model/category.model';
import { map } from 'rxjs';
import { Product } from '../../shared/model/product.model';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  readonly baseUrl = 'http://localhost:5000/api';


  constructor(private http: HttpClient) {}


  saveCategory(categoryData: Category) {
    return this.http.post(`${this.baseUrl}/categories`, categoryData);
  }

  getAllCategories() {
    return this.http.get<Category[]>(`${this.baseUrl}/categories/`).pipe(
      map((response: Category[]) => {
        return response;
      })
    );
  }

  saveProduct(productData: Product) {
    return this.http.post(`${this.baseUrl}/products`, productData);
  }

  getAllProducts() {
    return this.http.get<Product[]>(`${this.baseUrl}/products/`).pipe(
      map((response: Product[]) => {
        return response;
      })
    );
  }

	updateProduct(mongoId: string, productData: Partial<Product>) {
		return this.http.put(`${this.baseUrl}/products/${mongoId}`, productData);
	}

	deleteProduct(mongoId: string) {
		return this.http.delete(`${this.baseUrl}/products/${mongoId}`);
	}
}