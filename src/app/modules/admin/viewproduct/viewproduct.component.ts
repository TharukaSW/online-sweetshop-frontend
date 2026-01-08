import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ManageProductComponent } from '../manage-product/manage-product.component';
import { Observable } from 'rxjs';
import { Product } from '../../../shared/model/product.model';
import { ActivatedRoute } from '@angular/router';
import { MasterService } from '../../../core/services/master-service';

@Component({
  selector: 'app-viewproduct.component',
  imports: [CommonModule],
  templateUrl: './viewproduct.component.html',
  styleUrl: './viewproduct.component.css',
})
export class ViewproductComponent implements OnInit {


  product$!: Observable<Product>;

  route = inject(ActivatedRoute);
  masterService = inject(MasterService);

  ngOnInit(): void {
    this.product$ = this.masterService.getProductById(
      this.route.snapshot.params['id']
    )
  }




}
