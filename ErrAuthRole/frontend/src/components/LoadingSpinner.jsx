/**
 * Purpose: Reusable loading indicator.
 */
const LoadingSpinner = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%' }}>
            <div className="spinner"></div>
        </div>
    );
};

export default LoadingSpinner;
