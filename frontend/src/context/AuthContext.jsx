import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Load from local storage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('demo_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (email) => {
        // For the hackathon demo, we just set the hardcoded user
        const demoUser = {
            name: 'Demo Patient',
            email: email,
            phone: '(555) 123-4567',
        };
        setUser(demoUser);
        localStorage.setItem('demo_user', JSON.stringify(demoUser));
        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('demo_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
