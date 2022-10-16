<script lang="ts">
  import { goto } from "$app/navigation";

  import { supaBase, user } from "../../stores/supabase";
  let credentials = { email: "", password: "", confirm_pwd: "" };
  let signUp = false;
  $: if ($user) {
    console.log("go to /");
    goto("/");
  }
  let loginError = "";
  async function logIn() {
    if (pwdError) {
      console.log("pwdError: ", pwdError);
      return;
    }
    if (signUp) {
      const { data, error } = await $supaBase.auth.signUp(credentials);
      if (!error) {
        $user = data.user;
        goto("/");
        return;
      }
      loginError = error.message;
      return;
    }
    const { data, error } = await $supaBase.auth.signInWithPassword(
      credentials
    );
    if (!error) {
      $user = data.user;
      goto("/");
      return;
    }
    loginError = error.message;
  }
  function setSignUp(value: boolean) {
    signUp = value;
  }
  let pwdError = "";
  function validatePwd() {
    if (credentials.confirm_pwd.length < credentials.password.length) {
      return;
    }
    if (credentials.confirm_pwd != credentials.password) {
      pwdError = "Claves no coinciden";
      return;
    }
    pwdError = "";
  }
</script>

<h1>Iniciar Session</h1>

<button class="no-style-btn" on:click={() => setSignUp(false)}
  >Ya tengo una cuenta</button
>
<span> | </span>
<button class="no-style-btn" on:click={() => setSignUp(true)}
  >Crear una cuenta</button
>
<form class="col align-start gap-1" on:submit|preventDefault={logIn}>
  <input
    type="email"
    required
    placeholder="Correo"
    bind:value={credentials.email}
  />
  <input
    type="password"
    required
    placeholder="Clave"
    bind:value={credentials.password}
  />
  {#if signUp}
    <input
      type="password"
      on:keyup={validatePwd}
      required
      placeholder="Confirmar Clave"
      bind:value={credentials.confirm_pwd}
    />
    {#if pwdError}
      <p class="error">{pwdError}</p>
    {/if}
  {/if}
  <button>Entrar</button>
  {#if loginError}
    <p class="error">{loginError}</p>
  {/if}
</form>

<style>
  .error {
    color: red;
  }
  .col {
    display: flex;
    flex-direction: column;
  }
  .align-start {
    align-items: start;
  }
  .gap-1 {
    gap: 1rem;
  }
  .no-style-btn {
    background: none;
    border: none;
    margin: 0.5rem;
    transition: all 1s;
  }
  .no-style-btn:hover {
    color: blueviolet;
  }
</style>
