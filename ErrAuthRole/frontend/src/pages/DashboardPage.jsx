import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { isAdmin } from '../utils/roles';
import { getNotes } from '../api/noteApi';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * Purpose: Main dashboard landing page after login.
 */
const DashboardPage = () => {
    const { user, logoutAll } = useAuth();
    const [stats, setStats] = useState({ notesCount: 0, loading: true });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getNotes();
                setStats({ notesCount: res.data.length, loading: false });
            } catch (error) {
                console.error('Failed to fetch notes for stats', error);
                setStats({ notesCount: 0, loading: false });
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="page">
            <div className="page-header">
                <h1 className="page-title">Dashboard</h1>
            </div>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Welcome, {user?.firstName}!</h2>
                <p className="text-secondary">This is your secure dashboard. You are logged in as a <span className={`badge ${isAdmin(user) ? 'badge-admin' : 'badge-user'}`}>{user?.role}</span>.</p>
            </div>

            <div className="dashboard-stats">
                <div className="stat-card card">
                    <div className="stat-label">Total Notes</div>
                    <div className="stat-value">
                        {stats.loading ? <span className="spinner" style={{ width: '20px', height: '20px', display: 'inline-block', borderWidth: '2px' }}></span> : stats.notesCount}
                    </div>
                </div>
                <div className="stat-card card">
                    <div className="stat-label">Account Created</div>
                    <div className="stat-value" style={{ fontSize: '1.25rem' }}>
                        {new Date(user?.createdAt).toLocaleDateString()}
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/notes" className="btn btn-primary">Manage Notes</Link>
                {isAdmin(user) && (
                    <Link to="/admin" className="btn btn-outline">Admin Panel</Link>
                )}
                <button onClick={logoutAll} className="btn btn-outline" style={{ borderColor: 'var(--error)', color: 'var(--error)' }}>
                    Logout All Devices
                </button>
            </div>
        </div>
    );
};

export default DashboardPage;
