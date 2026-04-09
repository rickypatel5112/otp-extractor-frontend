import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/useAuth";

export default function HomePage() {
	const { user } = useAuth();
	const navigate = useNavigate();

	return (
		<div>
			<h1>Welcome, {user?.name}</h1>
			<button type="button" onClick={() => navigate("/logout")}>
				Logout
			</button>
		</div>
	);
}
