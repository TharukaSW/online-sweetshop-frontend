import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
	selector: 'app-register',
	imports: [CommonModule, ReactiveFormsModule, RouterModule],
	templateUrl: './register.component.html',
	styleUrl: './register.component.css',
})
export class RegisterComponent {
	registerForm: FormGroup;
	errorMessage: string = '';
	isLoading: boolean = false;

	private authService = inject(AuthService);
	private router = inject(Router);
	private fb = inject(FormBuilder);

	constructor() {
		this.registerForm = this.fb.group({
			firstName: ['', [Validators.required, Validators.minLength(2)]],
			lastName: ['', [Validators.required, Validators.minLength(2)]],
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(8)]],
			confirmPassword: ['', [Validators.required]],
		}, { validators: this.passwordMatchValidator });
	}

	passwordMatchValidator(form: FormGroup) {
		const password = form.get('password');
		const confirmPassword = form.get('confirmPassword');
		
		if (password && confirmPassword && password.value !== confirmPassword.value) {
			confirmPassword.setErrors({ passwordMismatch: true });
			return { passwordMismatch: true };
		}
		return null;
	}

	onSubmit(): void {
		if (this.registerForm.invalid) {
			this.markFormGroupTouched(this.registerForm);
			return;
		}

		this.isLoading = true;
		this.errorMessage = '';

		const { confirmPassword, ...registerData } = this.registerForm.value;

		this.authService.register(registerData).subscribe({
			next: () => {
				this.isLoading = false;
				this.router.navigate(['/']);
			},
			error: (error) => {
				this.isLoading = false;
				this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
			},
		});
	}

	private markFormGroupTouched(formGroup: FormGroup): void {
		Object.keys(formGroup.controls).forEach(key => {
			const control = formGroup.get(key);
			control?.markAsTouched();
		});
	}

	get firstName() {
		return this.registerForm.get('firstName');
	}

	get lastName() {
		return this.registerForm.get('lastName');
	}

	get email() {
		return this.registerForm.get('email');
	}

	get password() {
		return this.registerForm.get('password');
	}

	get confirmPassword() {
		return this.registerForm.get('confirmPassword');
	}
}
