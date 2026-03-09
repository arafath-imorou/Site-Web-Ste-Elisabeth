import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar, Users, ChevronRight, Star, MapPin, Home as HomeIcon, CheckCircle, XCircle } from 'lucide-react';
import { SITES } from '../constants/sites';
import { MOCK_ROOMS } from '../data/mockRooms';
import { formatPrice } from '../lib/formatUtils';
import './Home.css';

const RoomsPreview = React.lazy(() => import('../components/Home/RoomsPreview'));
const Features = React.lazy(() => import('../components/Home/Features'));

const Home = () => {
    const [selectedSite, setSelectedSite] = useState(SITES.ABOMEY_CALAVI);
    const [roomsList, setRoomsList] = useState([]);
    const [selectedRoomId, setSelectedRoomId] = useState('');
    const [checkIn, setCheckIn] = useState(new Date().toISOString().split('T')[0]);
    const [checkOut, setCheckOut] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
    const [guests, setGuests] = useState('2');
    const [availabilityStatus, setAvailabilityStatus] = useState(null); // null, 'checking', 'available', 'unavailable'

    useEffect(() => {
        const fetchRoomsBySite = async () => {
            const { data, error } = await supabase
                .from('rooms')
                .select('*')
                .eq('site', selectedSite)
                .eq('is_available', true);

            if (error || !data || data.length === 0) {
                setRoomsList(MOCK_ROOMS.filter(r => r.site === selectedSite));
            } else {
                setRoomsList(data);
            }
        };
        fetchRoomsBySite();
    }, [selectedSite]);

    const handleSearch = async () => {
        if (!selectedRoomId || !checkIn || !checkOut) return;

        setAvailabilityStatus('checking');

        try {
            // Check overlaps in stays
            const { data: stays, error: staysError } = await supabase
                .from('stays')
                .select('id')
                .eq('room_id', selectedRoomId)
                .lt('check_in', checkOut)
                .gt('check_out', checkIn)
                .neq('status', 'cancelled');

            // Check overlaps in reservations
            const { data: reservations, error: reservationsError } = await supabase
                .from('reservations')
                .select('id')
                .eq('room_id', selectedRoomId)
                .lt('check_in', checkOut)
                .gt('check_out', checkIn)
                .neq('status', 'cancelled');

            if (staysError || reservationsError) throw staysError || reservationsError;

            if (stays?.length > 0 || reservations?.length > 0) {
                setAvailabilityStatus('unavailable');
            } else {
                setAvailabilityStatus('available');
            }
        } catch (err) {
            console.error('Availability check error:', err);
            setAvailabilityStatus(null);
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
                            <MapPin className="icon" size={20} />
                            <div className="text">
                                <label>SITE</label>
                                <select value={selectedSite} onChange={(e) => setSelectedSite(e.target.value)}>
                                    {Object.values(SITES).map(site => (
                                        <option key={site} value={site}>{site}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="booking-item">
                            <HomeIcon className="icon" size={20} />
                            <div className="text">
                                <label>SUITE</label>
                                <select value={selectedRoomId} onChange={(e) => setSelectedRoomId(e.target.value)}>
                                    <option value="">Sélectionnez...</option>
                                    {roomsList.map(room => (
                                        <option key={room.id} value={room.id}>{room.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="booking-item">
                            <Calendar className="icon" size={20} />
                            <div className="text">
                                <label>ARRIVÉE</label>
                                <input
                                    type="date"
                                    value={checkIn}
                                    onChange={(e) => { setCheckIn(e.target.value); setAvailabilityStatus(null); }}
                                />
                            </div>
                        </div>
                        <div className="booking-item">
                            <Calendar className="icon" size={20} />
                            <div className="text">
                                <label>DÉPART</label>
                                <input
                                    type="date"
                                    value={checkOut}
                                    onChange={(e) => { setCheckOut(e.target.value); setAvailabilityStatus(null); }}
                                />
                            </div>
                        </div>
                        <div className="booking-item">
                            <Users className="icon" size={20} />
                            <div className="text">
                                <label>ADULTES</label>
                                <select value={guests} onChange={(e) => setGuests(e.target.value)}>
                                    <option value="1">1 Adulte</option>
                                    <option value="2">2 Adultes</option>
                                    <option value="3">3 Adultes</option>
                                    <option value="4">4 Adultes</option>
                                </select>
                            </div>
                        </div>
                        <div className="search-col">
                            <button
                                className="btn-primary search-btn"
                                onClick={handleSearch}
                                disabled={!selectedRoomId || availabilityStatus === 'checking'}
                            >
                                {availabilityStatus === 'checking' ? 'VÉRIF...' : 'VÉRIFIER LA DISPONIBILITÉ'}
                            </button>

                            {availabilityStatus === 'available' && (
                                <div className="availability-result available animate-up">
                                    <span className="msg"><CheckCircle size={16} /> Disponible !</span>
                                    <a href={`/booking?room=${selectedRoomId}&checkIn=${checkIn}&checkOut=${checkOut}&site=${selectedSite}`} className="book-link">Réserver <ChevronRight size={14} /></a>
                                </div>
                            )}

                            {availabilityStatus === 'unavailable' && (
                                <div className="availability-result unavailable animate-up">
                                    <span className="msg"><XCircle size={16} /> Non disponible</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <React.Suspense fallback={<div className="section container">Chargement des équipements...</div>}>
                <RoomsPreview />
                <Features />
            </React.Suspense>
        </div >
    );
};

export default Home;
