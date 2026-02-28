



const { createClient } = require('@supabase/supabase-js');




const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;


const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

module.exports = { supabaseAdmin };






