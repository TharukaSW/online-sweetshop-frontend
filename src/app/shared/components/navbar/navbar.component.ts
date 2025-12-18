import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  isMenuOpen = false;
  cartCount = 0;

  links: Array<{ label: string; path: string }> = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/product-list' },
    { label: 'Manage Products', path: '/manage-products' },
    { label: 'Manage Categories', path: '/manage-categories' },
  ];

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }
}
