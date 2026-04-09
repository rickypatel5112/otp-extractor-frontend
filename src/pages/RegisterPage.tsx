import { AlertCircle, CheckCircle, Eye, EyeOff, XCircle } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/useAuth";
import "./auth.css";

const requirements = [
	{ label: "At least 8 characters", test: (v: string) => v.length >= 8 },
	{
		label: "At least one uppercase letter",
		test: (v: string) => /[A-Z]/.test(v),
	},
	{
		label: "At least one lowercase letter",
		test: (v: string) => /[a-z]/.test(v),
	},
	{ label: "At least one number", test: (v: string) => /[0-9]/.test(v) },
	{
		label: "At least one special character",
		test: (v: string) => /[^A-Za-z0-9]/.test(v),
	},
	{ label: "No spaces", test: (v: string) => v.length > 0 && !/\s/.test(v) },
];

export default function RegisterPage() {
	const { register } = useAuth();
	const navigate = useNavigate();

	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const allRequirementsMet = requirements.every((r) => r.test(password));
	const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}
		if (!allRequirementsMet) {
			setError("Please meet all password requirements.");
			return;
		}
		setError("");
		setLoading(true);
		try {
			await register(firstname, lastname, email, password);
			navigate("/login");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const isValid =
		firstname && lastname && email && allRequirementsMet && confirmPassword && !passwordMismatch;

	return (
		<div className="auth-page">
			<div className="auth-card">
				<Link to="/" className="auth-logo">
					<span className="auth-logo-icon">⚡</span>
					<span className="auth-logo-text">OTP Extractor</span>
				</Link>

				<h1 className="auth-heading">Create an account</h1>
				<p className="auth-subheading">Start extracting OTPs in seconds</p>

				{error && (
					<div className="auth-alert auth-alert-error" role="alert">
						<AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
						{error}
					</div>
				)}

				<form className="auth-form" onSubmit={handleSubmit} noValidate>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr",
							gap: "16px",
						}}
					>
						<div className="form-field">
							<label className="form-label" htmlFor="firstname">
								First name
							</label>
							<input
								id="firstname"
								type="text"
								className="form-input"
								placeholder="John"
								value={firstname}
								onChange={(e) => setFirstname(e.target.value)}
								autoComplete="given-name"
								required
							/>
						</div>

						<div className="form-field">
							<label className="form-label" htmlFor="lastname">
								Last name
							</label>
							<input
								id="lastname"
								type="text"
								className="form-input"
								placeholder="Doe"
								value={lastname}
								onChange={(e) => setLastname(e.target.value)}
								autoComplete="family-name"
								required
							/>
						</div>
					</div>

					<div className="form-field">
						<label className="form-label" htmlFor="email">
							Email address
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
								autoComplete="new-password"
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

						{password.length > 0 && (
							<ul
								style={{
									listStyle: "none",
									padding: 0,
									margin: "8px 0 0",
									display: "flex",
									flexDirection: "column",
									gap: 4,
								}}
							>
								{requirements.map((req) => {
									const pass = req.test(password);
									return (
										<li
											key={req.label}
											style={{
												display: "flex",
												alignItems: "center",
												gap: 6,
												fontSize: 13,
												color: pass ? "#1D9E75" : "#E24B4A",
												transition: "color 0.15s",
											}}
										>
											{pass ? (
												<CheckCircle size={14} style={{ flexShrink: 0 }} />
											) : (
												<XCircle size={14} style={{ flexShrink: 0 }} />
											)}
											{req.label}
										</li>
									);
								})}
							</ul>
						)}
					</div>

					<div className="form-field">
						<label className="form-label" htmlFor="confirm-password">
							Confirm password
						</label>
						<input
							id="confirm-password"
							type={showPassword ? "text" : "password"}
							className="form-input"
							placeholder="••••••••"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							autoComplete="new-password"
							required
						/>
						{passwordMismatch && <span className="form-error">Passwords do not match</span>}
					</div>

					<button type="submit" className="btn-primary" disabled={loading || !isValid}>
						{loading && <span className="spinner" />}
						{loading ? "Creating account…" : "Create account"}
					</button>
				</form>

				<div className="auth-footer">
					Already have an account?{" "}
					<Link to="/login" className="auth-link">
						Sign in
					</Link>
				</div>
			</div>
		</div>
	);
}
