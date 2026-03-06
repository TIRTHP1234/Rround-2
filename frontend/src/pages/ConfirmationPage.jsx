import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle, Video, Mail, CalendarClock } from 'lucide-react';
import Button from '../components/ui/Button';

const ConfirmationPage = () => {
    const location = useLocation();
    const state = location.state;

    if (!state || !state.message) {
        return <Navigate to="/" replace />;
    }

    const { message, meetingLink, email } = state;

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50 px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl overflow-hidden p-8 sm:p-10">

                <div className="flex flex-col items-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>

                    <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Request Received!</h2>

                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                        {message}
                    </p>
                </div>

                {meetingLink && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 mt-2 space-y-4">
                        <div className="flex items-center gap-3 text-blue-900 font-semibold text-lg border-b border-blue-200 pb-3">
                            <Video className="h-6 w-6 text-blue-600" />
                            Online Appointment Details
                        </div>

                        <div className="space-y-3 pt-2 text-sm text-gray-700">
                            <div className="flex items-start gap-3">
                                <CalendarClock className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="font-medium text-gray-900">Virtual Meeting Room</p>
                                    <a href={meetingLink} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all">
                                        {meetingLink}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="font-medium text-gray-900">Confirmation Sent</p>
                                    <p>
                                        We've sent a calendar invitation and meeting link to <span className="font-semibold">{email}</span>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex flex-col space-y-4 pt-4 border-t border-gray-100 mt-4">
                    <Link to="/">
                        <Button fullWidth className="py-3 text-lg">
                            Return to Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationPage;
