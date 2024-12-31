<script>
    import { onMount } from "svelte";
    import axios from "axios";
    import { writable } from "svelte/store";
    import { goto } from "$app/navigation";
  
    let credentials = { email: "", password: "" };
    let error = writable("");
  
    const handleChange = (e) => {
      credentials = { ...credentials, [e.target.name]: e.target.value };
    };
  
    const handleError = (err) => {
      error.set(err.response?.data?.error || err.message);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const { data } = await axios.post(
          `http://localhost:3002/api/auth/login`,
          credentials,
          { withCredentials: true }
        );
        if(data) goto('/')
      } catch (err) {
        handleError(err);
      }
    };
  </script>

<style>

.main{
  background-color: #181818;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.container {
  max-width: 400px;
  background: linear-gradient(0deg, #2d2d2d 0%, #3e3e3e 100%);
  border-radius: 40px;
  padding: 25px 35px;
  border: 5px solid #181818;
  box-shadow: #3ecf8e 0px 30px 30px -20px;
  margin: 20px auto;
  
}

.heading {
  text-align: center;
  font-weight: 900;
  font-size: 30px;
  color: #3ecf8e;
}

.form {
  margin-top: 20px;
}

.input {
  width: 99%;
  background: #181818;
  border: none;
  padding: 15px 20px;
  border-radius: 20px;
  margin-top: 15px;
  box-shadow: #8cc9ae 0px 10px 10px -5px;
  border: 2px solid transparent;
  color: aliceblue;
}

.input::-moz-placeholder {
  color: rgb(170, 170, 170);
}

.input::placeholder {
  color: rgb(170, 170, 170);
}

.input:focus {
  outline: none;
  border: 2px solid #71c8a1;
}


.login-button {
  display: block;
  width: 100%;
  font-weight: bold;
  background: linear-gradient(45deg, #59ce99 0%, #3ecf8e 100%);
  color: #181818;
  padding: 15px;
  margin: 20px auto;
  border-radius: 20px;
  border: none;
  transition: all 0.2s ease-in-out;
}

.login-button:hover {
  transform: scale(1.03);
}

.login-button:active {
  transform: scale(0.95);
}

</style>

<div class="main">
    <div class="container">
      <div class="heading">Sign In</div>
      {#if $error}
        <p style="color: red; text-align: center;">{$error}</p>
      {/if}
      <form class="form" on:submit|preventDefault={handleSubmit}>
        <input
          required
          class="input"
          type="email"
          name="email"
          placeholder="E-mail"
          bind:value={credentials.email}
          on:input={handleChange}
        />
        <input
          required
          class="input"
          type="password"
          name="password"
          placeholder="Password"
          bind:value={credentials.password}
          on:input={handleChange}
        />
        <input class="login-button" type="submit" value="Sign In" />
      </form>
    </div>
  </div>
  