import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

const Home = lazy(() => import('./pages/Home'));
const Rooms = lazy(() => import('./pages/Rooms'));
const RoomDetail = lazy(() => import('./pages/RoomDetail'));
const Services = lazy(() => import('./pages/Services'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Contact = lazy(() => import('./pages/Contact'));
const Booking = lazy(() => import('./pages/Booking'));
const About = lazy(() => import('./pages/About'));
const Dashboard = lazy(() => import('./components/Admin/Dashboard'));

const Loader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--color-background)' }}>
    <div className="spinner"></div>
    <style>{`
      .spinner {
        width: 50px;
        height: 50px;
        border: 5px solid rgba(0,0,0,0.1);
        border-top-color: var(--color-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      @keyframes spin { 
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);


const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="app">
      {!isAdminPath && <Navbar />}
      <main className={isAdminPath ? '' : 'main-content'}>
        {children}
      </main>
      {!isAdminPath && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/rooms/:id" element={<RoomDetail />} />
            <Route path="/services" element={<Services />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin" element={<Dashboard />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;
