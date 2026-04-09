import { useAuth } from "../context/useAuth";

export default function HomePage() {
	const { user, logout } = useAuth();

	return (
		<div>
			<h1>Welcome, {user?.name}</h1>
			<button type={"button"} onClick={logout}>
				Logout
			</button>
		</div>
	);
}
