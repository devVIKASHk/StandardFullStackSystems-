import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { isAdmin } from '../utils/roles';

/**
 * Purpose: Top navigation bar.
 * Flow: Shows conditional links based on auth and role.
 */
const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
                <NavLink to="/dashboard" className="nav-brand">
                    🛡️ AuthGuard
                </NavLink>

                <div className="nav-links">
                    <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
                    <NavLink to="/notes" className="nav-link">Notes</NavLink>
                    
                    {isAdmin(user) && (
                        <NavLink to="/admin" className="nav-link">Admin Panel</NavLink>
                    )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className="text-secondary">
                        Hello, <span className="text-primary">{user?.firstName}</span>
                        <span className={`badge ${isAdmin(user) ? 'badge-admin' : 'badge-user'}`} style={{ marginLeft: '0.5rem' }}>
                            {user?.role}
                        </span>
                    </span>
                    <button onClick={logout} className="btn btn-outline btn-sm">Logout</button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
