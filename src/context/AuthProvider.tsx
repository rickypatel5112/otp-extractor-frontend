import { type ReactNode, useState } from "react";

import { AuthContext, type User } from "./AuthContext";

const BASE_URL = "https://auth.localhost/api/v1/auth";

function parseJwt(token: string): Record<string, unknown> {
	try {
		const payload = token.split(".")[1];
		return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
	} catch {
		return {};
	}
}

interface ApiResponse<T = unknown> {
	status: number;
	message: string;
	data: T | null;
	timestamp: string;
}

async function apiFetch<T = unknown>(
	path: string,
	options: RequestInit = {},
	requiresAuth = true
): Promise<ApiResponse<T>> {
	const token = requiresAuth ? localStorage.getItem("accessToken") : null;
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		...(token ? { Authorization: `Bearer ${token}` } : {}),
		...((options.headers as Record<string, string>) ?? {}),
	};

	const res = await fetch(`${BASE_URL}${path}`, {
		...options,
		headers,
		credentials: "include",
	});

	const text = await res.text();
	let body: ApiResponse<T> | null = null;
	try {
		body = text ? JSON.parse(text) : null;
	} catch {
		throw new Error(text || res.statusText || "Request failed");
	}

	if (!res.ok) {
		// For validation errors, data is { field: string[] }
		if (body?.data && typeof body.data === "object") {
			const fieldErrors = Object.entries(body.data as Record<string, string[]>)
				.map(([field, errors]) => `${field}: ${errors.join(", ")}`)
				.join("\n");
			throw new Error(fieldErrors);
		}
		throw new Error(body?.message ?? res.statusText ?? "Request failed");
	}

	// biome-ignore lint/style/noNonNullAssertion: body is guaranteed to exist at this point
	return body!;
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(() => {
		const stored = localStorage.getItem("user");
		return stored ? JSON.parse(stored) : null;
	});

	const register = async (firstname: string, lastname: string, email: string, password: string) => {
		await apiFetch(
			"/register",
			{
				method: "POST",
				body: JSON.stringify({ firstname, lastname, email, password }),
			},
			false
		);
	};

	const login = async (email: string, password: string) => {
		const res = await apiFetch<{ accessToken: string }>(
			"/login",
			{
				method: "POST",
				body: JSON.stringify({ email, password }),
			},
			false
		);

		const accessToken = res.data?.accessToken;
		if (!accessToken) throw new Error("Login failed");

		localStorage.setItem("accessToken", accessToken);

		const claims = parseJwt(accessToken);
		const currentUser: User = {
			id: String(claims.sub ?? claims.id ?? ""),
			email: String(claims.email ?? claims.sub ?? email),
			name:
				[claims.firstname, claims.lastname].filter(Boolean).join(" ") ||
				String(claims.name ?? email.split("@")[0]),
		};

		localStorage.setItem("user", JSON.stringify(currentUser));
		setUser(currentUser);
	};

	const logout = async () => {
		try {
			await apiFetch("/logout", { method: "POST" });
		} catch {
			// ignore remote errors, still clear local state
		} finally {
			localStorage.removeItem("accessToken");
			localStorage.removeItem("user");
			setUser(null);
		}
	};

	const forgotPassword = async (email: string) => {
		await apiFetch("/forgot-password", {
			method: "POST",
			body: JSON.stringify({ email }),
		});
	};

	const resetPassword = async (token: string, password: string) => {
		await apiFetch(`/reset-password?token=${encodeURIComponent(token)}`, {
			method: "POST",
			body: JSON.stringify({ newPassword: password }),
		});
	};

	const deleteAccount = async () => {
		await apiFetch("/delete-account/me", { method: "DELETE" });
		localStorage.removeItem("accessToken");
		localStorage.removeItem("user");
		setUser(null);
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated: user !== null,
				login,
				register,
				logout,
				forgotPassword,
				resetPassword,
				deleteAccount,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
