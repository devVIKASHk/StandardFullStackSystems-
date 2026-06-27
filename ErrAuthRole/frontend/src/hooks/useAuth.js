import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Purpose: Custom hook for easy access to AuthContext.
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
