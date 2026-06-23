import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  "https://oupbptgzfevkzzvscekj.supabase.co",
  "sb_publishable_Obya200r1UbgWVnMbuhhiw_Xto1ETSE"
);

async function check() {
  const res = await supabase.rpc('get_tables'); // Or try selecting directly
  console.log(res);
}
check();
