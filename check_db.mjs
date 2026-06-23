import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://oupbptgzfevkzzvscekj.supabase.co",
  "sb_publishable_Obya200r1UbgWVnMbuhhiw_Xto1ETSE"
);

async function check() {
  const { data: companies, error: err1 } = await supabase.from("companies").select("*");
  console.log("Companies:", companies?.length, err1 ? err1 : "");

  const { data: vacancies, error: err2 } = await supabase.from("vacancies").select("*");
  console.log("Vacancies:", vacancies?.length, err2 ? err2 : "");

  const { data: mentors, error: err3 } = await supabase.from("mentors").select("*");
  console.log("Mentors:", mentors?.length, err3 ? err3 : "");
}
check();
