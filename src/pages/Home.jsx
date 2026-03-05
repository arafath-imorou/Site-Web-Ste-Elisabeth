import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar, Users, ChevronRight, Star, MapPin } from 'lucide-react';
import { MOCK_ROOMS } from '../data/mockRooms';
import { formatPrice } from '../lib/formatUtils';
import './Home.css';

const RoomsPreview = React.lazy(() => import('../components/Home/RoomsPreview'));
const Features = React.lazy(() => import('../components/Home/Features'));

const Home = () => {
    return (
        <div className="home-page">
            {/* HERO SECTION */}
            <section className="hero">
                <div className="hero-overlay"></div>
                <div className="hero-content container animate-up">
                    <span className="hero-subtitle">UNE OASIS DE SÉRÉNITÉ AU BÉNIN</span>
                    <h1>Résidence Hôtel Sainte Elisabeth House</h1>
                    <p>Découvrez une expérience d'exception sur nos deux sites : Abomey-Calavi et Allada.</p>
                    <div className="hero-btns">
                        <a href="/rooms" className="btn-primary">Découvrir nos chambres</a>
                        <a href="/booking" className="btn-primary">Réserver</a>
                        <a href="/about" className="btn-outline" style={{ color: 'white', borderColor: 'white' }}>Notre Histoire</a>
                    </div>
                </div>
            </section>

            {/* SITES HIGHLIGHT */}
            <section className="section sites-highlight">
                <div className="container">
                    <div className="section-header">
                        <span className="subtitle">NOS DESTINATIONS</span>
                        <h2>Deux Sites pour Vous Servir</h2>
                    </div>
                    <div className="sites-grid animate-up">
                        <div className="site-card glass-box">
                            <img src="/Images/SITE ABOMEY CALAVI.jpg" alt="Site Abomey-Calavi" className="site-card-img" loading="lazy" />
                            <h3>Site Abomey-Calavi</h3>
                            <p>Un cadre paisible et moderne à proximité de la métropole.</p>
                            <a href="/rooms" className="view-more">Voir les chambres <ChevronRight size={16} /></a>
                        </div>
                        <div className="site-card glass-box">
                            <img src="/Images/SITE ALLADA.jpg" alt="Site Allada" className="site-card-img" loading="lazy" />
                            <h3>Site Allada</h3>
                            <p>Le charme de l'authenticité au cœur du royaume d'Allada.</p>
                            <a href="/rooms" className="view-more">Voir les chambres <ChevronRight size={16} /></a>
                        </div>
                    </div>
                </div>
            </section>

            {/* BOOKING BAR */}
            <div id="booking" className="booking-bar-wrapper">
                <div className="container">
                    <div className="booking-bar glass-box">
                        <div className="booking-item">
                            <Calendar className="icon" size={20} />
                            <div className="text">
                                <label>ARRIVÉE</label>
                                <input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                            </div>
                        </div>
                        <div className="booking-item">
                            <Calendar className="icon" size={20} />
                            <div className="text">
                                <label>DÉPART</label>
                                <input type="date" defaultValue={new Date(Date.now() + 86400000).toISOString().split('T')[0]} />
                            </div>
                        </div>
                        <div className="booking-item">
                            <Users className="icon" size={20} />
                            <div className="text">
                                <label>ADULTES</label>
                                <select>
                                    <option>1 Adulte</option>
                                    <option selected>2 Adultes</option>
                                    <option>3 Adultes</option>
                                    <option>4 Adultes</option>
                                </select>
                            </div>
                        </div>
                        <button className="btn-primary search-btn">VÉRIFIER LA DISPONIBILITÉ</button>
                    </div>
                </div>
            </div>

            <React.Suspense fallback={<div className="section container">Chargement des équipements...</div>}>
                <RoomsPreview />
                <Features />
            </React.Suspense>
        </div>
    );
};

export default Home;
