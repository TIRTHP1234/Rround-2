-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create patient_queries table
CREATE TABLE IF NOT EXISTS public.patient_queries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    department TEXT NOT NULL,
    symptoms TEXT NOT NULL,
    message TEXT,
    urgency_level TEXT CHECK (urgency_level IN ('Normal', 'Medium', 'High')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT DEFAULT 'pending'::text NOT NULL
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    department TEXT NOT NULL,
    doctor TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    time_slot TEXT NOT NULL,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'requested'::text NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS) policies
-- Note: In a real production environment, you might want more restrictive policies.
-- For the scope of this project, we'll allow public inserts (since it's a public form).

ALTER TABLE public.patient_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Allow public to insert queries
CREATE POLICY "Allow public insert to patient_queries" 
    ON public.patient_queries FOR INSERT 
    WITH CHECK (true);

-- Allow public to insert appointments
CREATE POLICY "Allow public insert to appointments" 
    ON public.appointments FOR INSERT 
    WITH CHECK (true);

-- Optional: If you want to allow users to fetch data on the frontend, add SELECT policies.
-- Currently, allowing public reads for demo purposes.
CREATE POLICY "Allow public read patient_queries" ON public.patient_queries FOR SELECT USING (true);
CREATE POLICY "Allow public read appointments" ON public.appointments FOR SELECT USING (true);
