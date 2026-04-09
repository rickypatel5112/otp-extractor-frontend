import { LogOut } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/useAuth";
import "./auth.css";

export default function LogoutPage() {
	const { logout, isAuthenticated } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isAuthenticated) {
			navigate("/login", { replace: true });
		}
	}, [isAuthenticated, navigate]);

	const handleLogout = async () => {
		await logout();
		navigate("/login", { replace: true });
	};

	const handleCancel = () => {
		navigate(-1);
	};

	return (
		<div className="auth-page">
			<div className="auth-card">
				<Link to="/" className="auth-logo">
					<span className="auth-logo-icon">⚡</span>
					<span className="auth-logo-text">OTP Extractor</span>
				</Link>

				<div className="logout-icon">
					<LogOut size={30} />
				</div>

				<h1 className="auth-heading">Sign out?</h1>
				<p className="auth-subheading">You will be signed out of your account on this device</p>

				<div className="logout-actions">
					<button type="button" className="btn-primary" onClick={handleLogout}>
						Yes, sign out
					</button>
					<button type="button" className="btn-secondary" onClick={handleCancel}>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
}
