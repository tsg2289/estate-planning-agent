-- Check for problematic triggers and functions
-- Run this to see what's causing the recursion

-- Check all triggers
SELECT 
    schemaname,
    tablename,
    triggername,
    triggerdef
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'public'
ORDER BY tablename, triggername;

-- Check all functions
SELECT 
    n.nspname as schema_name,
    p.proname as function_name,
    pg_get_functiondef(p.oid) as function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
ORDER BY p.proname;

-- Check RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
