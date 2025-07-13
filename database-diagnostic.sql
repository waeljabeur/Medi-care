-- Database Diagnostic Script
-- Run this in your Supabase SQL Editor to check current database structure

-- Check if patients table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'patients'
) AS patients_table_exists;

-- Check current columns in patients table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public'
AND table_name = 'patients'
ORDER BY ordinal_position;

-- Check if there are any patients records
SELECT COUNT(*) as patient_count FROM public.patients;

-- Show sample patient record structure (if any exist)
SELECT * FROM public.patients LIMIT 1;

-- Check doctors table structure
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public'
AND table_name = 'doctors'
ORDER BY ordinal_position;
