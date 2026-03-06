-- Disable RLS temporarily or assume we are superadmin running in SQL Editor
-- This script safely inserts 10 dummy appointments across the next few days.

DO $$
DECLARE
    today DATE := CURRENT_DATE;
BEGIN

-- Insert 10 appointments across the next 3 days
INSERT INTO public.appointments (patient_name, email, phone, department, doctor, appointment_date, time_slot, reason, status)
VALUES
    -- Day 0 (Today)
    ('John Doe', 'john.doe@example.com', '555-0101', 'General Medicine', 'Dr. Smith', today, '09:00 AM', 'Annual checkup', 'requested'),
    ('Jane Smith', 'jane.smith@example.com', '555-0102', 'Cardiology', 'Dr. Heart', today, '10:00 AM', 'Heart palpitations monitoring', 'requested'),
    ('Alice Johnson', 'alice.j@example.com', '555-0103', 'Neurology', 'Dr. Brain', today, '02:00 PM', 'Frequent migraines', 'requested'),
    
    -- Day 1 (Tomorrow)
    ('Bob Brown', 'bob.b@example.com', '555-0104', 'Orthopedics', 'Dr. Bones', today + 1, '09:00 AM', 'Knee pain', 'requested'),
    ('Charlie Davis', 'charlie.d@example.com', '555-0105', 'Pediatrics', 'Dr. Kids', today + 1, '11:00 AM', 'Vaccination', 'requested'),
    ('Diana Prince', 'diana.p@example.com', '555-0106', 'General Medicine', 'Dr. Johnson', today + 1, '01:00 PM', 'Fever and chills', 'requested'),
    ('Ethan Hunt', 'ethan.h@example.com', '555-0107', 'Cardiology', 'Dr. Heart', today + 1, '03:00 PM', 'Routine ECG', 'requested'),
    
    -- Day 2 (Day after tomorrow)
    ('Fiona Gallagher', 'fiona.g@example.com', '555-0108', 'Neurology', 'Dr. Brain', today + 2, '10:00 AM', 'Follow-up appointment', 'requested'),
    ('George Miller', 'george.m@example.com', '555-0109', 'Orthopedics', 'Dr. Bones', today + 2, '02:00 PM', 'Post-surgery review', 'requested'),
    ('Hannah Abbott', 'hannah.a@example.com', '555-0110', 'Pediatrics', 'Dr. Kids', today + 2, '04:00 PM', 'Cough and cold', 'requested');

END $$;
