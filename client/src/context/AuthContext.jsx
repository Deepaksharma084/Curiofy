import { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const AuthContext = createContext(null);

// Custom hook as a named export
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// AuthProvider as a named export
export function AuthProvider({ children }) {
    const [owner, setOwner] = useState(() => {
        // Trying to load owner from localStorage on first render
        const stored = localStorage.getItem('owner');
        return stored ? JSON.parse(stored) : null;
    });

    // Verify token on mount and when owner changes
    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/owner/verify`, {
                    credentials: 'include'
                });
                
                if (!response.ok) {
                    setOwner(null);
                    localStorage.removeItem('owner');
                }
            } catch (error) {
                setOwner(null);
                localStorage.removeItem('owner');
            }
        };

        if (owner) {
            verifyAuth();
        }
    }, []);

    useEffect(() => {
        if (owner) {
            localStorage.setItem('owner', JSON.stringify(owner));
        } else {
            localStorage.removeItem('owner');
        }
    }, [owner]);

    return (
        <AuthContext.Provider value={{ owner, setOwner }}>
            {children}
        </AuthContext.Provider>
    );
}

