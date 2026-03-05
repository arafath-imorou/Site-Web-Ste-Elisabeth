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
        const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
        setImages(data || []);
        setLoading(false);
    };

    const categories = ['tous', 'Chambres', 'Restaurant', 'Espaces', 'Événements'];

    const defaultImages = [
        // CHAMBRES
        { image_url: '/Images/cd84752d-ed35-4e35-be6a-0d68a82dee0e.jpg', category: 'Chambres', title: 'Chambre Harmonie' },
        { image_url: '/Images/ae09e9a2-18c2-44c3-abb4-9899fb67e3ef.jpg', category: 'Chambres', title: 'Chambre Simplicité' },
        { image_url: '/Images/03fb9daa-e814-4377-84c4-a95f598b2f55.jpg', category: 'Chambres', title: 'Chambre Climée' },

        // RESTAURANT
        { image_url: '/Images/bbbe2410-d06f-4968-95d5-4ebe65b80f4c.jpg', category: 'Restaurant', title: 'Espace Restauration' },

        // ESPACES
        { image_url: '/Images/ce9db6be-f16d-4e3e-8a0d-a16ea95d3dcd.jpg', category: 'Espaces', title: 'La Terrasse' },
    ];

    const displayImages = images.length > 0 ? images : defaultImages;

    // Sort to show 'Chambres' first
    const sortedImages = [...displayImages].sort((a, b) => {
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
