import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ChevronRight } from 'lucide-react';
import { formatPrice } from '../../lib/formatUtils';
import { MOCK_ROOMS } from '../../data/mockRooms';

const RoomsPreview = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const { data, error } = await supabase
                    .from('rooms')
                    .select('id, name, description, image, prices, price_per_night, amenities, room_images(url)')
                    .limit(3);

                if (error || !data || data.length === 0) {
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
        fetchRooms();
    }, []);

    return (
        <section className="section rooms-preview">
            <div className="container">
                <div className="section-header">
                    <span className="subtitle">HÉBERGEMENT</span>
                    <h2>Chambres & Pavillons de Charme</h2>
                    <div className="header-line"></div>
                </div>

                <div className="rooms-grid">
                    {loading ? (
                        <div className="skeleton-grid">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="skeleton-room-card"></div>
                            ))}
                        </div>
                    ) : (
                        rooms.map((room) => (
                            <div key={room.id} className="room-card animate-up">
                                <div className="room-image">
                                    <img
                                        src={room.image || room.room_images?.[0]?.url || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'}
                                        alt={room.name}
                                        loading="lazy"
                                        width="800"
                                        height="500"
                                    />
                                    <div className="room-price">
                                        {room.prices
                                            ? `À partir de ${formatPrice(Math.min(...Object.values(room.prices)))} FCFA`
                                            : `À partir de ${formatPrice(room.price_per_night)} FCFA`}
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
                    )}
                </div>
            </div>
            <style>{`
                .skeleton-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
                .skeleton-room-card { height: 400px; background: rgba(0,0,0,0.05); border-radius: 8px; animation: pulse 1.5s infinite; }
            `}</style>
        </section>
    );
};

export default RoomsPreview;
