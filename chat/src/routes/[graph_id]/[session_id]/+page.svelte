<script>
  import { page } from "$app/stores";
  import { onMount } from 'svelte';
  import './page_styles.css';
  
  const graphId = $page.params.graph_id;
  const sessionId = $page.params.session_id;

  let chatHistory = [];
  let newMessage = "";

  // Function to get chat history from localStorage based on sessionId
  function loadChatHistory() {
    const storedSessionsChats = localStorage.getItem(`sessions-${graphId}-chat`);
    if (storedSessionsChats) {
      const sessions = JSON.parse(storedSessionsChats);
      // Find the session history for the current sessionId
      const sessionHistory = sessions.find(session => session.sessionId === sessionId);
      return sessionHistory ? sessionHistory.messages : [];
    }
    // Default history if no previous data exists
    return [
      { sender: "assistant", message: "Hello! How can I assist you today?" },
      { sender: "user", message: "Hi there, I have a question about a project." },
    ];
  }

  // Function to save chat history to localStorage based on sessionId
  function saveChatHistory() {
    const storedSessionsChats = localStorage.getItem(`sessions-${graphId}-chat`);
    let sessions = storedSessionsChats ? JSON.parse(storedSessionsChats) : [];

    // Find the current session in storedSessionsChats or create a new one
    const existingSessionIndex = sessions.findIndex(session => session.sessionId === sessionId);
    if (existingSessionIndex !== -1) {
      // Update the existing session's history
      sessions[existingSessionIndex].messages = chatHistory;
    } else {
      // Add new session if it doesn't exist
      sessions.push({ sessionId, messages: chatHistory });
    }

    // Save the updated sessions array to localStorage
    localStorage.setItem(`sessions-${graphId}-chat`, JSON.stringify(sessions));
  }

  // Only load the chat history after the component is mounted in the browser
  onMount(() => {
    chatHistory = loadChatHistory(); 
  });

  // Function to send a new message
  function sendMessage() {
    if (newMessage.trim()) {
      // Add user message to chatHistory
      chatHistory = [...chatHistory, { sender: "user", message: newMessage }];
      newMessage = "";

      // Save updated chat history to localStorage
      saveChatHistory();

      // Simulate assistant response after a delay
      setTimeout(() => {
        chatHistory = [...chatHistory, {
          sender: "assistant",
          message: "I'm processing your request. How can I help further?"
        }];
        saveChatHistory();
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
  </div>

  <div class="input-area">
    <div class="input-container">
      <input 
        type="text" 
        bind:value={newMessage}
        on:keydown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type a message..." 
        class="input-field" 
      />
      <button 
        on:click={sendMessage} 
        disabled={!newMessage.trim()} 
        class="send-button"
      >
        Send
      </button>
    </div>
    <p class="footer-text">
      Free Research Preview. Our goal is to make AI systems helpful, honest, and harmless.
    </p>
  </div>
</div>
