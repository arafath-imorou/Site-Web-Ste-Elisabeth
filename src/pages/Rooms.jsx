import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ChevronRight, Filter, MapPin, Calendar } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { SITES } from '../constants/sites';
import { MOCK_ROOMS } from '../data/mockRooms';
import { formatPrice } from '../lib/formatUtils';
import './Rooms.css';

const Rooms = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const initialSite = searchParams.get('site') || SITES.ABOMEY_CALAVI;
    const [activeSite, setActiveSite] = useState(initialSite);

    useEffect(() => {
        const siteFromUrl = searchParams.get('site');
        if (siteFromUrl && siteFromUrl !== activeSite) {
            setActiveSite(siteFromUrl);
        }
    }, [searchParams]);

    useEffect(() => {
        fetchRooms();
    }, [activeSite]);

    const handleSiteChange = (site) => {
        setActiveSite(site);
        setSearchParams({ site });
    };

    const fetchRooms = async () => {
        setLoading(true);
        try {
            const checkIn = searchParams.get('checkIn');
            const checkOut = searchParams.get('checkOut');

            let occupiedRoomIds = [];
            let occupiedRoomNumbers = [];

            if (checkIn && checkOut) {
                // Fetch occupied rooms from stays
                const { data: stays, error: staysError } = await supabase
                    .from('stays')
                    .select('room_id, room_number, site')
                    .lt('check_in', checkOut)
                    .gt('check_out', checkIn)
                    .neq('status', 'cancelled');

                // Fetch occupied rooms from reservations
                const { data: reservations, error: reservationsError } = await supabase
                    .from('reservations')
                    .select('room_id, room_number, site')
                    .lt('check_in', checkOut)
                    .gt('check_out', checkIn)
                    .neq('status', 'cancelled');

                if (!staysError && stays) {
                    occupiedRoomIds = [...occupiedRoomIds, ...stays.map(s => s.room_id)];
                    if (activeSite === SITES.ALLADA) {
                        occupiedRoomNumbers = [...occupiedRoomNumbers, ...stays.filter(s => s.site === 'Allada').map(s => s.room_number)];
                    }
                }
                if (!reservationsError && reservations) {
                    occupiedRoomIds = [...occupiedRoomIds, ...reservations.map(r => r.room_id)];
                    if (activeSite === SITES.ALLADA) {
                        occupiedRoomNumbers = [...occupiedRoomNumbers, ...reservations.filter(r => r.site === 'Allada').map(r => r.room_number)];
                    }
                }
            }

            let query = supabase
                .from('rooms')
                .select('id, name, description, image, prices, price_per_night, site, order_index, room_numbers, room_images(url)')
                .eq('site', activeSite);

            // For non-Allada sites or if no dates selected, we can still use room_id if appropriate, 
            // but let's be more precise for Allada.
            if (activeSite === SITES.ABOMEY_CALAVI && occupiedRoomIds.length > 0) {
                query = query.not('id', 'in', `(${occupiedRoomIds.join(',')})`);
            }

            const { data, error } = await query.order('order_index', { ascending: true });

            if (error || !data || data.length === 0) {
                console.log('Using mock data or no data found for site:', activeSite);
                let filteredMock = MOCK_ROOMS.filter(r => r.site === activeSite);
                setRooms(filteredMock);
            } else {
                let finalRooms = data;

                // For Allada, filter by room_number availability
                if (activeSite === SITES.ALLADA && occupiedRoomNumbers.length > 0) {
                    finalRooms = data.filter(room => {
                        if (room.room_numbers && room.room_numbers.length > 0) {
                            // Category is available if at least one of its room numbers is not occupied
                            return room.room_numbers.some(num => !occupiedRoomNumbers.includes(num));
                        }
                        // Default to room_id check if no room_numbers listed
                        return !occupiedRoomIds.includes(room.id);
                    });
                }

                setRooms(finalRooms);
            }
        } catch (err) {
            console.error('Error fetching rooms, falling back to mock data:', err);
            const filteredMock = MOCK_ROOMS.filter(r => r.site === activeSite);
            setRooms(filteredMock);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rooms-page">
            <section className="page-header">
                <div className="container animate-up">
                    <h1>Hébergements d'Exception</h1>
                    <p>Découvrez le confort et l'élégance de nos deux sites au Bénin.</p>
                </div>
            </section>

            <div className="container section">
                <div className="site-tabs animate-up">
                    <button
                        className={`site-tab ${activeSite === SITES.ABOMEY_CALAVI ? 'active' : ''}`}
                        onClick={() => handleSiteChange(SITES.ABOMEY_CALAVI)}
                    >
                        <MapPin size={18} /> SITE ABOMEY-CALAVI
                    </button>
                    <button
                        className={`site-tab ${activeSite === SITES.ALLADA ? 'active' : ''}`}
                        onClick={() => handleSiteChange(SITES.ALLADA)}
                    >
                        <MapPin size={18} /> SITE ALLADA
                    </button>
                </div>

                <div className="rooms-controls">
                    <p className="site-transition-text" style={{ textAlign: 'center', margin: '1rem auto', maxWidth: '700px', fontSize: '1.1rem', color: '#666', lineHeight: '1.6' }}>
                        {activeSite === SITES.ABOMEY_CALAVI
                            ? "Découvrez notre oasis de sérénité au cœur d'Abomey-Calavi, offrant un cadre paisible et moderne pour un séjour inoubliable."
                            : "Laissez-vous charmer par l'authenticité et le confort de nos chambres et pavillons à Allada, idéalement conçus pour votre repos."}
                    </p>

                    {searchParams.get('checkIn') && searchParams.get('checkOut') && (
                        <div className="active-filters animate-up" style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '1rem',
                            background: 'rgba(212, 175, 55, 0.1)',
                            padding: '0.8rem 1.5rem',
                            borderRadius: '12px',
                            margin: '1rem auto',
                            maxWidth: 'fit-content',
                            border: '1px solid rgba(212, 175, 55, 0.2)'
                        }}>
                            <span style={{ fontSize: '0.95rem', color: '#555' }}>
                                <Calendar size={16} style={{ verticalAlign: 'middle', marginRight: '6px', color: '#d4af37' }} />
                                Disponibilité pour le séjour du <strong>{searchParams.get('checkIn')}</strong> au <strong>{searchParams.get('checkOut')}</strong>
                            </span>
                            <button
                                onClick={() => {
                                    const newParams = new URLSearchParams(searchParams);
                                    newParams.delete('checkIn');
                                    newParams.delete('checkOut');
                                    newParams.delete('guests');
                                    setSearchParams(newParams);
                                }}
                                style={{
                                    background: '#d4af37',
                                    color: 'white',
                                    border: 'none',
                                    padding: '4px 12px',
                                    borderRadius: '6px',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => e.target.style.background = '#b8962d'}
                                onMouseOut={(e) => e.target.style.background = '#d4af37'}
                            >
                                Tout afficher
                            </button>
                        </div>
                    )}
                </div>

                <div className="rooms-list">
                    {loading ? (
                        <div className="loader">Chargement de nos suites...</div>
                    ) : rooms.length > 0 ? (
                        rooms.map((room) => (
                            <div key={room.id} className="room-item animate-up">
                                <div className="room-item-image">
                                    <img
                                        src={room.image || room.room_images?.[0]?.url || 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80'}
                                        alt={room.name}
                                        loading="lazy"
                                        width="800"
                                        height="500"
                                    />
                                </div>
                                <div className="room-item-content">
                                    <h2>{room.name}</h2>
                                    <p>{room.description}</p>
                                    <div className="room-footer">
                                        <div className="price-box">
                                            {room.prices ? (
                                                <div className="dual-prices">
                                                    {room.prices.ventillee && (
                                                        <div className="price-item">
                                                            <span className="label">Ventillée</span>
                                                            <span className="value">{formatPrice(room.prices.ventillee)} FCFA</span>
                                                        </div>
                                                    )}
                                                    {room.prices.climee && (
                                                        <div className="price-item">
                                                            <span className="label">Climée</span>
                                                            <span className="value">{formatPrice(room.prices.climee)} FCFA</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <>
                                                    <span className="label">À partir de</span>
                                                    <span className="value">{formatPrice(room.price_per_night)} FCFA</span>
                                                    <span className="per">/ {room.name?.toLowerCase().includes('conférence') || room.name?.toLowerCase().includes('fête') ? 'JOUR' : 'NUIT'}</span>
                                                </>
                                            )}
                                        </div>
                                        <a href={`/rooms/${room.id}`} className="btn-primary">VOIR DÉTAILS</a>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-rooms glass-box animate-up">
                            <p>Aucune chambre n'est disponible pour ce site pour le moment.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Rooms;
