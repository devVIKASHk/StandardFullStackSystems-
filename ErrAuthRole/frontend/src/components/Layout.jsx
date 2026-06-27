import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

/**
 * Purpose: Main layout wrapper for authenticated pages.
 */
const Layout = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main className="container" style={{ flex: 1, padding: '2rem 1rem' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
