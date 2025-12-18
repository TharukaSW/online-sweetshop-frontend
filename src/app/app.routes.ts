import { Routes } from '@angular/router';
import { DashboardComponenet } from './modules/admin/dashboard/dashboard';
import { ManageCategoriesComponent } from './modules/admin/manage-categories/categories.component';
import { ManageProductComponent } from './modules/admin/manage-product/manage-product.component';
import { ProductListComponent } from './modules/admin/product-list/product-list.component';
import { HomeComponent } from './modules/user/home/home.component';
import { AddProductComponent } from './modules/admin/add-product/addProduct.component';
import { ViewproductComponent } from './modules/admin/viewproduct/viewproduct.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'manage-categories',
        component: ManageCategoriesComponent
    },
    {
        path: 'add-product',
        component: AddProductComponent,
    },
    {
        path: 'product-list',
        component: ProductListComponent,
    },
    {
        path: 'manage-products',
        component: ManageProductComponent,
    },
    {
        path: 'product-details',
        component: ViewproductComponent,
    }

];
