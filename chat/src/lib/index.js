export function parseCookies() {
	const cookies = document.cookie.split(';').reduce((acc, cookie) => {
		const [key, value] = cookie.trim().split('=');
		acc[key] = decodeURIComponent(value);
		return acc;
	}, {});
	return cookies;
}
