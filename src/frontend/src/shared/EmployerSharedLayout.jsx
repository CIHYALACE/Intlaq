import { useState, useEffect } from 'react';
import { useLocation, Outlet, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

export default function EmployerSharedLayout() {
    const location = useLocation();
    const currentPath = location.pathname.split('/').pop() || '';
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    
    // Check if user is authenticated and is an employer
    const isAuthenticated = !!localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    // Handle window resize for responsive layout
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    // Map path to section name for sidebar highlighting
    const getActiveSectionFromPath = (path) => {
        const pathToSection = {
            '': 'dashboard',
            'post-job': 'post job',
            'manage-jobs': 'manage jobs',
            'applicants': 'applicants',
            'company-profile': 'company profile',
            'settings': 'settings'
        };
        
        return pathToSection[path] || 'dashboard';
    };
    
    const activeSection = getActiveSectionFromPath(currentPath);

    // Redirect to login if not authenticated or not an employer
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    if (userRole !== 'employer') {
        return <Navigate to="/unauthorized" replace />;
    }
    
    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            
            <div className="container-fluid flex-grow-1 bg-light">
                <div className="row g-0">
                    {/* Desktop Sidebar */}
                    <div className="col-md-3 col-lg-2 d-md-block d-none p-0 bg-white shadow-sm">
                        <Sidebar active={activeSection} />
                    </div>
                    
                    {/* Mobile Sidebar Overlay */}
                    {isMobile && mobileSidebarOpen && (
                        <div 
                            className="position-fixed top-0 start-0 w-100 h-100"
                            style={{ 
                                zIndex: 1040, 
                                backgroundColor: 'rgba(0,0,0,0.5)' 
                            }}
                            onClick={() => setMobileSidebarOpen(false)}
                        >
                            <div 
                                className="h-100 bg-white shadow" 
                                style={{ width: '280px' }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="d-flex justify-content-end p-3">
                                    <button 
                                        className="btn-close" 
                                        onClick={() => setMobileSidebarOpen(false)}
                                        aria-label="Close sidebar"
                                    />
                                </div>
                                <Sidebar 
                                    active={activeSection}
                                    onItemClick={() => setMobileSidebarOpen(false)}
                                />
                            </div>
                        </div>
                    )}
                    
                    {/* Main Content */}
                    <main className="col-12 col-md-9 col-lg-10 ms-auto p-4">
                        {/* Mobile Menu Toggle */}
                        <button 
                            className="btn btn-outline-primary mb-3 d-md-none d-flex align-items-center"
                            onClick={() => setMobileSidebarOpen(true)}
                        >
                            <i className="fas fa-bars me-2"></i>
                            Menu
                        </button>
                        
                        <div className="bg-white rounded-3 p-4 shadow-sm">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
            
            <Footer className="mt-auto" />
        </div>
    );
}