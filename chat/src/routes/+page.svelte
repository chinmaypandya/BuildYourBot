<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { parseCookies, decodeJWT } from '$lib';
  import './page_styles.css';
  let graphData = [];
  let loading = true;
  let error = null;

  const ERROR_MESSAGES = {
    network: 'Something went wrong. Please try again later.',
  };

  onMount(async () => {
    const cookies = parseCookies();
    const accessToken = cookies.access_token ? decodeJWT(cookies.access_token) : null;

    if (!accessToken || !accessToken.sub) {
      goto('/login');
      return;
    }

    const { sub: sessionUserId } = accessToken;

    try {
      loading = true;
      console.log("Fetching data from:", `http://localhost:3002/api/graph/user/${sessionUserId}`);

      const response = await fetch(`http://localhost:3002/api/graph/user/${sessionUserId}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(ERROR_MESSAGES.network);
      }

      const data = await response.json();

      // Validate and set data
      if (!Array.isArray(data.graphIds)) {
        throw new Error("Invalid graph data format");
      }

      graphData = data.graphIds;
      error = null;

    } catch (err) {
      console.error("Error fetching data:", err);
      error = err.message || "Unexpected error occurred.";
    } finally {
      loading = false;
    }
  });
</script>



<div class="graph-history">
  <h1 class="title">Your Graphs</h1>
  
  {#if loading}
    <div class="loader-container">
      <div class="spinner"></div>
      <p>Loading your graphs...</p>
    </div>
  {:else if error}
    <div class="error-container">
      <h2>Error</h2>
      <p>{error}</p>
    </div>
  {:else if graphData.length > 0}
    <div class="graph-table-container">
      <table class="graph-table">
        <thead>
          <tr>
            <th>Graph Name</th>
            <th>Description</th>
            <th>Chat</th>
          </tr>
        </thead>
        <tbody>
          {#each graphData as { id, name, description }}
            <tr key={id}>
              <td>{name}</td>
              <td>{description}</td>
              <td>
                <a href={`http://localhost:5173/${id}`} target="_blank" rel="noopener noreferrer" class="chat-btn">
                  Chat
                </a>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {:else}
    <p class="no-graphs">No graphs available. Start creating one!</p>
  {/if}
</div>
