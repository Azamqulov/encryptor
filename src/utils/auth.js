// src/utils/auth.js

export function checkCredentials(username, password) {
	const validUsers = [
		{ username: "admin", password: "12345" },
		{ username: "test", password: "qwerty" },
	];

	const isValid = validUsers.some((user) => user.username === username && user.password === password);

	if (isValid) {
		// Сохраняем токен в localStorage
		localStorage.setItem("user-token", "valid-token");
		return true;
	}
	return false;
}

export function isAuthenticated() {
	return !!localStorage.getItem("user-token");
}

export function logout() {
	localStorage.removeItem("user-token");
	localStorage.removeItem("savedUsername");
}

export function saveUsername(username) {
	if (username) {
		localStorage.setItem("savedUsername", username);
	}
}

export function getSavedUsername() {
	return localStorage.getItem("savedUsername");
}
