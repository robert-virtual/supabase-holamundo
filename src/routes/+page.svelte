<script lang="ts">
  import { createClient } from "@supabase/supabase-js";
  import type { IDatabase, IProduct } from "src/types";
  const supabaseUrl = "https://qzwcxxccgeimihfsucky.supabase.co";
  const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
  const client = createClient<IDatabase>(supabaseUrl, supabaseKey!, {
    realtime: { params: { eventsPerSecond: 10 } },
  });
  let product: IProduct = { name: "", description: "", stock: 0, price: 0 };
  let products: IProduct[] = [];

  client
    .channel("public:products")
    .on<IProduct>(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "products" },
      (payload) => {
        if (Object.keys(payload.new).length) {
          products = [...products, (payload.new as IProduct)];
        }
      }
    )
    .subscribe();

  (async () => {
    const { data } = await client
      .from<"products", IProduct>("products")
      .select<"*", IProduct>("*");
    products = data ?? [];
  })();
  async function insertProduct() {
    await client.from("products").insert(product);
  }
</script>

<h1>Supabase</h1>

<div class="col gap-1 align-start">
  <input type="text" placeholder="Name" bind:value={product.name} />
  <input
    type="text"
    placeholder="Description"
    bind:value={product.description}
  />
  <input type="number" placeholder="Price" bind:value={product.price} />
  <input type="number" placeholder="Stock" bind:value={product.stock} />
  <button on:click={insertProduct}>Create Prodcut</button>
  <div class="grid">
    {#each products as prod (prod.id)}
      <div class="card">
        <h2>{prod.name}</h2>
        <p>{prod.description}</p>
        <p>$ {prod.price}</p>
      </div>
    {/each}
  </div>
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
