-- Database Diagnostic Script
-- Run this in Supabase SQL Editor to check if everything is set up correctly

-- 1. Check if tables exist
SELECT 
    table_name, 
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN ('doctors', 'patients', 'appointments')
ORDER BY table_name;

-- 2. Check doctors table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'doctors'
ORDER BY ordinal_position;

-- 3. Check patients table structure  
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'patients'
ORDER BY ordinal_position;

-- 4. Check appointments table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'appointments'
ORDER BY ordinal_position;

-- 5. Check RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 6. Check current user ID (if logged in)
SELECT auth.uid() as current_user_id;

-- 7. Check if any doctors exist
SELECT count(*) as doctor_count FROM public.doctors;

-- 8. Check if any patients exist  
SELECT count(*) as patient_count FROM public.patients;

-- 9. Check if any appointments exist
SELECT count(*) as appointment_count FROM public.appointments;
