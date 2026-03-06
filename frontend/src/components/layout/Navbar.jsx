import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HeartPulse, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const Navbar = () => {
    const location = useLocation();
    const { user, logout } = useAuth();

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Submit Query', path: '/query' },
        { name: 'Book Appointment', path: '/appointment' },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                                <HeartPulse size={24} />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-gray-900">
                                Care<span className="text-blue-600">Connect</span>
                            </span>
                        </Link>
                    </div>
                    <div className="hidden md:flex flex-1 justify-center space-x-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${location.pathname === link.path
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                                    <User className="h-4 w-4 text-blue-600" />
                                    <span>{user.name}</span>
                                </div>
                                <Button variant="outline" size="sm" onClick={logout} className="py-1.5 px-3">
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <Link to="/login">
                                <Button variant="primary" size="sm" className="py-2 px-4 shadow-sm">
                                    Login for Demo
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
