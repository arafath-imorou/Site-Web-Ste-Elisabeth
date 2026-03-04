import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Coffee, Waves, Dumbbell, Sparkles, Car, Wifi, Shield, Plane, MessageCircle } from 'lucide-react';
import './Services.css';

const iconMap = {
    Coffee: Coffee,
    Waves: Waves,
    Dumbbell: Dumbbell,
    Sparkles: Sparkles,
    Car: Car,
    Wifi: Wifi,
    Shield: Shield,
    Plane: Plane
};

const Services = () => {
    const [services, setServices] = useState([]);
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchServices();
        fetchMenus();
    }, []);

    const fetchServices = async () => {
        const { data } = await supabase.from('services').select('*').eq('is_active', true);
        setServices(data || []);
    };

    const fetchMenus = async () => {
        const { data } = await supabase.from('restaurant_menus').select('*').eq('is_active', true);
        setMenus(data || []);
        setLoading(false);
    };

    const defaultServices = [
        { name: 'Restaurant Gastronomique', icon: 'Coffee', description: 'Une cuisine raffinée préparée par nos chefs étoilés.' },
        { name: 'Jardins & Promenade', icon: 'Sparkles', description: 'Découvrez nos espaces verts et nos jardins tropicaux.' },
        { name: 'Espace Détente', icon: 'Waves', description: 'Un cadre naturel apaisant pour votre repos.' },
        { name: 'Parcours de Santé', icon: 'Dumbbell', description: 'Marche et exercices en plein air dans la verdure.' },
        { name: 'Parking Sécurisé', icon: 'Shield', description: 'Service de voiturier et parking surveillé 24h/24.' },
        { name: 'Wi-Fi Haut Débit', icon: 'Wifi', description: 'Connexion gratuite dans tout l\'établissement.' },
        { name: 'Blanchisserie', icon: 'Car', description: 'Service de nettoyage à sec et repassage rapide.' },
        { name: 'Navette Aéroport', icon: 'Plane', description: 'Transport privé depuis et vers l\'aéroport.' }
    ];

    const displayServices = services.length > 0 ? services : defaultServices;

    return (
        <div className="services-page">
            <section className="page-header narrow">
                <div className="container animate-up">
                    <h1>Services & Expériences</h1>
                    <p>Chaque détail est pensé pour sublimer votre séjour parmi nous.</p>
                </div>
            </section>

            <div className="container section animate-up">
                <div className="section-intro" style={{ textAlign: 'center', marginBottom: '2rem', maxWidth: '800px', margin: '0 auto 2rem' }}>
                    <h2 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>Nos Prestations</h2>
                    <p style={{ fontSize: '1.1rem', color: '#666', lineHeight: '1.6' }}>De la détente absolue dans nos jardins tropicaux à notre navette aéroport premium, découvrez une gamme complète de services conçus sur mesure pour répondre à toutes vos attentes et faire de votre séjour un moment inoubliable.</p>
                </div>
                <div className="services-grid">
                    {displayServices.map((service, idx) => {
                        const IconComponent = iconMap[service.icon] || Coffee;
                        return (
                            <div key={idx} className="service-card">
                                <div className="service-icon">
                                    <IconComponent size={32} />
                                </div>
                                <h3>{service.name}</h3>
                                <p>{service.description}</p>
                                {service.name === 'Restaurant Gastronomique' && (
                                    <a href="#menu-restaurant" className="btn-secondary" style={{ marginTop: '1rem', display: 'inline-block', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Voir le Menu</a>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <section className="events-special container section animate-up" style={{ paddingTop: '2rem' }}>
                <div className="section-intro" style={{ textAlign: 'center', marginBottom: '2rem', maxWidth: '800px', margin: '0 auto 2rem' }}>
                    <h2 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>Vos Moments Précieux</h2>
                    <p style={{ fontSize: '1.1rem', color: '#666', lineHeight: '1.6' }}>Que ce soit pour célébrer une union, organiser un séminaire professionnel ou réunir vos proches, nos espaces s'adaptent à vos envies pour donner vie à des événements exceptionnels.</p>
                </div>
                <div className="events-content glass-box">
                    <div className="events-text">
                        <span className="subtitle">ÉVÉNEMENTS</span>
                        <h2>Réceptions & Nature</h2>
                        <p>Nos espaces extérieurs et salles offrent le cadre idéal pour vos événements au cœur de la nature.</p>
                        <div className="event-stats">
                            <div className="stat">
                                <strong>400m²</strong>
                                <span>D'espace modulable</span>
                            </div>
                            <div className="stat">
                                <strong>150+</strong>
                                <span>Capacité d'accueil</span>
                            </div>
                        </div>
                        <button className="btn-primary">DEMANDER UN DEVIS</button>
                    </div>
                    <div className="events-image">
                        <img src="/Images/699eb6ab-5a0f-45a4-a97a-245ba005d427.jpg" alt="Events" loading="lazy" />
                    </div>
                </div>
            </section>

            {/* RESTAURANT MENU SECTION */}
            <div id="menu-restaurant" className="container section" style={{ paddingTop: '2rem' }}>
                <div className="section-intro" style={{ textAlign: 'center', marginBottom: '2rem', maxWidth: '800px', margin: '0 auto 2rem' }}>
                    <h2 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>Plaisirs Gourmands</h2>
                    <p style={{ fontSize: '1.1rem', color: '#666', lineHeight: '1.6' }}>Laissez-vous tenter par une aventure culinaire où les spécialités locales béninoises rencontrent les classiques internationaux. Une symphonie de saveurs à déguster dans un cadre raffiné.</p>
                </div>
                <div className="menu-container glass-box animate-up" style={{ marginTop: '2rem' }}>
                    <div className="menu-inner">
                        <div className="menu-header">
                            <img src="/Images/LOGO SANS FOND.png" alt="SDF Logo" className="menu-logo" loading="lazy" />
                            <div className="menu-title-wrapper">
                                <h1 className="menu-main-title">MENU</h1>
                                <span className="menu-subtitle">Bar Restaurant de la Résidence SDF<br />Abomey-Calavi | Allada</span>
                            </div>
                        </div>

                        <div className="menu-gallery-preview">
                            <img src="/Images/PLAT 1.jpg" alt="Plat 1" className="plat-img" loading="lazy" />
                            <img src="/Images/PLAT 2.jpg" alt="Plat 2" className="plat-img" loading="lazy" />
                            <img src="/Images/PLAT 3.jpg" alt="Plat 3" className="plat-img" loading="lazy" />
                            <img src="/Images/PLAT 4.jpg" alt="Plat 4" className="plat-img" loading="lazy" />
                            <img src="/Images/Plat 5.jpg" alt="Plat 5" className="plat-img" loading="lazy" />
                        </div>

                        <div className="menu-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                            {/* Déjeuners Column */}
                            <div className="menu-column">
                                <h2 className="section-title">Nos plats</h2>
                                <h3 className="category-title">Petits déjeuners</h3>
                                <div className="menu-items">
                                    {(menus.length > 0 ? menus : [
                                        { id: 1, name: 'Thé simple', price: '500f', category: 'Petits déjeuners' },
                                        { id: 2, name: 'Thé gingembre', price: '1 000f', category: 'Petits déjeuners' },
                                        { id: 3, name: 'Thé omelette + pain', price: '1 500f', category: 'Petits déjeuners' },
                                        { id: 4, name: 'Thé + lait peak + omelette + pain', price: '2 000f', category: 'Petits déjeuners' }
                                    ]).filter(m => m.category === 'Petits déjeuners').map((item, idx) => (
                                        <div key={item.id || idx} className="menu-item">
                                            <span className="name">{item.name}</span>
                                            {item.description && <span style={{ fontSize: '0.8rem', color: '#666', display: 'block' }}>{item.description}</span>}
                                            <span className="dots"></span>
                                            <span className="price">{item.price}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Repas Column */}
                            <div className="menu-column">
                                <h3 className="category-title" style={{ marginTop: '2.5rem' }}>Les repas</h3>
                                <div className="menu-items">
                                    {(menus.length > 0 ? menus : [
                                        { id: 5, name: 'Spaghetti avec œufs', price: '1 500f', category: 'Repas' },
                                        { id: 6, name: 'Spaghetti avec sardines', price: '2 000f', category: 'Repas' },
                                        { id: 7, name: 'Riz + poisson', price: '2 500 / 3 000f', category: 'Repas' },
                                        { id: 8, name: 'Frites + 1/2 poulet', price: '3 500f', category: 'Repas' },
                                        { id: 9, name: 'Couscous + poisson', price: '3 000 / 4 000f', category: 'Repas' },
                                        { id: 10, name: 'Pâte rouge + dindon', price: '2 500 / 3 000f', category: 'Repas' }
                                    ]).filter(m => m.category === 'Repas' || m.category === 'Les repas').map((item, idx) => (
                                        <div key={item.id || idx} className="menu-item">
                                            <span className="name">{item.name}</span>
                                            {item.description && <span style={{ fontSize: '0.8rem', color: '#666', display: 'block' }}>{item.description}</span>}
                                            <span className="dots"></span>
                                            <span className="price">{item.price}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="menu-footer">
                            <div className="delivery-info">
                                <h4>Livraison et Commande:</h4>
                                <div className="contacts" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span>Abomey-Calavi:</span>
                                        <a href="https://wa.me/2290166655757" target="_blank" rel="noopener noreferrer" className="whatsapp-btn">
                                            <MessageCircle size={16} /> WhatsApp (+229 01 66 65 57 57)
                                        </a>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span>Allada:</span>
                                        <a href="https://wa.me/2290167610909" target="_blank" rel="noopener noreferrer" className="whatsapp-btn">
                                            <MessageCircle size={16} /> WhatsApp (+229 01 67 61 09 09)
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Services;
