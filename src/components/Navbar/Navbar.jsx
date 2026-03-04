import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Hotel } from 'lucide-react';
import { HOTEL_NAME } from '../../constants/sites';
import './Navbar.css';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container nav-content">
                <Link to="/" className="logo">
                    <img src="/Images/LOGO SANS FOND.png" alt="Sainte Elisabeth House" className="logo-img" />
                </Link>

                <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                    <Link to="/" onClick={() => setIsMenuOpen(false)}>ACCUEIL</Link>
                    <Link to="/about" onClick={() => setIsMenuOpen(false)}>À PROPOS</Link>
                    <Link to="/rooms" onClick={() => setIsMenuOpen(false)}>CHAMBRES</Link>
                    <Link to="/services" onClick={() => setIsMenuOpen(false)}>SERVICES</Link>
                    <Link to="/gallery" onClick={() => setIsMenuOpen(false)}>GALERIE</Link>
                    <Link to="/contact" onClick={() => setIsMenuOpen(false)}>CONTACT</Link>
                    <Link to="/booking" className="btn-book" onClick={() => setIsMenuOpen(false)}>RÉSERVER</Link>
                    <Link to="/admin" className="admin-link" onClick={() => setIsMenuOpen(false)}>ADMIN</Link>
                </div>

                <button className="menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
