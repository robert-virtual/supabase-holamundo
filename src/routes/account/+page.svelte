<script lang="ts">
  import { browser } from "$app/environment";

  import { goto } from "$app/navigation";

  import { supaBase, user } from "../../stores/supabase";
  $: if (browser && !$user) {
    goto("/login");
  }
  function signOut() {
    $supaBase.auth.signOut();
    $user = null;
    goto("/login");
  }
</script>

<h1>Bienvenido {$user?.email}</h1>
<button on:click={signOut}>Cerrar Session</button>
