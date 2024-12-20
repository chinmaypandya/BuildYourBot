
import { writable } from 'svelte/store';
import { goto } from '$app/navigation';
// Store to manage sessions globally
export const sessions = writable([]);


export async function loadSessions(graphId) {
    try {
        const response = await fetch(`/api/graph?graphId=${graphId}`);
        if (response.ok) {
            const sessionIds = await response.json();
            sessions.set(sessionIds.map((id) => ({ id, title: id })));
        } else {
            console.error('Failed to load sessions');
        }
    } catch (error) {
        console.error('Error fetching sessions:', error);
    }
}

export function PageReload(event) {
    event.preventDefault();
    window.location.href = event.target.href;
  }

export async function createSession(graphId, newSessionName) {
    if (newSessionName.trim()) {
        const newSession = { graphId, sessionId: newSessionName.trim() };

        try {
            const response = await fetch(`/api/graph`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSession)
            });

            if (response.ok) {
                const { newSession } = await response.json();
                sessions.update((sessionList) => [...sessionList, newSession]); 
                goto(`/${graphId}/${newSession.id}`); 
            } else {
                console.error('Failed to create session');
            }
        } catch (error) {
            console.error('Error creating session:', error);
        }
    } else {
        console.error('Session name cannot be empty');
    }
}