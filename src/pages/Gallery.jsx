import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './Gallery.css';

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [filter, setFilter] = useState('tous');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        const { data } = await supabase.from('gallery').select('image_url, category, title, created_at').order('created_at', { ascending: false });
        setImages(data || []);
        setLoading(false);
    };

    const categories = ['tous', 'Chambres', 'Restaurant', 'Espaces', 'Événements'];

    if (loading) return <div className="loader container section" style={{ marginTop: '100px' }}>Chargement de la galerie...</div>;

    // Sort to show 'Chambres' first
    const sortedImages = [...images].sort((a, b) => {
        if (a.category === 'Chambres' && b.category !== 'Chambres') return -1;
        if (a.category !== 'Chambres' && b.category === 'Chambres') return 1;
        return 0;
    });

    const filteredImages = filter === 'tous' ? sortedImages : sortedImages.filter(img => img.category === filter);

    return (
        <div className="gallery-page">
            <section className="page-header narrow">
                <div className="container animate-up">
                    <h1>Galerie Photos</h1>
                    <p>Découvrez notre établissement en images.</p>
                </div>
            </section>

            <div className="container section">
                <div className="gallery-filters animate-up">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`filter-btn ${filter === (cat === 'tous' ? 'tous' : cat) ? 'active' : ''}`}
                            onClick={() => setFilter(cat)}
                        >
                            {cat.toUpperCase()}
                        </button>
                    ))}
                </div>

                <div className="gallery-grid animate-up">
                    {filteredImages.map((img, idx) => (
                        <div key={idx} className="gallery-item">
                            <img
                                src={img.image_url}
                                alt={img.title}
                                loading="lazy"
                                width="400"
                                height="400"
                            />
                            <div className="gallery-overlay">
                                <span>{img.category}</span>
                                <h4>{img.title}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Gallery;
