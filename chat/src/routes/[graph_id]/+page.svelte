<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import './page_styles.css';
	import { sessions, loadSessions, PageReload, createSession } from '$lib/session';
	import { parseCookies, decodeJWT, checkUserGraphs } from '$lib';

	let isLegit = true;
	const graphId = $page.params.graph_id;
	let newSessionName = '';

	onMount(async () => {
		try {
			const { isAuthorized, redirectTo } = await checkUserGraphs(graphId);
			if (!isAuthorized) {
				isLegit = false;
				goto(redirectTo);
				return;
			}

			// Load sessions if authorized
			const loadedSessions = loadSessions(graphId);
			sessions.set(loadedSessions);
		} catch (error) {
			console.error('Error in checkUserGraphs:', error);
			goto('/error');
		}
	});

	// Create a new session
	function handleCreateSession() {
		if (isLegit) {
			createSession(graphId, newSessionName);
			newSessionName = '';
		}
	}
</script>

<div class="container">
	{#if isLegit}
		<h1>Graph {graphId}</h1>

		<!-- Input to create a new session -->
		<div class="input-container-session">
			<input type="text" placeholder="Enter new session name" bind:value={newSessionName} />
			<button on:click={handleCreateSession}>Create Session</button>
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
	{:else}{/if}
</div>
