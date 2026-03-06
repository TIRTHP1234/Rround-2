import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CalendarClock, Loader2, Video, MapPin, CreditCard, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import InputField from '../components/ui/InputField';
import SelectDropdown from '../components/ui/SelectDropdown';
import { createAppointment } from '../services/appointmentService';
import { useAuth } from '../context/AuthContext';
import emailjs from '@emailjs/browser';

const RAZORPAY_KEY_ID = 'rzp_test_SNsjPlMowPUzYy'; // Test Key

const AppointmentPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentDone, setPaymentDone] = useState(false);
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const newData = { ...prev, [name]: value };
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

    // === RAZORPAY PAYMENT ===
    const handlePayment = () => {
        if (!validate()) {
            toast.error('Please fill in all required fields before payment.');
            return;
        }

        const options = {
            key: RAZORPAY_KEY_ID,
            amount: 50000, // ₹500 in paise
            currency: 'INR',
            name: 'CareConnect',
            description: `Appointment with ${formData.doctor || 'Doctor'}`,
            image: 'https://img.icons8.com/color/96/caduceus.png',
            handler: function (response) {
                // Payment was successful
                toast.success('Payment successful! Confirming your appointment...', { duration: 3000 });
                setPaymentDone(true);
                // Automatically submit after payment
                submitAppointment();
            },
            prefill: {
                name: formData.patient_name,
                email: formData.email,
                contact: formData.phone,
            },
            theme: {
                color: '#4f46e5', // Indigo color matching our design
            },
            modal: {
                ondismiss: function () {
                    toast.error('Payment cancelled. Please try again to confirm your appointment.');
                }
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    // === ACTUAL APPOINTMENT SUBMISSION (called after payment) ===
    const submitAppointment = async () => {
        setIsSubmitting(true);
        let meetingLink = null;

        if (formData.appointment_type === 'Online') {
            const randomString = Math.random().toString(36).substring(2, 12);
            meetingLink = `https://meet.google.com/lookup/${randomString}`;
        }

        try {
            const submissionData = { ...formData };
            delete submissionData.appointment_type;
            await createAppointment(submissionData);

            let successMessage = 'Your appointment has been successfully booked and payment received!';

            // === EmailJS ===
            const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
            const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
            const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
            const finalMeetingLink = formData.appointment_type === 'Online' ? meetingLink : 'In-Person Clinic Visit';

            if (serviceId && templateId && publicKey) {
                try {
                    await emailjs.send(serviceId, templateId, {
                        to_email: formData.email,
                        to_name: formData.patient_name,
                        booking_date: formData.appointment_date,
                        booking_time: formData.time_slot,
                        doctor_name: formData.doctor,
                        meeting_link: finalMeetingLink,
                        reply_to: formData.email,
                    }, publicKey);
                } catch (emailErr) {
                    console.error('Failed to send email via EmailJS:', emailErr);
                }
            }

            navigate('/confirmation', {
                state: {
                    message: successMessage,
                    meetingLink: meetingLink,
                    email: formData.email
                }
            });

        } catch (error) {
            console.error(error);
            toast.error('Failed to save appointment. Please contact support.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handlePayment();
    };

    const currentDoctorOptions = formData.department ? doctorOptions[formData.department] : [];

    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-4rem)] flex items-center justify-center relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none"></div>

            <div className="max-w-2xl w-full glass-card rounded-3xl overflow-hidden relative z-10">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 sm:p-10 text-white">
                    <div className="flex items-center justify-center mb-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 shadow-lg">
                            <CalendarClock size={32} className="text-white" />
                        </div>
                    </div>
                    <h2 className="text-center text-3xl font-extrabold tracking-tight">Book an Appointment</h2>
                    <p className="mt-2 text-center text-blue-100 font-medium">
                        Schedule a visit with one of our expert doctors.
                    </p>

                    {/* Payment notice */}
                    <div className="mt-5 flex items-center justify-center gap-2 bg-white/10 border border-white/20 rounded-xl py-3 px-4">
                        <CreditCard size={18} className="text-blue-200 flex-shrink-0" />
                        <p className="text-sm text-blue-100">
                            <strong>₹500 consultation fee</strong> will be charged via Razorpay before booking is confirmed.
                        </p>
                    </div>
                </div>

                {/* Form Body */}
                <div className="px-6 py-8 sm:p-10">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Appointment Type Toggle */}
                        <div className="glass rounded-2xl p-4 mb-2">
                            <label className="text-sm font-semibold text-slate-700 mb-3 block">How would you like to consult?</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => handleChange({ target: { name: 'appointment_type', value: 'In-Person' } })}
                                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${formData.appointment_type === 'In-Person'
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-200'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                                        }`}
                                >
                                    <MapPin size={18} /> In-Person
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleChange({ target: { name: 'appointment_type', value: 'Online' } })}
                                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${formData.appointment_type === 'Online'
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-200'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                                        }`}
                                >
                                    <Video size={18} /> Online (Meet)
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
                                placeholder="+91 99999 99999"
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
                                placeholder={formData.department ? 'Select Doctor' : 'Select Department First'}
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

                        <div className="flex flex-col space-y-1.5">
                            <label htmlFor="reason" className="text-sm font-semibold text-slate-700">
                                Reason for Visit *
                            </label>
                            <textarea
                                id="reason"
                                name="reason"
                                rows={3}
                                value={formData.reason}
                                onChange={handleChange}
                                className={`flex w-full rounded-xl border bg-white/80 backdrop-blur px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.reason ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 hover:border-blue-200'}`}
                                placeholder="Briefly describe the reason for your visit..."
                            />
                            {errors.reason && <p className="text-[0.8rem] font-medium text-red-500">{errors.reason}</p>}
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Processing Payment...
                                    </>
                                ) : paymentDone ? (
                                    <>
                                        <CheckCircle className="h-5 w-5" />
                                        Confirmed!
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="h-5 w-5" />
                                        Pay ₹500 & Confirm Appointment
                                    </>
                                )}
                            </button>
                            <p className="text-center text-xs text-slate-500 mt-3">
                                🔒 Secured by Razorpay. Your payment info is never stored.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AppointmentPage;
