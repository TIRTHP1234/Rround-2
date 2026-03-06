import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HeartPulse, Loader2 } from 'lucide-react';
import Button from '../components/ui/Button';
import InputField from '../components/ui/InputField';
import SelectDropdown from '../components/ui/SelectDropdown';
import { submitPatientQuery } from '../services/queryService';
import { useAuth } from '../context/AuthContext';

const QueryFormPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        department: '',
        symptoms: '',
        message: '',
        urgency_level: 'Normal',
    });

    // Auto-fill user data if logged in
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || prev.name,
                email: user.email || prev.email,
                phone: user.phone || prev.phone,
            }));
        }
    }, [user]);

    const [errors, setErrors] = useState({});

    const departmentOptions = [
        { value: 'General Medicine', label: 'General Medicine' },
        { value: 'Cardiology', label: 'Cardiology' },
        { value: 'Neurology', label: 'Neurology' },
        { value: 'Orthopedics', label: 'Orthopedics' },
        { value: 'Pediatrics', label: 'Pediatrics' },
    ];

    const urgencyOptions = [
        { value: 'Normal', label: 'Normal' },
        { value: 'Medium', label: 'Medium' },
        { value: 'High', label: 'High' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Full Name is required';
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.phone) newErrors.phone = 'Phone Number is required';
        if (!formData.department) newErrors.department = 'Department is required';
        if (!formData.symptoms) newErrors.symptoms = 'Symptoms are required';

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
        try {
            await submitPatientQuery(formData);
            toast.success('Query submitted successfully!');
            navigate('/confirmation', { state: { message: 'Your health query has been successfully submitted. Our medical team will review it and contact you shortly.' } });
        } catch (error) {
            console.error(error);
            toast.error('Failed to submit query. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-4rem)] flex items-center justify-center">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header styling */}
                <div className="bg-blue-600 px-6 py-8 sm:p-10 text-white">
                    <div className="flex items-center justify-center mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                            <HeartPulse size={28} className="text-white" />
                        </div>
                    </div>
                    <h2 className="text-center text-3xl font-extrabold">Submit a Health Query</h2>
                    <p className="mt-2 text-center text-blue-100">
                        Describe your concerns, and our specialists will get back to you.
                    </p>
                </div>

                {/* Form Body */}
                <div className="px-6 py-8 sm:p-10 text-gray-800">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                            <InputField
                                label="Full Name *"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                error={errors.name}
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
                        </div>

                        <div className="flex flex-col space-y-1.5">
                            <label htmlFor="symptoms" className="text-sm font-medium leading-none text-gray-700">
                                Symptoms / Concern *
                            </label>
                            <textarea
                                id="symptoms"
                                name="symptoms"
                                rows={3}
                                value={formData.symptoms}
                                onChange={handleChange}
                                className={`flex w-full rounded-md border bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.symptoms ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Please describe your symptoms briefly..."
                            />
                            {errors.symptoms && <p className="text-[0.8rem] font-medium text-red-500">{errors.symptoms}</p>}
                        </div>

                        <div className="flex flex-col space-y-1.5">
                            <label htmlFor="message" className="text-sm font-medium leading-none text-gray-700">
                                Additional Message (Optional)
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                rows={2}
                                value={formData.message}
                                onChange={handleChange}
                                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Any other details we should know?"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <SelectDropdown
                                label="Urgency Level *"
                                id="urgency_level"
                                name="urgency_level"
                                value={formData.urgency_level}
                                onChange={handleChange}
                                options={urgencyOptions}
                            />
                        </div>

                        <div className="pt-4">
                            <Button type="submit" fullWidth disabled={isSubmitting} className="py-3 text-lg">
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Query'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default QueryFormPage;
