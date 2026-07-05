import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oupbptgzfevkzzvscekj.supabase.co';
const supabaseKey = 'sb_publishable_Obya200r1UbgWVnMbuhhiw_Xto1ETSE';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const email = 'test_admin_' + Date.now() + '@example.com';
  const { data, error } = await supabase.auth.signUp({
    email,
    password: 'password123',
    options: {
      data: { role: 'candidate', full_name: 'Test User' }
    }
  });
  console.log('Signup:', error ? error.message : 'Success ' + data.user.id);
  
  if (data?.user?.id) {
    const { data: profile, error: pError } = await supabase.from('users_profiles').select('*').eq('id', data.user.id).single();
    console.log('Profile fetch after signup:', pError ? pError.message : profile);
    
    // Now try to fetch all profiles as this authenticated user
    const { data: allProfiles, error: aError } = await supabase.from('users_profiles').select('*');
    console.log('All profiles as auth user:', allProfiles ? allProfiles.length : 0);
  }
}
test();
