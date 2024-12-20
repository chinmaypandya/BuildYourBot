import redis from "$lib/redis";
export async function GET({ url }) {
  const graphId = url.searchParams.get('graphId');
  const sessionId = url.searchParams.get('sessionId');

  if (!graphId || !sessionId) {
    return new Response('Missing graphId or sessionId', { status: 400 });
  }

  const key = `sessions-${graphId}-${sessionId}`;
  const chatHistory = await redis.get(key);

  return new Response(JSON.stringify(chatHistory ? JSON.parse(chatHistory) : []), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST({ request }) {
  const { graphId, sessionId, messages } = await request.json();

  if (!graphId || !sessionId || !messages) {
    return new Response('Invalid payload', { status: 400 });
  }

  const key = `sessions-${graphId}-${sessionId}`;
  await redis.set(key, JSON.stringify(messages));

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
