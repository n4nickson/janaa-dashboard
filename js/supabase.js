import { createClient } from 
'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(
'https://guednkeelbwcfmdlobkz.supabase.co/',
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1ZWRua2VlbGJ3Y2ZtZGxvYmt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MDUyODIsImV4cCI6MjA4ODM4MTI4Mn0.q3E4YQ5olDSqeSoC9vD3rHguBOCiy4oQmTZOTFZBoQ0'
)

export default supabase
