<script>
  import { page } from "$app/stores";
  import { writable } from 'svelte/store';
  import { onMount } from 'svelte';
  import './layout_styles.css';
  import { loadSessionsFromStorage, forcePageReload } from '$lib/sessionUtils.js';
  const graphId = $page.params.graph_id;

  // Create a writable store to hold the sessions
  export let sessions = writable([]);

  // Helper function to save sessions to localStorage (Client-side only)
  function saveSessionsToStorage(sessions) {
    localStorage.setItem(`sessions-${graphId}-chat`, JSON.stringify(sessions));
  }

  // Load sessions from localStorage when the component is mounted
  onMount(() => {
    const loadedSessions = loadSessionsFromStorage(graphId);
    sessions.set(loadedSessions); // Initialize the store with the loaded sessions
  });

  // Function to add a new chat session
  function addNewChat() {
    sessions.update(currentSessions => {
      const newSessionId = `session${currentSessions.length + 1}`;
      const updatedSessions = [
        ...currentSessions,
        { id: newSessionId, title: newSessionId }
      ];
      saveSessionsToStorage(updatedSessions); // Save updated sessions to localStorage
      return updatedSessions;
    });
  }

</script>

<div class="main-container">
  <div class="sidebar-container">
    <div class="sidebar-header">
      <h2>Graph {graphId}</h2>
      <button class="new-chat-button" on:click={addNewChat} aria-label="New Chat">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
    </div>

    <div class="sessions-list">
      {#each $sessions as session (session.id)}
        <div class="session-item">
          <div class="session-title">
            <a href={`/${graphId}/${session.id}`} on:click={forcePageReload} class="session-link">
              {session.title} 
            </a>
          </div>
          <div class="session-actions">
            <button class="action-button" aria-label="Edit">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </button>
            <button class="action-button" aria-label="Delete">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
      {/each}
    </div>

    
  </div>

  <div class="main">
    <slot />
  </div>
</div>
