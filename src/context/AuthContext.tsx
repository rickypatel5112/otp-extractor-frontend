import { createContext } from "react";

export interface User {
	id: string;
	email: string;
	name: string;
}

export interface AuthContextValue {
	user: User | null;
	isAuthenticated: boolean;
	login: (email: string, password: string) => Promise<void>;
	register: (firstname: string, lastname: string, email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	forgotPassword: (email: string, passwordResetUrl: string) => Promise<void>;
	resetPassword: (token: string, newPassword: string) => Promise<void>;
	deleteAccount: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
