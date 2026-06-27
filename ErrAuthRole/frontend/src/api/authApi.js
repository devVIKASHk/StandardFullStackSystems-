import axiosInstance from './axios';

/**
 * Purpose: API calls related to authentication.
 * Flow: Calls backend routes and returns data.
 */

export const loginUser = async (email, password) => {
    const response = await axiosInstance.post('/auth/login', { email, password });
    return response.data;
};

export const registerUser = async (userName, email, password) => {
    const response = await axiosInstance.post('/auth/register', {userName, email, password });
    return response.data;
};

export const logoutUser = async () => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
};

export const logoutAllDevices = async () => {
    const response = await axiosInstance.post('/auth/logout-all');
    return response.data;
};

export const refreshToken = async () => {
    const response = await axiosInstance.post('/auth/refresh');
    return response.data;
};

export const getMe = async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
};
