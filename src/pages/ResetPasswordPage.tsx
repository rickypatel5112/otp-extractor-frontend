import { AlertCircle, ArrowLeft, Check, Eye, EyeOff, ShieldAlert } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { useAuth } from "../context/useAuth";
import "./auth.css";

function getPasswordStrength(password: string): 0 | 1 | 2 | 3 | 4 {
	if (!password) return 0;
	let score = 0;
	if (password.length >= 8) score++;
	if (/[A-Z]/.test(password)) score++;
	if (/[0-9]/.test(password)) score++;
	if (/[^A-Za-z0-9]/.test(password)) score++;
	return score as 0 | 1 | 2 | 3 | 4;
}

const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
const strengthClasses = ["", "active-weak", "active-fair", "active-good", "active-strong"];

export default function ResetPasswordPage() {
	const { resetPassword } = useAuth();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token") ?? "";

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [done, setDone] = useState(false);
	const [error, setError] = useState("");

	const strength = getPasswordStrength(password);
	const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;
	const isValid = password && confirmPassword && !passwordMismatch && strength >= 2;

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}
		if (strength < 2) {
			setError("Please choose a stronger password.");
			return;
		}
		setError("");
		setLoading(true);
		try {
			await resetPassword(token, password);
			setDone(true);
		} catch {
			setError("Reset link is invalid or expired. Please request a new one.");
		} finally {
			setLoading(false);
		}
	};

	if (!token) {
		return (
			<div className="auth-page">
				<div className="auth-card">
					<Link to="/" className="auth-logo">
						<span className="auth-logo-icon">⚡</span>
						<span className="auth-logo-text">OTP Extractor</span>
					</Link>
					<div className="reset-success">
						<div
							className="reset-success-icon"
							style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}
						>
							<ShieldAlert size={28} />
						</div>
						<h1 className="auth-heading">Invalid link</h1>
						<p className="auth-subheading" style={{ marginBottom: 0 }}>
							This reset link is missing a token. Please request a new one.
						</p>
						<Link
							to="/forgot-password"
							className="btn-primary"
							style={{
								textDecoration: "none",
								textAlign: "center",
								marginTop: 8,
							}}
						>
							Request new link
						</Link>
					</div>
				</div>
			</div>
		);
	}

	if (done) {
		return (
			<div className="auth-page">
				<div className="auth-card">
					<Link to="/" className="auth-logo">
						<span className="auth-logo-icon">⚡</span>
						<span className="auth-logo-text">OTP Extractor</span>
					</Link>
					<div className="reset-success">
						<div className="reset-success-icon">
							<Check size={28} />
						</div>
						<h1 className="auth-heading">Password reset!</h1>
						<p className="auth-subheading" style={{ marginBottom: 0 }}>
							Your password has been updated successfully. You can now sign in with your new
							password.
						</p>
						<button
							type="button"
							className="btn-primary"
							style={{ marginTop: 8 }}
							onClick={() => navigate("/login")}
						>
							Sign in
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="auth-page">
			<div className="auth-card">
				<Link to="/" className="auth-logo">
					<span className="auth-logo-icon">⚡</span>
					<span className="auth-logo-text">OTP Extractor</span>
				</Link>

				<h1 className="auth-heading">Reset password</h1>
				<p className="auth-subheading">Choose a strong new password for your account</p>

				{error && (
					<div className="auth-alert auth-alert-error" role="alert">
						<AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
						{error}
					</div>
				)}

				<form className="auth-form" onSubmit={handleSubmit} noValidate>
					<div className="form-field">
						<label className="form-label" htmlFor="password">
							New password
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
							<>
								<div className="password-strength">
									{[1, 2, 3, 4].map((level) => (
										<div
											key={level}
											className={`strength-bar ${strength >= level ? strengthClasses[strength] : ""}`}
										/>
									))}
								</div>
								<span className="strength-label">{strengthLabels[strength]}</span>
							</>
						)}
						<span className="form-hint">Min 8 chars, include uppercase, number, and symbol</span>
					</div>

					<div className="form-field">
						<label className="form-label" htmlFor="confirm-password">
							Confirm new password
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
						{loading ? "Resetting…" : "Reset password"}
					</button>
				</form>

				<div className="auth-footer">
					<Link
						to="/login"
						className="auth-link"
						style={{ display: "flex", alignItems: "center", gap: 6 }}
					>
						<ArrowLeft size={15} />
						Back to sign in
					</Link>
				</div>
			</div>
		</div>
	);
}
