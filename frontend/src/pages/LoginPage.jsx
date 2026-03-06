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
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">

            {/* Background Decorative Blobs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

            <div className="max-w-md w-full glass-card rounded-3xl p-8 sm:p-10 relative z-10">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-8 text-white shadow-lg transform -translate-y-4">
                    <LogIn className="h-8 w-8" />
                </div>

                <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 text-center mb-8 tracking-tight">Welcome Back</h2>

                {/* Hackathon Demo Notice */}
                <div className="glass border border-blue-200/50 rounded-xl p-5 mb-8 flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-slate-700">
                            <strong>Hackathon Demo Login:</strong>
                            <p className="mt-1 leading-relaxed">You may log in with <strong>any email address</strong> to test the meeting link feature. The password is fixed as <strong>demo123</strong>.</p>
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
                    <Button type="submit" fullWidth className="py-3 mt-4 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 border-0 rounded-xl">
                        Sign In
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
