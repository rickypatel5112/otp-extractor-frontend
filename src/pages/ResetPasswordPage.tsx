import {
	AlertCircle,
	ArrowLeft,
	Check,
	CheckCircle,
	Eye,
	EyeOff,
	ShieldAlert,
	XCircle,
} from "lucide-react";
import { type FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

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

	const allRequirementsMet = requirements.every((r) => r.test(password));
	const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;
	const isValid = password && confirmPassword && !passwordMismatch && allRequirementsMet;

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

				<div className="auth-footer" style={{ display: "flex", justifyContent: "center" }}>
					<Link
						to="/login"
						className="auth-link"
						style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
					>
						<ArrowLeft size={15} />
						Back to sign in
					</Link>
				</div>
			</div>
		</div>
	);
}
