import { supabase } from '../supabase/client';

export const submitPatientQuery = async (queryData) => {
    try {
        const { data, error } = await supabase
            .from('patient_queries')
            .insert([queryData])
            .select();

        if (error) {
            console.error('Error submitting query:', error);
            throw error;
        }

        return { success: true, data };
    } catch (err) {
        console.error('Exception in submitPatientQuery:', err);
        throw err;
    }
};
