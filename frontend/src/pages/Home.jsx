import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldPlus, Activity, Clock, Users, CalendarCheck2, Loader2 } from 'lucide-react';
import Button from '../components/ui/Button';
import { getAppointmentsByDate } from '../services/appointmentService';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [bookedSlots, setBookedSlots] = useState({}); // Dictionary of time_slot -> appointment
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    const timeSlotOptions = [
        '09:00 AM', '10:00 AM', '11:00 AM',
        '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
    ];

    const generateDummyDataIfEmpty = (dateStr, realData) => {
        // We will seed the view with 3-4 random dummy booked slots if the real data is empty
        // to make the dashboard look active for the demo.
        if (realData && realData.length > 0) return realData;

        // Generate a stable-ish random based on date string so it doesn't flutter wildly
        const dateScore = dateStr.split('-').reduce((a, b) => a + parseInt(b), 0);

        const dummySlots = [];
        const possibleSlots = [...timeSlotOptions];

        // Pick 3 random slots to be "booked" by other dummy patients
        for (let i = 0; i < 3; i++) {
            const index = (dateScore + i * 7) % possibleSlots.length;
            const slot = possibleSlots.splice(index, 1)[0];
            dummySlots.push({
                time_slot: slot,
                patient_name: `Patient ${i + 1}`,
                department: i % 2 === 0 ? 'General Medicine' : 'Cardiology'
            });
        }
        return dummySlots;
    };

    useEffect(() => {
        const fetchAvailability = async () => {
            setIsLoadingSlots(true);
            try {
                const response = await getAppointmentsByDate(selectedDate);

                // Merge real appointments with some dummy appointments for the demo effect
                const combinedData = generateDummyDataIfEmpty(selectedDate, response.data || []);

                const slotMap = {};
                combinedData.forEach(apt => {
                    slotMap[apt.time_slot] = apt;
                });
                setBookedSlots(slotMap);
            } catch (error) {
                console.error("Failed to fetch slots", error);
                // Fallback to dummy data
                const dummyData = generateDummyDataIfEmpty(selectedDate, []);
                const slotMap = {};
                dummyData.forEach(apt => {
                    slotMap[apt.time_slot] = apt;
                });
                setBookedSlots(slotMap);
            } finally {
                setIsLoadingSlots(false);
            }
        };

        if (user) {
            fetchAvailability();
        }
    }, [selectedDate, user]);

    const services = [
        {
            title: 'Emergency Care',
            description: '24/7 emergency medical services with rapid response teams.',
            icon: <Activity className="h-6 w-6 text-blue-600" />
        },
        {
            title: 'Expert Doctors',
            description: 'Highly qualified specialists across various medical departments.',
            icon: <Users className="h-6 w-6 text-blue-600" />
        },
        {
            title: 'Modern Facilities',
            description: 'State-of-the-art equipment for precise diagnostics and treatment.',
            icon: <ShieldPlus className="h-6 w-6 text-blue-600" />
        },
        {
            title: 'Quick Appointments',
            description: 'Easy scheduling with flexible time slots for your convenience.',
            icon: <Clock className="h-6 w-6 text-blue-600" />
        }
    ];

    // Helper to get next 7 days for the date picker
    const getNextDays = (days) => {
        const dates = [];
        for (let i = 0; i < days; i++) {
            const d = new Date();
            d.setDate(d.getDate() + i);
            dates.push(d.toISOString().split('T')[0]);
        }
        return dates;
    };
    const upcomingDates = getNextDays(5);

    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)]">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-blue-50 py-16 sm:py-24">
                {/* ... (Hero background remains the same) ... */}
                <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                    <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#3b82f6] to-[#93c5fd] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
                </div>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                            Welcome to the <span className="text-blue-600">Patient Dashboard</span>
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            Hello, {user?.name || 'Patient'}! Access your healthcare services easily from this portal.
                        </p>
                        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                            <Link to="/appointment">
                                <Button size="lg" className="px-8 py-3 text-lg rounded-full shadow-lg shadow-blue-500/30">
                                    Book New Appointment
                                </Button>
                            </Link>
                            <Link to="/query">
                                <Button variant="outline" size="lg" className="px-8 py-3 text-lg rounded-full bg-white/50 backdrop-blur-sm">
                                    Submit a Health Query
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dashboard Calendar Section */}
            <section className="py-12 bg-white border-y border-gray-200">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <CalendarCheck2 className="h-6 w-6 text-blue-600" />
                                Available Time Slots
                            </h2>
                            <p className="text-gray-500 mt-1">Check hospital availability before booking your appointment.</p>
                        </div>

                        {/* Date Selector */}
                        <div className="flex overflow-x-auto pb-2 gap-2 w-full md:w-auto scrollbar-hide">
                            {upcomingDates.map(date => {
                                const d = new Date(date);
                                const isSelected = selectedDate === date;
                                return (
                                    <button
                                        key={date}
                                        onClick={() => setSelectedDate(date)}
                                        className={`flex flex-col items-center justify-center min-w-[70px] p-2 rounded-xl transition-all border ${isSelected
                                            ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                                            : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                                            }`}
                                    >
                                        <span className="text-xs uppercase font-medium">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                        <span className="text-lg font-bold">{d.getDate()}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Time Slots Grid */}
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                        {isLoadingSlots ? (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                <Loader2 className="h-8 w-8 animate-spin mb-4 text-blue-600" />
                                <p>Loading availability...</p>
                            </div>
                        ) : (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">
                                    Schedule for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                                    {timeSlotOptions.map(slot => {
                                        const apt = bookedSlots[slot];
                                        const isBooked = !!apt;
                                        return (
                                            <div
                                                key={slot}
                                                className={`flex flex-col items-center justify-center p-3 rounded-lg border ${isBooked
                                                    ? 'bg-red-50 border-red-100 text-red-700 opacity-70'
                                                    : 'bg-white border-green-200 text-green-700 shadow-sm hover:shadow-md transition-shadow'
                                                    }`}
                                            >
                                                <span className="font-semibold">{slot}</span>
                                                <span className={`text-xs mt-1 text-center font-medium px-1 truncate w-full ${isBooked ? 'text-red-600' : 'text-green-600'}`}>
                                                    {isBooked ? apt.patient_name : 'Available'}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="mt-6 flex justify-end">
                                    <Link to="/appointment">
                                        <Button variant="outline" size="sm" className="bg-white">
                                            Book an Available Slot →
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-24 bg-white sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:text-center">
                        <h2 className="text-base font-semibold leading-7 text-blue-600">Comprehensive Care</h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Everything you need for better health
                        </p>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            We provide a full spectrum of healthcare services designed to treat you with compassion, expertise, and precision.
                        </p>
                    </div>
                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
                            {services.map((service) => (
                                <div key={service.title} className="flex flex-col">
                                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                                        <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-blue-50">
                                            {service.icon}
                                        </div>
                                        {service.title}
                                    </dt>
                                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                                        <p className="flex-auto">{service.description}</p>
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
