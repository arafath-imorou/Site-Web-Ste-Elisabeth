import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, MessageCircle } from 'lucide-react';
import { HOTEL_NAME, SITE_DETAILS, SITES } from '../../constants/sites';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-info">
                        <img src="/Images/LOGO SANS FOND.png" alt="Sainte Elisabeth House" className="footer-logo-img" width="150" height="50" />
                        <p>Une expérience unique au Bénin. Confort, élégance et hospitalité africaine sur nos deux sites d'Abomey-Calavi et Allada.</p>
                        <div className="social-links">
                            <a href="#" className="facebook" aria-label="Facebook"><Facebook size={20} /></a>
                            <a href="https://wa.me/2290166655757" className="whatsapp" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><MessageCircle size={20} /></a>
                        </div>
                    </div>

                    <div className="footer-links">
                        <h4>LIENS RAPIDES</h4>
                        <ul>
                            <li><Link to="/">Accueil</Link></li>
                            <li><Link to="/about">À Propos</Link></li>
                            <li><Link to="/rooms">Chambres & Suites</Link></li>
                            <li><Link to="/services">Services</Link></li>
                            <li><Link to="/gallery">Galerie</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                        </ul>
                    </div>

                    <div className="footer-contact">
                        <h4>NOS SITES</h4>
                        <div className="site-footer-info">
                            <h5>Site Abomey-Calavi</h5>
                            <div className="contact-item">
                                <MapPin size={16} />
                                <span>{SITE_DETAILS[SITES.ABOMEY_CALAVI].address}</span>
                            </div>
                            <div className="contact-item">
                                <Phone size={16} />
                                <div className="phone-group">
                                    <a
                                        href={`https://wa.me/${SITE_DETAILS[SITES.ABOMEY_CALAVI].phone.replace(/[^0-9]/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="footer-whatsapp-link"
                                    >
                                        {SITE_DETAILS[SITES.ABOMEY_CALAVI].phone} (WhatsApp)
                                    </a>
                                    {SITE_DETAILS[SITES.ABOMEY_CALAVI].secondaryPhone && (
                                        <div className="secondary-contact">{SITE_DETAILS[SITES.ABOMEY_CALAVI].secondaryPhone}</div>
                                    )}
                                </div>
                            </div>
                            <div className="contact-item">
                                <Facebook size={16} />
                                <span>DF FIFATIN</span>
                            </div>
                        </div>
                        <div className="site-footer-info" style={{ marginTop: '15px' }}>
                            <h5>Site Allada</h5>
                            <div className="contact-item">
                                <MapPin size={16} />
                                <span>{SITE_DETAILS[SITES.ALLADA].address}</span>
                            </div>
                            <div className="contact-item">
                                <Phone size={16} />
                                <div className="phone-group">
                                    <a
                                        href={`https://wa.me/${SITE_DETAILS[SITES.ALLADA].phone.replace(/[^0-9]/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="footer-whatsapp-link"
                                    >
                                        {SITE_DETAILS[SITES.ALLADA].phone} (WhatsApp)
                                    </a>
                                    {SITE_DETAILS[SITES.ALLADA].secondaryPhone && (
                                        <div className="secondary-contact">{SITE_DETAILS[SITES.ALLADA].secondaryPhone}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-partner-logo">
                    <img src="/Images/LOGO SDF.jpg" alt="Logo SDF" className="sdf-logo" width="120" height="120" />
                </div>
                <div className="footer-bottom">
                    <p>&copy; <Link to="/admin" style={{ color: 'inherit', textDecoration: 'none', cursor: 'default' }}>{new Date().getFullYear()}</Link> {HOTEL_NAME}. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
