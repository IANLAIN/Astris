import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oupbptgzfevkzzvscekj.supabase.co';
const supabaseKey = 'sb_publishable_Obya200r1UbgWVnMbuhhiw_Xto1ETSE';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('companies').select('*');
  console.log('Companies error:', error);
  console.log('Companies count:', data ? data.length : 0);
  
  const { data: usersData } = await supabase.from('users_profiles').select('*');
  console.log('users_profiles count:', usersData ? usersData.length : 0);
}

check();
