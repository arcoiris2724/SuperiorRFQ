import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://qtpuaausqipgrtlihnfj.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImU2OGRkMWE1LTRiYTYtNGI4MS1hYTA1LTU4MGMxNjExNjQzZiJ9.eyJwcm9qZWN0SWQiOiJxdHB1YWF1c3FpcGdydGxpaG5maiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY0NjkzODcyLCJleHAiOjIwODAwNTM4NzIsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.leV_NpX_6k95_y3Xemw6yVtIbsB9TZIkl0UlWdRTvNM';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };