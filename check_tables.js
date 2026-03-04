import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://nndwbwxgayaodavkuukz.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uZHdid3hnYXlhb2Rhdmt1dWt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwODM5NTUsImV4cCI6MjA4NzY1OTk1NX0.ooYh73DJC5Z_lF3Wqlvup2hFjLXoGsYxfNuAdfhv74Q'
);

async function checkTables() {
    // Try to select from a guessed table name
    const { data, error } = await supabase.from('restaurant_menus').select('*').limit(1);
    console.log("restaurant_menus existing:", error ? error.message : "Yes");

    // Also check for 'services' table structure to see what's in there
    const { data: srvData } = await supabase.from('services').select('*').limit(1);
    console.log("services structure:", srvData);
}
checkTables();
