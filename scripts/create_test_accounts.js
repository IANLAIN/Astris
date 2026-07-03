import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://oupbptgzfevkzzvscekj.supabase.co",
  "sb_publishable_Obya200r1UbgWVnMbuhhiw_Xto1ETSE" // Wait, I need the SERVICE ROLE KEY to bypass email confirmation and create users directly if email confirm is ON.
);
