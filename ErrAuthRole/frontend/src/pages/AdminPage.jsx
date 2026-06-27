import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { getAllUsers, updateUserRole, deleteUser } from '../api/userApi';
import UserTable from '../components/UserTable';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * Purpose: Admin page to manage all users.
 */
const AdminPage = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await getAllUsers();
            setUsers(res.data);
        } catch (error) {
            // Ignored, global interceptor handles it
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        try {
            await updateUserRole(userId, newRole);
            fetchUsers();
        } catch (error) {
            if (error.response?.status === 400) {
                toast.error(error.response?.data?.message || 'Validation failed');
            }
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await deleteUser(userId);
                fetchUsers();
            } catch (error) {
                if (error.response?.status === 400) {
                    toast.error(error.response?.data?.message || 'Validation failed');
                }
            }
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="page">
            <div className="page-header">
                <h1 className="page-title">User Management</h1>
            </div>

            {users.length === 0 ? (
                <div className="empty-state">
                    <p className="text-secondary">No users found.</p>
                </div>
            ) : (
                <UserTable 
                    users={users} 
                    currentUser={currentUser}
                    onRoleChange={handleRoleChange}
                    onDelete={handleDeleteUser}
                />
            )}
        </div>
    );
};

export default AdminPage;
