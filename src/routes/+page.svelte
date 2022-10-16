<script lang="ts">
  import { supaBase, user } from "../stores/supabase";

  import type { IProduct } from "src/types";
  let product: IProduct = { name: "", description: "", stock: 0, price: 0 };
  let products: IProduct[] = [];

  $supaBase
    .channel("public:products")
    .on<IProduct>(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "products" },
      (payload) => {
        if (Object.keys(payload.new).length) {
          products = [...products, payload.new as IProduct];
        }
      }
    )
    .subscribe();

  (async () => {
    const { data } = await $supaBase
      .from<"products", IProduct>("products")
      .select<"*", IProduct>("*");
    products = data ?? [];
  })();
  async function insertProduct() {
    await $supaBase.from("products").insert(product);
  }
</script>

<h1>Supabase</h1>

{#if $user}
  <div class="col gap-1 align-start">
    <label>
      <span>Name</span>
      <input type="text" placeholder="Name" bind:value={product.name} />
    </label>
    <label>
      <span>Description</span>
      <input
        type="text"
        placeholder="Description"
        bind:value={product.description}
      />
    </label>
    <label>
      <span>Price</span>
      <input type="number" placeholder="Price" bind:value={product.price} />
    </label>
    <label>
      <span>Stock</span>
      <input type="number" placeholder="Stock" bind:value={product.stock} />
    </label>
    <button on:click={insertProduct}>Create Prodcut</button>
  </div>
{/if}
<h2>Real time listener</h2>
<div class="grid">
  {#each products as prod (prod.id)}
    <div class="card">
      <h2>{prod.name}</h2>
      <p>{prod.description}</p>
      <p>$ {prod.price}</p>
    </div>
  {/each}
</div>

<style>
  .grid {
    display: grid;
    width: 90vw;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }
  .card {
    box-shadow: 0 0 6px gray;
    padding: 1rem;
    width: 300px;
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
</style>
