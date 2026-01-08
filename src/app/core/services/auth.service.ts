import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { AuthResponse, LoginCredentials, RegisterData, User } from '../../shared/model/user.model';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	readonly baseUrl = 'http://localhost:5000/api';

	private currentUserSubject = new BehaviorSubject<User | null>(null);
	public currentUser$ = this.currentUserSubject.asObservable();
	public isAuthenticated = signal(false);

	constructor(private http: HttpClient, private router: Router) {
		this.loadUserFromStorage();
	}

	// Load user from localStorage
	private loadUserFromStorage(): void {
		const token = localStorage.getItem('token');
		const userJson = localStorage.getItem('user');
		
		if (token && userJson) {
			try {
				const user = JSON.parse(userJson) as User;
				this.currentUserSubject.next(user);
				this.isAuthenticated.set(true);
			} catch (error) {
				console.error('Error parsing user from storage:', error);
				this.logout();
			}
		}
	}

	// Register new user
	register(registerData: RegisterData): Observable<AuthResponse> {
		return this.http.post<AuthResponse>(`${this.baseUrl}/users/register`, registerData).pipe(
			tap(response => {
				this.handleAuthResponse(response);
			}),
			catchError(error => {
				console.error('Registration error:', error);
				throw error;
			})
		);
	}

	// Login user
	login(credentials: LoginCredentials): Observable<AuthResponse> {
		return this.http.post<AuthResponse>(`${this.baseUrl}/users/login`, credentials).pipe(
			tap(response => {
				this.handleAuthResponse(response);
			}),
			catchError(error => {
				console.error('Login error:', error);
				throw error;
			})
		);
	}

	// Handle authentication response
	private handleAuthResponse(response: AuthResponse): void {
		// Save token
		localStorage.setItem('token', response.token);
		
		// Save user data
		const user: User = {
			_id: response._id,
			firstName: response.firstName,
			lastName: response.lastName,
			email: response.email,
			isAdmin: response.isAdmin,
		};
		localStorage.setItem('user', JSON.stringify(user));
		
		// Update observables
		this.currentUserSubject.next(user);
		this.isAuthenticated.set(true);
	}

	// Logout
	logout(): void {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		this.currentUserSubject.next(null);
		this.isAuthenticated.set(false);
		this.router.navigate(['/login']);
	}

	// Get current user
	getCurrentUser(): User | null {
		return this.currentUserSubject.value;
	}

	// Get auth token
	getToken(): string | null {
		return localStorage.getItem('token');
	}

	// Check if user is authenticated
	isLoggedIn(): boolean {
		return this.isAuthenticated();
	}

	// Check if user is admin
	isAdmin(): boolean {
		const user = this.getCurrentUser();
		return user?.isAdmin || false;
	}

	// Get user profile
	getUserProfile(): Observable<User> {
		const token = this.getToken();
		return this.http.get<User>(`${this.baseUrl}/users/profile`, {
			headers: { Authorization: `Bearer ${token}` }
		}).pipe(
			tap(user => {
				localStorage.setItem('user', JSON.stringify(user));
				this.currentUserSubject.next(user);
			}),
			catchError(error => {
				console.error('Error fetching user profile:', error);
				if (error.status === 401) {
					this.logout();
				}
				throw error;
			})
		);
	}
}
