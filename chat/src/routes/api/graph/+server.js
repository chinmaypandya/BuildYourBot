import redis from '$lib/redis';

export async function GET({ url }) {
	const graphId = url.searchParams.get('graphId'); 

	if (!graphId) {
		return new Response('Missing graphId', { status: 400 });
	}

	const pattern = `sessions-${graphId}-*`;

	try {
		const keys = await redis.keys(pattern);

		const sessionIds = keys.map((key) => {
			const parts = key.split('-');
			return parts[parts.length - 1]; 
		});

		return new Response(JSON.stringify(sessionIds), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		return new Response('Error retrieving session keys', { status: 500 });
	}
}

export async function POST({ request }) {
	const { graphId, sessionId } = await request.json();

	if (!graphId || !sessionId) {
		return new Response('Invalid payload: missing graphId, sessionId or sessionName', {
			status: 400
		});
	}

	const key = `sessions-${graphId}`;
	let sessions = await redis.get(key);
	sessions = sessions ? JSON.parse(sessions) : [];

	// Add the new session to the session list
	const newSession = { id: sessionId, title: sessionId };
	sessions.push(newSession);

	// Save the updated sessions back into Redis
	await redis.set(key, JSON.stringify(sessions));
	return new Response(JSON.stringify({ success: true, newSession }), {
		headers: { 'Content-Type': 'application/json' }
	});
}
