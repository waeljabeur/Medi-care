-- Database Migration Script
-- Run this in your Supabase SQL Editor to add missing columns

-- Add missing columns to patients table if they don't exist
DO $$ 
BEGIN
    -- Add dob column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'patients' 
        AND column_name = 'dob' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.patients ADD COLUMN dob DATE;
    END IF;

    -- Add medical_history column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'patients' 
        AND column_name = 'medical_history' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.patients ADD COLUMN medical_history TEXT;
    END IF;

    -- Add phone column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'patients' 
        AND column_name = 'phone' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.patients ADD COLUMN phone TEXT;
    END IF;

    -- Add email column if it doesn't exist (separate from doctors.email)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'patients' 
        AND column_name = 'email' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.patients ADD COLUMN email TEXT;
    END IF;
END $$;

-- Verify the table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'patients' 
AND table_schema = 'public'
ORDER BY ordinal_position;
