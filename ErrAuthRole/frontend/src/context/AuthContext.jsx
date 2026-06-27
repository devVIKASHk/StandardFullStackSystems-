import { createContext, useState, useEffect, useCallback } from 'react';
import { getMe, loginUser as apiLogin, registerUser as apiRegister, logoutUser as apiLogout, logoutAllDevices as apiLogoutAll, refreshToken as apiRefresh } from '../api/authApi';
import { setAccessToken } from '../api/axios';

/**
 * Purpose: Global context for authentication state.
 * Flow: On mount, attempts to refresh token to get access token. If success, gets user data.
 */
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const checkAuth = useCallback(async () => {
        try {
            // Attempt to refresh token
            const res = await apiRefresh();
            setAccessToken(res.data.accessToken);
            
            // If we got a new access token, fetch user profile
            const userRes = await getMe();
            setUser(userRes.data);
            setIsAuthenticated(true);
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = async (email, password) => {
        const res = await apiLogin(email, password);
        setAccessToken(res.data.accessToken);
        setUser(res.data.user);
        setIsAuthenticated(true);
    };

    const register = async (firstName, lastName, email, password) => {
        const res = await apiRegister(firstName, lastName, email, password);
        setAccessToken(res.data.accessToken);
        setUser(res.data.user);
        setIsAuthenticated(true);
    };

    const logout = async () => {
        try {
            await apiLogout();
        } catch (err) {
            console.error('Logout error', err);
        } finally {
            setAccessToken(null);
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const logoutAll = async () => {
        try {
            await apiLogoutAll();
        } catch (err) {
            console.error('Logout all error', err);
        } finally {
            setAccessToken(null);
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, isAuthenticated, login, register, logout, logoutAll }}>
            {children}
        </AuthContext.Provider>
    );
};
