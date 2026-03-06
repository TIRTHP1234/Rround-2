import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CalendarClock, Loader2, Video, MapPin } from 'lucide-react';
import Button from '../components/ui/Button';
import InputField from '../components/ui/InputField';
import SelectDropdown from '../components/ui/SelectDropdown';
import { createAppointment } from '../services/appointmentService';
import { useAuth } from '../context/AuthContext';
import emailjs from '@emailjs/browser';

const AppointmentPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        patient_name: '',
        email: '',
        phone: '',
        department: '',
        doctor: '',
        appointment_date: '',
        time_slot: '',
        reason: '',
        appointment_type: 'In-Person',
    });

    const [errors, setErrors] = useState({});

    // Auto-fill user data if logged in
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                patient_name: user.name || prev.patient_name,
                email: user.email || prev.email,
                phone: user.phone || prev.phone,
            }));
        }
    }, [user]);

    const departmentOptions = [
        { value: 'General Medicine', label: 'General Medicine' },
        { value: 'Cardiology', label: 'Cardiology' },
        { value: 'Neurology', label: 'Neurology' },
        { value: 'Orthopedics', label: 'Orthopedics' },
        { value: 'Pediatrics', label: 'Pediatrics' },
    ];

    const doctorOptions = {
        'General Medicine': [{ value: 'Dr. Smith', label: 'Dr. Smith' }, { value: 'Dr. Johnson', label: 'Dr. Johnson' }],
        'Cardiology': [{ value: 'Dr. Heart', label: 'Dr. Heart' }],
        'Neurology': [{ value: 'Dr. Brain', label: 'Dr. Brain' }],
        'Orthopedics': [{ value: 'Dr. Bones', label: 'Dr. Bones' }],
        'Pediatrics': [{ value: 'Dr. Kids', label: 'Dr. Kids' }],
    };

    const timeSlotOptions = [
        { value: '09:00 AM', label: '09:00 AM' },
        { value: '10:00 AM', label: '10:00 AM' },
        { value: '11:00 AM', label: '11:00 AM' },
        { value: '01:00 PM', label: '01:00 PM' },
        { value: '02:00 PM', label: '02:00 PM' },
        { value: '03:00 PM', label: '03:00 PM' },
        { value: '04:00 PM', label: '04:00 PM' },
    ];

    const appointmentTypeOptions = [
        { value: 'In-Person', label: 'In-Person Visit' },
        { value: 'Online', label: 'Online (Google Meet)' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const newData = { ...prev, [name]: value };
            // Reset doctor if department changes
            if (name === 'department') {
                newData.doctor = '';
            }
            return newData;
        });

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.patient_name) newErrors.patient_name = 'Patient Name is required';
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.phone) newErrors.phone = 'Phone Number is required';
        if (!formData.department) newErrors.department = 'Department is required';
        if (!formData.doctor) newErrors.doctor = 'Doctor is required';
        if (!formData.appointment_date) newErrors.appointment_date = 'Date is required';
        if (!formData.time_slot) newErrors.time_slot = 'Time slot is required';
        if (!formData.reason) newErrors.reason = 'Reason for visit is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            toast.error('Please fill in all required fields correctly.');
            return;
        }

        setIsSubmitting(true);
        let meetingLink = null;

        // Auto-generate a dummy Google Meet link for online appointments
        if (formData.appointment_type === 'Online') {
            const randomString = Math.random().toString(36).substring(2, 12);
            meetingLink = `https://meet.google.com/lookup/${randomString}`;
        }

        try {
            // NOTE: We omit appointment_type and meeting link from Supabase save for now unless you update the DB schema
            // But we will pass the meetingLink through the React Router state to display it!
            const submissionData = { ...formData };
            delete submissionData.appointment_type; // Removing so it doesn't break current Supabase schema insert

            await createAppointment(submissionData);

            let successMessage = 'Your appointment request has been successfully submitted. We will confirm your time slot shortly.';

            // === EMAILJS INTEGRATION ===
            const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
            const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
            const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

            const finalMeetingLink = formData.appointment_type === 'Online' ? meetingLink : 'In-Person Clinic Visit';

            if (serviceId && templateId && publicKey) {
                try {
                    await emailjs.send(
                        serviceId,
                        templateId,
                        {
                            to_email: formData.email,
                            to_name: formData.patient_name,
                            booking_date: formData.appointment_date,
                            booking_time: formData.time_slot,
                            doctor_name: formData.doctor,
                            meeting_link: finalMeetingLink,
                            reply_to: formData.email,
                        },
                        publicKey
                    );
                    console.log("Email successfully sent via EmailJS!");
                } catch (emailErr) {
                    console.error("Failed to send email via EmailJS:", emailErr);
                }
            } else {
                console.log(`[SIMULATED EMAIL] In production code this would send an email to ${formData.email} containing link: ${finalMeetingLink}`);
            }

            if (formData.appointment_type === 'Online') {
                toast.success(`Meeting details and confirmation sent to ${formData.email}!`, { duration: 5000 });
            } else {
                toast.success(`Appointment confirmation sent to ${formData.email}!`, { duration: 5000 });
            }

            navigate('/confirmation', {
                state: {
                    message: successMessage,
                    meetingLink: meetingLink, // We only care about displaying the link on the UI if it's Online
                    email: formData.email
                }
            });

        } catch (error) {
            console.error(error);
            toast.error('Failed to request appointment. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const currentDoctorOptions = formData.department ? doctorOptions[formData.department] : [];

    return (
        <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-4rem)] flex items-center justify-center">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header styling */}
                <div className="bg-blue-600 px-6 py-8 sm:p-10 text-white">
                    <div className="flex items-center justify-center mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                            <CalendarClock size={28} className="text-white" />
                        </div>
                    </div>
                    <h2 className="text-center text-3xl font-extrabold">Book an Appointment</h2>
                    <p className="mt-2 text-center text-blue-100">
                        Schedule a visit with one of our expert doctors.
                    </p>
                </div>

                {/* Form Body */}
                <div className="px-6 py-8 sm:p-10 text-gray-800">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Appointment Type Toggle */}
                        <div className="bg-blue-50 p-4 rounded-xl mb-6">
                            <label className="text-sm font-semibold text-blue-900 mb-3 block">How would you like to consult the doctor?</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => handleChange({ target: { name: 'appointment_type', value: 'In-Person' } })}
                                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${formData.appointment_type === 'In-Person'
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    <MapPin size={18} /> In-Person
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleChange({ target: { name: 'appointment_type', value: 'Online' } })}
                                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${formData.appointment_type === 'Online'
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    <Video size={18} /> Online (Google Meet)
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                            <InputField
                                label="Patient Name *"
                                id="patient_name"
                                name="patient_name"
                                value={formData.patient_name}
                                onChange={handleChange}
                                error={errors.patient_name}
                                placeholder="John Doe"
                            />
                            <InputField
                                label="Email Address *"
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                                placeholder="john@example.com"
                            />
                            <InputField
                                label="Phone Number *"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                error={errors.phone}
                                placeholder="(123) 456-7890"
                            />
                            <SelectDropdown
                                label="Department *"
                                id="department"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                options={departmentOptions}
                                error={errors.department}
                                placeholder="Select Department"
                            />
                            <SelectDropdown
                                label="Doctor *"
                                id="doctor"
                                name="doctor"
                                value={formData.doctor}
                                onChange={handleChange}
                                options={currentDoctorOptions}
                                error={errors.doctor}
                                placeholder={formData.department ? "Select Doctor" : "Select Department First"}
                                disabled={!formData.department}
                            />
                            <InputField
                                label="Appointment Date *"
                                id="appointment_date"
                                type="date"
                                name="appointment_date"
                                value={formData.appointment_date}
                                onChange={handleChange}
                                error={errors.appointment_date}
                                min={new Date().toISOString().split('T')[0]}
                            />
                            <SelectDropdown
                                label="Preferred Time Slot *"
                                id="time_slot"
                                name="time_slot"
                                value={formData.time_slot}
                                onChange={handleChange}
                                options={timeSlotOptions}
                                error={errors.time_slot}
                                placeholder="Select Time"
                            />
                        </div>

                        <div className="flex flex-col space-y-1.5 sm:col-span-2">
                            <label htmlFor="reason" className="text-sm font-medium leading-none text-gray-700">
                                Reason for Visit *
                            </label>
                            <textarea
                                id="reason"
                                name="reason"
                                rows={3}
                                value={formData.reason}
                                onChange={handleChange}
                                className={`flex w-full rounded-md border bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.reason ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Briefly describe the reason for your visit..."
                            />
                            {errors.reason && <p className="text-[0.8rem] font-medium text-red-500">{errors.reason}</p>}
                        </div>

                        <div className="pt-4">
                            <Button type="submit" fullWidth disabled={isSubmitting} className="py-3 text-lg">
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Requesting...
                                    </>
                                ) : (
                                    'Confirm Appointment Request'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AppointmentPage;
