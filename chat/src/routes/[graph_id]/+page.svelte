<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import './page_styles.css';
	import { sessions, loadSessions, PageReload, createSession } from '$lib/session';

	const graphId = $page.params.graph_id;
	let newSessionName = '';

	// Load sessions from Redis when the component is mounted
	onMount(() => {
		const loadedSessions = loadSessions(graphId);
		sessions.set(loadedSessions); 
	});
</script>

<div class="container">
	<h1>Graph {graphId}</h1>

	<!-- Input to create a new session -->
	<div class="input-container-session">
		<input type="text" placeholder="Enter new session name" bind:value={newSessionName} />
		<button on:click={createSession(graphId, newSessionName)}>Create Session</button>
	</div>

	<!-- Session list -->
	<div class="graph-session-list">
		{#each $sessions as session}
			<div class="graph-session-item">
				<a href={`/${graphId}/${session.id}`} on:click={PageReload} aria-label="Go to session">
					{session.title}
				</a>
			</div>
		{/each}
	</div>
</div>
