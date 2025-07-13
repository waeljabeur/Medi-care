-- Minimal Database Setup for Patients Table
-- Run this if you're having column issues

-- Create minimal patients table (only required fields)
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add optional columns one by one (safer approach)
-- Run these one at a time if needed:

-- ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS email TEXT;
-- ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS phone TEXT;  
-- ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS dob DATE;
-- ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS medical_history TEXT;

-- Enable RLS if not already enabled
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies if they don't exist
DO $$ 
BEGIN
    -- Drop existing policies to recreate
    DROP POLICY IF EXISTS "Doctors can view their own patients" ON public.patients;
    DROP POLICY IF EXISTS "Doctors can insert patients" ON public.patients;
    DROP POLICY IF EXISTS "Doctors can update their own patients" ON public.patients;
    DROP POLICY IF EXISTS "Doctors can delete their own patients" ON public.patients;

    -- Create new policies
    CREATE POLICY "Doctors can view their own patients" ON public.patients
        FOR SELECT USING (auth.uid() = doctor_id);

    CREATE POLICY "Doctors can insert patients" ON public.patients
        FOR INSERT WITH CHECK (auth.uid() = doctor_id);

    CREATE POLICY "Doctors can update their own patients" ON public.patients
        FOR UPDATE USING (auth.uid() = doctor_id);

    CREATE POLICY "Doctors can delete their own patients" ON public.patients
        FOR DELETE USING (auth.uid() = doctor_id);
END $$;

-- Check what columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'patients' 
AND table_schema = 'public'
ORDER BY ordinal_position;
