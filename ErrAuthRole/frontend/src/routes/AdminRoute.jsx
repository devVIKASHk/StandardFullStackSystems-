import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import { ROLES } from '../utils/roles';

/**
 * Purpose: Route guard for admin users.
 * Flow: If not authenticated -> /login. If authenticated but not admin -> /dashboard.
 */
const AdminRoute = () => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user?.role !== ROLES.ADMIN) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;
