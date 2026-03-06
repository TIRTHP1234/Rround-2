import { supabase } from '../supabase/client';

export const createAppointment = async (appointmentData) => {
    try {
        const { data, error } = await supabase
            .from('appointments')
            .insert([appointmentData])
            .select();

        if (error) {
            console.error('Error creating appointment:', error);
            throw error;
        }

        return { success: true, data };
    } catch (err) {
        console.error('Exception in createAppointment:', err);
        throw err;
    }
};

export const getAppointmentsByDate = async (dateStr) => {
    try {
        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .eq('appointment_date', dateStr);

        if (error) {
            console.error('Error fetching appointments:', error);
            throw error;
        }

        return { success: true, data: data || [] };
    } catch (err) {
        console.error('Exception in getAppointmentsByDate:', err);
        throw err;
    }
};
