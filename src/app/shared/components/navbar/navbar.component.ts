import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;
  
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  
  cartCount = this.cartService.cartCount;
  isAuthenticated = this.authService.isAuthenticated;
  currentUser$ = this.authService.currentUser$;

  links: Array<{ label: string; path: string }> = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/product-list' },
    { label: 'Manage Products', path: '/manage-products' },
    { label: 'Manage Categories', path: '/manage-categories' },
  ];

  ngOnInit(): void {
    // Services are already initialized and reactive
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  onLogout(): void {
    this.authService.logout();
    this.closeMenu();
  }
}
