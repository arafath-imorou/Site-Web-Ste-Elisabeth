import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar, Users, ChevronRight, Star, MapPin } from 'lucide-react';
import { MOCK_ROOMS } from '../data/mockRooms';
import './Home.css';

const Home = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const { data, error } = await supabase
                .from('rooms')
                .select(`*, room_images(*)`)
                .limit(3);

            if (error || !data || data.length === 0) {
                console.log('Using mock data for home page');
                setRooms(MOCK_ROOMS.slice(0, 3));
            } else {
                setRooms(data);
            }
        } catch (err) {
            console.error('Error fetching rooms:', err);
            setRooms(MOCK_ROOMS.slice(0, 3));
        } finally {
            setLoading(false);
        }
    };

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

            {/* ROOMS PREVIEW */}
            <section className="section rooms-preview">
                <div className="container">
                    <div className="section-header">
                        <span className="subtitle">HÉBERGEMENT</span>
                        <h2>Chambres & Pavillons de Charme</h2>
                        <div className="header-line"></div>
                    </div>

                    <div className="rooms-grid">
                        {loading ? (
                            <p>Chargement des chambres...</p>
                        ) : rooms.length > 0 ? (
                            rooms.map((room) => (
                                <div key={room.id} className="room-card animate-up">
                                    <div className="room-image">
                                        <img src={room.image || room.room_images?.[0]?.url || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'} alt={room.name} />
                                        <div className="room-price">
                                            {room.prices
                                                ? `À partir de ${Math.min(...Object.values(room.prices))} FCFA`
                                                : `À partir de ${room.price_per_night} FCFA`}
                                        </div>
                                    </div>
                                    <div className="room-info">
                                        <h3>{room.name}</h3>
                                        <p>{room.description?.substring(0, 100)}...</p>
                                        <ul className="room-amenities">
                                            {room.amenities?.slice(0, 3).map((item, idx) => (
                                                <li key={idx}>{item}</li>
                                            ))}
                                        </ul>
                                        <a href={`/rooms/${room.id}`} className="view-more">
                                            Détails de la chambre <ChevronRight size={16} />
                                        </a>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="room-card animate-up">
                                <div className="room-image">
                                    <img src="/Images/7887fbb9-3d3a-4ddf-ab0a-be8af007d635.jpg" alt="Exemple Chambre" />
                                    <div className="room-price">À partir de 250€</div>
                                </div>
                                <div className="room-info">
                                    <h3>Chambre Prestige Jardin</h3>
                                    <p>Un espace paisible entouré de verdure avec vue sur le jardin tropical.</p>
                                    <ul className="room-amenities">
                                        <li>Terrasse Privée</li>
                                        <li>Vue Jardin</li>
                                        <li>Confort Nature</li>
                                    </ul>
                                    <a href="/rooms" className="view-more">
                                        Détails de la chambre <ChevronRight size={16} />
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="section features glass-box">
                <div className="container grid-2">
                    <div className="feature-text animate-up">
                        <span className="subtitle">L'EXPÉRIENCE</span>
                        <h2>Pourquoi Venir Chez Nous ?</h2>
                        <p>Notre établissement allie le charme de l'ancien au confort moderne, offrant à chaque client une parenthèse enchantée loin du tumulte quotidien.</p>
                        <ul className="feature-list">
                            <li><strong>Localisation Privilégiée</strong> : Un cadre naturel préservé.</li>
                            <li><strong>Service 5 Étoiles</strong> : Notre équipe est à votre entière disposition.</li>
                            <li><strong>Nature & Sérénité</strong> : Jardins tropicaux et espaces verts.</li>
                        </ul>
                    </div>
                    <div className="feature-image animate-up">
                        <img src="/Images/73eec850-7b1e-4fba-b0b2-e318ecb4442c.jpg" alt="Jardin" />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
