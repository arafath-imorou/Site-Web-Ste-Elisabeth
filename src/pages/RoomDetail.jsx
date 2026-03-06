import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Check, ArrowLeft, Users, Square, ShieldCheck, Calendar } from 'lucide-react';
import { MOCK_ROOMS } from '../data/mockRooms';
import { formatPrice } from '../lib/formatUtils';
import './RoomDetail.css';

const RoomDetail = () => {
    const { id } = useParams();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        fetchRoomDetails();
    }, [id]);

    const fetchRoomDetails = async () => {
        try {
            const { data, error } = await supabase
                .from('rooms')
                .select(`*, room_images(*)`)
                .eq('id', id)
                .single();

            if (error || !data) {
                console.log('Using mock data for room id:', id);
                const mockRoom = MOCK_ROOMS.find(r => r.id === id);
                setRoom(mockRoom);
            } else {
                setRoom(data);
            }
        } catch (err) {
            console.error('Error fetching room details, falling back to mock data:', err);
            const mockRoom = MOCK_ROOMS.find(r => r.id === id);
            setRoom(mockRoom);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loader container section">Chargement des détails...</div>;
    if (!room) return <div className="container section">Chambre non trouvée. <Link to="/rooms">Retour aux chambres</Link></div>;

    const images = room.room_images?.length > 0
        ? room.room_images.map(img => img.url)
        : room.image ? [room.image] : ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'];

    const isConference = room.name?.toLowerCase().includes('conférence') || room.name?.toLowerCase().includes('fête');

    return (
        <div className="room-detail-page">
            <div className="container">
                <Link to={`/rooms?site=${room.site}`} className="back-link">
                    <ArrowLeft size={18} /> Retour aux chambres
                </Link>

                <div className="room-header animate-up">
                    <div className="title-area">
                        <h1>{room.name}</h1>
                    </div>
                    <div className="price-area">
                        {room.prices ? (
                            <div className="dual-prices-detail">
                                {room.prices.ventillee && (
                                    <div className="price-option">
                                        <span className="value">{formatPrice(room.prices.ventillee)} FCFA</span>
                                        <span className="label">Ventillée</span>
                                    </div>
                                )}
                                {room.prices.climee && (
                                    <div className="price-option">
                                        <span className="value">{formatPrice(room.prices.climee)} FCFA</span>
                                        <span className="label">Climée</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <span className="price">{formatPrice(room.price_per_night)} FCFA</span>
                                <span className="unit">Par {isConference ? 'jour' : 'nuit'}</span>
                            </>
                        )}
                    </div>
                </div>

                <div className="room-grid section-sm animate-up">
                    {/* GALLERY */}
                    <div className="room-gallery">
                        <div className="main-image">
                            <img src={images[activeImage]} alt={room.name} fetchpriority="high" width="1200" height="800" />
                        </div>
                        <div className="thumbnail-grid">
                            {images.map((img, idx) => (
                                <div
                                    key={idx}
                                    className={`thumb ${activeImage === idx ? 'active' : ''}`}
                                    onClick={() => setActiveImage(idx)}
                                >
                                    <img
                                        src={img}
                                        alt={`${room.name} ${idx + 1}`}
                                        loading="lazy"
                                        width="150"
                                        height="100"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SIDEBAR / BOOKING */}
                    <div className="room-sidebar">
                        <div className="booking-card glass-box">
                            <h3>{isConference ? 'Réserver cette salle' : 'Réserver cette suite'}</h3>
                            <p>{isConference ? 'Vérifiez la disponibilité et réservez votre événement.' : 'Vérifiez la disponibilité et réservez instantanément.'}</p>

                            <div className="booking-form">
                                <div className="form-group">
                                    <label>{isConference ? 'Date de l\'événement' : 'Dates de séjour'}</label>
                                    <div className="input-with-icon">
                                        <Calendar size={18} />
                                        <span>Sélectionnez vos dates</span>
                                    </div>
                                </div>
                                <Link to={`/booking?room=${room.id}`} className="btn-primary w-100">
                                    RÉSERVER MAINTENANT
                                </Link>
                                <div className="guarantee">
                                    <ShieldCheck size={16} /> Meilleur prix garanti
                                </div>
                            </div>
                        </div>

                        <div className="room-policies">
                            <h4>Politiques</h4>
                            <ul>
                                <li><strong>Check-in</strong>: 15:00</li>
                                <li><strong>Check-out</strong>: 11:00</li>
                                <li><strong>Annulation</strong>: {room.cancellation_policy || 'Annulation gratuite jusqu\'à 24h avant l\'arrivée.'}</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* DESCRIPTION & AMENITIES */}
                <div className="room-info-tabs section animate-up">
                    <div className="description-col">
                        <h2>Description</h2>
                        <p className="large-text">{room.description}</p>
                    </div>
                    <div className="amenities-col">
                        <h2>Équipements</h2>
                        <ul className="amenities-list">
                            {room.amenities?.map((amenity, idx) => (
                                <li key={idx}><Check size={18} className="icon" /> {amenity}</li>
                            ))}
                            {!room.amenities && (
                                <>
                                    <li><Check size={18} className="icon" /> Wi-Fi Haut Débit Gratuit</li>
                                    <li><Check size={18} className="icon" /> Mini-bar Premium</li>
                                    <li><Check size={18} className="icon" /> Coffre-fort électronique</li>
                                    <li><Check size={18} className="icon" /> Climatisation réversible</li>
                                    <li><Check size={18} className="icon" /> Machine à café Nespresso</li>
                                    <li><Check size={18} className="icon" /> Room Service 24h/24</li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomDetail;
