export interface User {
	_id: string;
	firstName: string;
	lastName: string;
	email: string;
	isAdmin: boolean;
	isSuperAdmin?: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface AuthResponse {
	_id: string;
	firstName: string;
	lastName: string;
	email: string;
	isAdmin: boolean;
	token: string;
}

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface RegisterData {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}
