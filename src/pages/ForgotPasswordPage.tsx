import { AlertCircle, ArrowLeft, Mail } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/useAuth";
import "./auth.css";

export default function ForgotPasswordPage() {
	const { forgotPassword } = useAuth();

	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [sent, setSent] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			await forgotPassword(email, "https://localhost:5173/reset-password");
			setSent(true);
		} catch {
			setError("Something went wrong. Please try again.");
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

				{sent ? (
					<div className="reset-success">
						<div className="reset-success-icon">
							<Mail size={28} />
						</div>
						<h1 className="auth-heading">Check your email</h1>
						<p className="auth-subheading" style={{ marginBottom: 0 }}>
							We have sent a password reset link to <strong>{email}</strong>. Check your inbox and
							follow the instructions.
						</p>
						<p className="form-hint" style={{ textAlign: "center", marginTop: 8 }}>
							Did not receive it? Check your spam folder or{" "}
							<button
								type="button"
								className="auth-link"
								style={{
									background: "none",
									border: "none",
									cursor: "pointer",
									padding: 0,
									font: "inherit",
								}}
								onClick={() => {
									setSent(false);
								}}
							>
								try again
							</button>
							.
						</p>
						<Link
							to="/login"
							className="btn-primary"
							style={{
								textDecoration: "none",
								textAlign: "center",
								marginTop: 8,
							}}
						>
							Back to sign in
						</Link>
					</div>
				) : (
					<>
						<h1 className="auth-heading">Forgot password?</h1>
						<p className="auth-subheading">Enter your email and we will send you a reset link</p>

						{error && (
							<div className="auth-alert auth-alert-error" role="alert">
								<AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
								{error}
							</div>
						)}

						<form className="auth-form" onSubmit={handleSubmit} noValidate>
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

							<button type="submit" className="btn-primary" disabled={loading || !email}>
								{loading && <span className="spinner" />}
								{loading ? "Sending…" : "Send reset link"}
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
					</>
				)}
			</div>
		</div>
	);
}
