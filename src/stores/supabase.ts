import { createClient, type User } from "@supabase/supabase-js";
import type { IDatabase } from "src/types";
import { writable } from "svelte/store";

const supabaseUrl = "https://qzwcxxccgeimihfsucky.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
export const supaBase = writable(
  createClient<IDatabase>(supabaseUrl, supabaseKey!, {
    realtime: { params: { eventsPerSecond: 10 } },
  })
);

export const user = writable<User | null>();
