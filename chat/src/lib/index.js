export function parseCookies() {
	const cookies = document.cookie.split(';').reduce((acc, cookie) => {
		const [key, value] = cookie.trim().split('=');
		acc[key] = decodeURIComponent(value);
		return acc;
	}, {});
	return cookies;
}

// Decode JWT to extract payload
export function decodeJWT(token) {
	try {
		const base64Url = token.split('.')[1];
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split('')
				.map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
				.join('')
		);
		return JSON.parse(jsonPayload);
	} catch (error) {
		console.error('Invalid token format', error);
		return null;
	}
}

export async function checkUserGraphs(graphId) {
  const cookies = parseCookies();
	const graphToken = cookies.graph_token ? decodeJWT(cookies.graph_token) : null;
	const sessionToken = cookies.session_token ? decodeJWT(cookies.session_token) : null;

	if (!graphToken || !sessionToken) {
		return { isAuthorized: false, redirectTo: '/error' };
	}
	try {
		const response = await fetch('http://localhost:3002/api/auth/verify-token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${cookies.graph_token}`
			}
		});
		if (response.status !== 200) {
			return { isAuthorized: false, redirectTo: '/error' };
		}
    const { userId: graphUserId, graphIds } = graphToken;
    const { userId: sessionUserId } = sessionToken;
  
    if (graphUserId !== sessionUserId || !graphIds.includes(graphId)) {
      return { isAuthorized: false, redirectTo: '/error' };
    }
  
    return { isAuthorized: true };
	} catch (error) {
		console.error('Error during token verification:', error);
		return { isAuthorized: false, redirectTo: '/error' };
	}
}
