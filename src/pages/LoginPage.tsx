import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../context/useAuth";
import "./auth.css";

export default function LoginPage() {
	const { login, isAuthenticated } = useAuth();
	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [remember, setRemember] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	if (isAuthenticated) {
		return <Navigate to="/home" replace />;
	}

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			await login(email, password);
			navigate("/home");
		} catch {
			setError("Invalid email or password. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="auth-page">
			<div className="auth-card">
				<Link to="/" className="auth-logo">
					<span className="auth-logo-icon">⚡</span>
					<span className="auth-logo-text">OTP Extractor</span>
				</Link>

				<h1 className="auth-heading">Welcome!</h1>
				<p className="auth-subheading">Sign in to your account to continue</p>

				{error && (
					<div className="auth-alert auth-alert-error" role="alert">
						<AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
						{error}
					</div>
				)}

				<form className="auth-form" onSubmit={handleSubmit} noValidate>
					<div className="form-field">
						<label className="form-label" htmlFor="email">
							Email
						</label>
						<input
							id="email"
							type="email"
							className="form-input"
							placeholder="you@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							autoComplete="email"
							required
						/>
					</div>

					<div className="form-field">
						<label className="form-label" htmlFor="password">
							Password
						</label>
						<div className="form-input-wrapper">
							<input
								id="password"
								type={showPassword ? "text" : "password"}
								className="form-input"
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								autoComplete="current-password"
								required
							/>
							<button
								type="button"
								className="input-toggle-btn"
								onClick={() => setShowPassword((v) => !v)}
								aria-label={showPassword ? "Hide password" : "Show password"}
							>
								{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
							</button>
						</div>
					</div>

					<div className="form-row">
						<label className="form-checkbox-label">
							<input
								type="checkbox"
								checked={remember}
								onChange={(e) => setRemember(e.target.checked)}
							/>
							Remember me
						</label>
						<Link to="/forgot-password" className="auth-link">
							Forgot password?
						</Link>
					</div>

					<button type="submit" className="btn-primary" disabled={loading || !email || !password}>
						{loading && <span className="spinner" />}
						{loading ? "Signing in…" : "Sign in"}
					</button>
				</form>

				<div className="auth-footer">
					Do not have an account?{" "}
					<Link to="/register" className="auth-link">
						Create one
					</Link>
				</div>
			</div>
		</div>
	);
}
