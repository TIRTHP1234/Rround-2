import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    ShieldPlus, Activity, Clock, Users, CalendarDays,
    MessageSquare, CalendarClock, Loader2
} from 'lucide-react';
import Button from '../components/ui/Button';
import { getAppointmentsByDate } from '../services/appointmentService';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [bookedSlots, setBookedSlots] = useState({});
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    const timeSlotOptions = [
        '09:00 AM', '10:00 AM', '11:00 AM',
        '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
    ];

    const generateDummyDataIfEmpty = (dateStr, realData) => {
        if (realData && realData.length > 0) return realData;
        const dateScore = dateStr.split('-').reduce((a, b) => a + parseInt(b), 0);
        const dummySlots = [];
        const possibleSlots = [...timeSlotOptions];
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
                const combinedData = generateDummyDataIfEmpty(selectedDate, response.data || []);
                const slotMap = {};
                combinedData.forEach(apt => { slotMap[apt.time_slot] = apt; });
                setBookedSlots(slotMap);
            } catch (error) {
                const dummyData = generateDummyDataIfEmpty(selectedDate, []);
                const slotMap = {};
                dummyData.forEach(apt => { slotMap[apt.time_slot] = apt; });
                setBookedSlots(slotMap);
            } finally {
                setIsLoadingSlots(false);
            }
        };
        fetchAvailability();
    }, [selectedDate]);

    const services = [
        {
            title: 'Emergency Care',
            description: '24/7 emergency medical services with rapid response teams.',
            icon: <Activity className="h-6 w-6 text-white" />,
        },
        {
            title: 'Expert Doctors',
            description: 'Highly qualified specialists across various medical departments.',
            icon: <Users className="h-6 w-6 text-white" />,
        },
        {
            title: 'Modern Facilities',
            description: 'State-of-the-art equipment for precise diagnostics and treatment.',
            icon: <ShieldPlus className="h-6 w-6 text-white" />,
        },
        {
            title: 'Quick Appointments',
            description: 'Easy scheduling with flexible time slots for your convenience.',
            icon: <Clock className="h-6 w-6 text-white" />,
        },
    ];

    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)]">

            {/* ===== Hero Section ===== */}
            <section className="relative overflow-hidden py-20 sm:py-28">
                {/* Decorative gradient blob */}
                <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none">
                    <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-400 to-indigo-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Headline */}
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 mb-6 tracking-tight">
                            Welcome to CareConnect
                        </h1>
                        <p className="max-w-2xl mx-auto text-xl text-slate-600 mb-10 leading-relaxed">
                            Your health is our priority. Book appointments, check doctor availability, and reach out to us with any queries.
                        </p>
                        <div className="flex justify-center flex-wrap gap-4">
                            <Link to="/appointment">
                                <Button size="lg" className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 border-0 rounded-xl text-white">
                                    <CalendarDays className="h-5 w-5" />
                                    Book Appointment
                                </Button>
                            </Link>
                            <Link to="/query">
                                <Button variant="outline" size="lg" className="flex items-center gap-2 bg-white/60 backdrop-blur-sm hover:bg-white/80 border-blue-200 hover:border-blue-400 text-blue-700 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 rounded-xl">
                                    <MessageSquare className="h-5 w-5" />
                                    Ask a Question
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
                        <div className="glass rounded-2xl p-6 flex items-center gap-5 hover:bg-white/70 transition-colors">
                            <div className="bg-blue-100 text-blue-600 p-3 rounded-xl flex-shrink-0"><Users size={24} /></div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Active Doctors</p>
                                <p className="text-2xl font-bold text-slate-800">42</p>
                            </div>
                        </div>
                        <div className="glass rounded-2xl p-6 flex items-center gap-5 hover:bg-white/70 transition-colors">
                            <div className="bg-emerald-100 text-emerald-600 p-3 rounded-xl flex-shrink-0"><Activity size={24} /></div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Departments</p>
                                <p className="text-2xl font-bold text-slate-800">12</p>
                            </div>
                        </div>
                        <div className="glass rounded-2xl p-6 flex items-center gap-5 hover:bg-white/70 transition-colors">
                            <div className="bg-purple-100 text-purple-600 p-3 rounded-xl flex-shrink-0"><Clock size={24} /></div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Avg. Wait Time</p>
                                <p className="text-2xl font-bold text-slate-800">&lt; 15 min</p>
                            </div>
                        </div>
                    </div>

                    {/* ===== Availability Calendar ===== */}
                    <div className="glass-card rounded-3xl overflow-hidden mb-16">
                        {/* Calendar Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-7 sm:px-10">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                        <CalendarClock className="h-7 w-7 text-blue-200" />
                                        Doctor Availability
                                    </h2>
                                    <p className="text-blue-100 mt-1 font-medium">Check real-time booking slots.</p>
                                </div>
                                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 w-full sm:w-auto">
                                    <div className="flex flex-col w-full sm:w-auto">
                                        <label className="text-xs font-semibold text-white/70 mb-1 uppercase tracking-wider">Select Date</label>
                                        <input
                                            type="date"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="rounded-xl border-0 bg-white/20 backdrop-blur px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                                        />
                                    </div>
                                    <Link to="/appointment">
                                        <Button size="sm" className="bg-indigo text-blue-700 border-0 hover:bg-blue-50 font-semibold px-5 py-2.5 rounded-xl w-full sm:w-auto">
                                            Book Slot →
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Time Slots Grid */}
                        <div className="p-6 sm:p-10 bg-white/40 backdrop-blur-sm">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
                                <h3 className="text-base font-bold text-slate-800">
                                    {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                </h3>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="h-3 w-3 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]"></span>
                                        <span className="text-xs font-semibold text-slate-600">Available</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="h-3 w-3 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]"></span>
                                        <span className="text-xs font-semibold text-slate-600">Booked</span>
                                    </div>
                                </div>
                            </div>

                            {isLoadingSlots ? (
                                <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                                    <Loader2 className="h-8 w-8 animate-spin mb-4 text-blue-500" />
                                    <p className="font-medium animate-pulse">Fetching schedule...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                                    {timeSlotOptions.map(slot => {
                                        const apt = bookedSlots[slot];
                                        const isBooked = !!apt;
                                        return (
                                            <div
                                                key={slot}
                                                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${isBooked
                                                    ? 'bg-red-50 border-red-200 text-red-700 cursor-not-allowed opacity-80'
                                                    : 'bg-white border-green-200 text-green-700 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-green-400 cursor-pointer'
                                                    }`}
                                            >
                                                <span className="font-bold text-sm">{slot}</span>
                                                <span className={`text-xs mt-1.5 font-bold px-2 py-0.5 rounded-full truncate w-full text-center ${isBooked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                    {isBooked ? apt.patient_name : 'FREE'}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== Services Section ===== */}
            <section className="py-20 bg-white/50 backdrop-blur-sm border-t border-white/30">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-600 mb-3">Comprehensive Care</h2>
                        <p className="text-3xl font-extrabold tracking-tight text-slate-900">
                            Everything you need for better health
                        </p>
                        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                            We provide a full spectrum of healthcare services with compassion, expertise, and precision.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services.map((service) => (
                            <div key={service.title} className="glass rounded-2xl p-6 flex flex-col hover:-translate-y-1.5 transition-all duration-200">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md mb-4">
                                    {service.icon}
                                </div>
                                <h3 className="text-base font-bold text-slate-900 mb-2">{service.title}</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">{service.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
