<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import axios from 'axios'; 
  import './page_styles.css';

  const graphId = $page.params.graph_id;
  const sessionId = $page.params.session_id;

  let chatHistory = [];
  let newMessage = "";
  let loading = false; // State to track if the assistant is "thinking"

  const axiosInstance = axios.create({
    baseURL: '/api', 
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*', 
    }
  });

  async function loadChatHistory() {
    try {
      const res = await axiosInstance.get(`/session`, {
        params: { graphId, sessionId }
      });

      if (res.status === 200) {
        chatHistory = res.data;
      } else {
        console.error(`Failed to load chat history: ${res.statusText}`);
      }
    } catch (err) {
      console.error(`Error loading chat history: ${err}`);
    }
  }

  async function saveChatHistory() {
    try {
      const res = await axiosInstance.post('/session', {
        graphId,
        sessionId,
        messages: chatHistory,
      });

      if (res.status !== 200) {
        console.error(`Failed to save chat history: ${res.statusText}`);
      }
    } catch (err) {
      console.error(`Error saving chat history: ${err}`);
    }
  }

  onMount(() => {
    loadChatHistory();
  });

  function sendMessage() {
    if (newMessage.trim()) {
      let userMessage = newMessage;
      chatHistory = [...chatHistory, { sender: "user", message: newMessage }];
      newMessage = "";

      saveChatHistory();

      loading = true; // Set loading to true while waiting for the AI response

      setTimeout(async () => {
        
        const res = await axios.post('http://localhost:8000/v1/graph/chat',
          {
            graph_id: graphId,
            user_message: userMessage
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
            withCredentials: true
          }
        );

        console.log(res);
        chatHistory = [...chatHistory, {
          sender: "assistant",
          message: res.data.content,
        }];
        saveChatHistory();

        loading = false; // Set loading to false when the AI response is received
      }, 1000);
    }
  }
</script>

<div class="chat-container">
  <div class="header">
    <h1 class="header-title">Chat Session {sessionId}</h1>
  </div>

  <div class="chat-messages">
    {#each chatHistory as chat, index (index)}
      <div class="message {chat.sender === 'user' ? 'user' : 'assistant'}">
        <div class="message-bubble {chat.sender === 'user' ? 'user-bubble' : 'assistant-bubble'}">
          {chat.message}
        </div>
      </div>
    {/each}

    <!-- Show a "thinking" message with dots when loading -->
    {#if loading}
      <div class="message assistant">
        <div class="message-bubble assistant-bubble">
          <span class="dots">.</span>
          <span class="dots">.</span>
          <span class="dots">.</span>
        </div>
      </div>
    {/if}
  </div>

  <div class="input-area">
    <div class="input-container">
      <input
        type="text"
        bind:value={newMessage}
        on:keydown={(e) => e.key === 'Enter' && sendMessage()}
        placeholder="Type a message..."
        class="input-field"
      />
      <button on:click={sendMessage} disabled={!newMessage.trim()} class="send-button">
        Send
      </button>
    </div>
    <p class="footer-text">
      Free Research Preview. Our goal is to make AI systems helpful, honest, and harmless.
    </p>
  </div>
</div>
