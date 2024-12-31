<script>

import { onMount } from 'svelte';
import { goto } from '$app/navigation';
import { parseCookies } from '$lib'; 

  onMount(() => {
    const cookies = parseCookies();
    const accessToken = cookies.access_token ? cookies.access_token : null;
    if (!accessToken) {
      goto('/login');
    }
  });
</script>

<style>

h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #000;
    text-align: center;
    margin-bottom: 1rem;
}

p {
    font-size: 1rem;
    color: #000;
    text-align: center;
    line-height: 1.5;
    margin: 0;
}

a {
    color: #10a37f;
    text-decoration: none;
    font-weight: 600;
}

a:hover {
    color: #16b393;
    text-decoration: underline;
}
</style>

<div>
    <h1>Welcome to Home</h1>
    <p>Visit <a href="/new-graph">create graph</a> to read the documentation</p>
</div>
