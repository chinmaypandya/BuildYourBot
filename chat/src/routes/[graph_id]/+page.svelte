<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';

	// Import utility functions
	import { loadSessionsFromStorage, forcePageReload } from '$lib/sessionUtils.js';

	import './page_styles.css';

	const graphId = $page.params.graph_id;
	let newSessionName = '';

	// Store to manage the session list
	export let sessions = writable([]);

	// Load sessions from localStorage when the component is mounted
	onMount(() => {
		const loadedSessions = loadSessionsFromStorage(graphId);
		sessions.set(loadedSessions); // Set the store with the loaded sessions
	});

	// Create a new session and add it to the session list
	function createNewSession() {
		if (newSessionName) {
			const sessionId = newSessionName.replace(/\s+/g, '-').toLowerCase();
			const newSession = { id: sessionId, title: newSessionName };

			// Update the session list and navigate to the new session
			sessions.update((sessionList) => [...sessionList, newSession]);
			goto(`/${graphId}/${sessionId}`);
		}
	}
</script>

<div class="container">
	<h1>Graph {graphId}</h1>

	<!-- Input to create a new session -->
	<div class="input-container-session">
		<input type="text" placeholder="Enter new session name" bind:value={newSessionName} />
		<button on:click={createNewSession}>Create Session</button>
	</div>

	<!-- Session list -->
	<div class="graph-session-list">
		{#each $sessions as session}
			<div class="graph-session-item">
				<a href={`/${graphId}/${session.id}`} on:click={forcePageReload} aria-label="Go to session">
					{session.title}
				</a>
			</div>
		{/each}
	</div>
</div>
