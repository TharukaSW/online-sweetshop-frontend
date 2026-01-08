import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
	selector: 'app-login',
	imports: [CommonModule, ReactiveFormsModule, RouterModule],
	templateUrl: './login.component.html',
	styleUrl: './login.component.css',
})
export class LoginComponent {
	loginForm: FormGroup;
	errorMessage: string = '';
	isLoading: boolean = false;

	private authService = inject(AuthService);
	private router = inject(Router);
	private fb = inject(FormBuilder);

	constructor() {
		this.loginForm = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(8)]],
		});
	}

	onSubmit(): void {
		if (this.loginForm.invalid) {
			this.markFormGroupTouched(this.loginForm);
			return;
		}

		this.isLoading = true;
		this.errorMessage = '';

		this.authService.login(this.loginForm.value).subscribe({
			next: () => {
				this.isLoading = false;
				// Reload cart after login
				this.router.navigate(['/']);
			},
			error: (error) => {
				this.isLoading = false;
				this.errorMessage = error.error?.message || 'Login failed. Please try again.';
			},
		});
	}

	private markFormGroupTouched(formGroup: FormGroup): void {
		Object.keys(formGroup.controls).forEach(key => {
			const control = formGroup.get(key);
			control?.markAsTouched();
		});
	}

	get email() {
		return this.loginForm.get('email');
	}

	get password() {
		return this.loginForm.get('password');
	}
}
