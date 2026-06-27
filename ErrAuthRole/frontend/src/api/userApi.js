import axiosInstance from './axios';

/**
 * Purpose: API calls related to users.
 */

export const getAllUsers = async () => {
    const response = await axiosInstance.get('/users');
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await axiosInstance.delete(`/users/${id}`);
    return response.data;
};

export const updateUserRole = async (id, role) => {
    const response = await axiosInstance.patch(`/users/${id}/role`, { role });
    return response.data;
};

export const updateProfile = async (data) => {
    const response = await axiosInstance.patch('/users/profile', data);
    return response.data;
};
