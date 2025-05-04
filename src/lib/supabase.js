import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://injmaqyfvkbslrfjvvje.supabase.co';
// const supabaseUrl = 'https://YOUR_PROJECT_ID.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imluam1hcXlmdmtic2xyZmp2dmplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNDIyNDEsImV4cCI6MjA2MTkxODI0MX0.o7mbW-iJP7t9_dfOgEy4J9XGsu7z83imNY5S1tnO2LY';
// const supabaseAnonKey = 'YOUR_ANON_PUBLIC_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = 'https://injmaqyfvkbslrfjvvje.supabase.co';
// const supabaseAnonKey = 'YOUR_ANON_PUBLIC_KEY';

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);
