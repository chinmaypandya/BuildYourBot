<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { writable } from 'svelte/store';
  import { onMount } from 'svelte';
  import './page_styles.css';
  import { sessions, loadSessions, PageReload, createSession } from '$lib/session';
	import { parseCookies } from '$lib';

  let isAuthorized = true;
  const graphId = $page.params.graph_id;
  let newSessionName = '';


  // Decode JWT to extract payload
  function decodeJWT(token) {
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

  // Validate user access based on cookies
  onMount(() => {
    const cookies = parseCookies();
    const graphToken = cookies.graph_token ? decodeJWT(cookies.graph_token) : null;
    const sessionToken = cookies.session_token ? decodeJWT(cookies.session_token) : null;

    if (!graphToken || !sessionToken) {
      isAuthorized = false;
      goto('/error'); 
      return;
    }

    const { userId: graphUserId, graphIds } = graphToken;
    const { userId: sessionUserId } = sessionToken;

    if (graphUserId !== sessionUserId || !graphIds.includes(graphId)) {
      isAuthorized = false;
      goto('/error'); // Navigate to error page
      return;
    }

    // Load sessions if authorized
    const loadedSessions = loadSessions(graphId);
    sessions.set(loadedSessions);
  });

  // Create a new session
  function handleCreateSession() {
    if (isAuthorized) {
      createSession(graphId, newSessionName);
      newSessionName = ''; 
    }
  }
</script>

<div class="container">
  {#if isAuthorized}
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
  {:else}
  {/if}
</div>
