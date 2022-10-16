<script lang="ts">
  import { supaBase, user } from "../stores/supabase";
  $supaBase.auth.getUser().then(({data}) => {
    $user = data.user;
  });
</script>

<nav>
  <a href="/">Inicio</a>
  {#if $user}
    <a href="/account">Cuenta</a>
  {:else}
    <a href="/login">Iniciar Session</a>
  {/if}
</nav>

<slot />
