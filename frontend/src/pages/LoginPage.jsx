import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LogIn, Info } from 'lucide-react';
import Button from '../components/ui/Button';
import InputField from '../components/ui/InputField';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('Please enter your email and the demo password');
            return;
        }

        if (password !== 'demo123') {
            toast.error('Invalid password. Please use the demo password: demo123');
            return;
        }

        // Pass the user's custom email to the auth context
        login(email);
        toast.success(`Logged in as ${email}`);
        navigate('/');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50 px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden p-8 sm:p-10">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 mb-6 text-blue-600">
                    <LogIn className="h-8 w-8" />
                </div>

                <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">Patient Login</h2>

                {/* Hackathon Demo Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800">
                            <strong>Hackathon Demo Login:</strong>
                            <p className="mt-1">You may log in with <strong>any email address</strong> to test the meeting link feature. The password is fixed as <strong>demo123</strong>.</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <InputField
                        label="Email Address"
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                    />
                    <InputField
                        label="Password"
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                    />
                    <Button type="submit" fullWidth className="py-2.5 text-lg">
                        Sign In
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
