-- Supabase Database Setup for Doctor Dashboard - SIMPLE VERSION
-- Run this in your Supabase SQL Editor

-- Clean up any existing policies and functions
DROP POLICY IF EXISTS "Doctors can view their own profile" ON public.doctors;
DROP POLICY IF EXISTS "Doctors can update their own profile" ON public.doctors;
DROP POLICY IF EXISTS "Doctors can insert their own profile" ON public.doctors;
DROP POLICY IF EXISTS "Enable insert for service role" ON public.doctors;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create doctors table (if not exists)
CREATE TABLE IF NOT EXISTS public.doctors (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create patients table (if not exists)
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    dob DATE,
    phone TEXT,
    email TEXT,
    medical_history TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create appointments table (if not exists)
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE NOT NULL,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    reason TEXT NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- SIMPLE RLS Policies for doctors table
-- Allow authenticated users to view their own profile
CREATE POLICY "Doctors can view their own profile" ON public.doctors
    FOR SELECT USING (auth.uid() = id);

-- Allow authenticated users to update their own profile  
CREATE POLICY "Doctors can update their own profile" ON public.doctors
    FOR UPDATE USING (auth.uid() = id);

-- Allow authenticated users to insert their own profile
CREATE POLICY "Doctors can insert their own profile" ON public.doctors
    FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for patients table
CREATE POLICY "Doctors can view their own patients" ON public.patients
    FOR SELECT USING (auth.uid() = doctor_id);

CREATE POLICY "Doctors can insert patients" ON public.patients
    FOR INSERT WITH CHECK (auth.uid() = doctor_id);

CREATE POLICY "Doctors can update their own patients" ON public.patients
    FOR UPDATE USING (auth.uid() = doctor_id);

CREATE POLICY "Doctors can delete their own patients" ON public.patients
    FOR DELETE USING (auth.uid() = doctor_id);

-- RLS Policies for appointments table
CREATE POLICY "Doctors can view their own appointments" ON public.appointments
    FOR SELECT USING (auth.uid() = doctor_id);

CREATE POLICY "Doctors can insert appointments" ON public.appointments
    FOR INSERT WITH CHECK (auth.uid() = doctor_id);

CREATE POLICY "Doctors can update their own appointments" ON public.appointments
    FOR UPDATE USING (auth.uid() = doctor_id);

CREATE POLICY "Doctors can delete their own appointments" ON public.appointments
    FOR DELETE USING (auth.uid() = doctor_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_patients_doctor_id ON public.patients(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON public.appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(date);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.doctors TO authenticated;
GRANT ALL ON public.patients TO authenticated;
GRANT ALL ON public.appointments TO authenticated;
