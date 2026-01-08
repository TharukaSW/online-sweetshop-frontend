import { Component, inject, Input } from '@angular/core';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card';
import { Product } from '../../../shared/model/product.model';
import { MasterService } from '../../../core/services/master-service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list.component',
  imports: [ProductCardComponent, CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent {
  
  service = inject(MasterService);

  products!: Observable<Product[]>

  constructor(){
    this.products = this.service.getAllProducts();
  }
}
