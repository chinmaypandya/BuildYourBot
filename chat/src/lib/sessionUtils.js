// Function to load sessions from localStorage
export function loadSessionsFromStorage(graphId) {
	const storedSessions = localStorage.getItem(`sessions-${graphId}-chat`);

	if (storedSessions) {
		const sessionsData = JSON.parse(storedSessions);
		return sessionsData.map((session) => ({
			id: session.sessionId,
			title: session.sessionId // Using sessionId as the title
		}));
	}

	// Return default sessions if no data found in localStorage
	return [
		{ id: 'session1', title: 'New chat' },
		{ id: 'session2', title: 'Project Discussion' }
	];
}

// Function to force a page reload
export function forcePageReload(event) {
	event.preventDefault();
	window.location.href = event.target.href;
}
