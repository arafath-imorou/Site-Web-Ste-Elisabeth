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
  <div className="global-loader">
    <div className="loader-content">
      <div className="spinner"></div>
      <p>Sainte Elisabeth House...</p>
    </div>
    <style>{`
      .global-loader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #FDFBF7;
        z-index: 9999;
      }
      .loader-content {
        text-align: center;
      }
      .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid rgba(212, 175, 55, 0.1);
        border-top-color: #D4AF37;
        border-radius: 50%;
        margin: 0 auto 15px;
        animation: spin 0.8s linear infinite;
      }
      @keyframes spin { 
        to { transform: rotate(360deg); }
      }
      .global-loader p {
        font-family: 'Playfair Display', serif;
        color: #D4AF37;
        font-size: 1.1rem;
        letter-spacing: 2px;
        animation: pulse 1.5s ease-in-out infinite;
      }
      @keyframes pulse {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
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
