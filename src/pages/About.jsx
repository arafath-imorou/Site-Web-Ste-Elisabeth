import React from 'react';
import './About.css';

const About = () => {
    return (
        <div className="about-page">
            <section className="page-header">
                <div className="container animate-up">
                    <h1>Notre Histoire</h1>
                    <p>L'art de recevoir et la passion de l'exceptionnel.</p>
                </div>
            </section>

            <div className="container section">
                <div className="about-grid animate-up">
                    <div className="about-text">
                        <span className="subtitle">HÉRITAGE & EXPANSION</span>
                        <h2>L'Excellence Hospitalière au Bénin</h2>
                        <p>La Résidence Hôtel Sainte Elisabeth House est née d'une vision : offrir un havre de paix alliant confort et hospitalité béninoise dans un écrin de verdure. Depuis nos débuts, nous nous efforçons de créer des espaces où la nature rencontre la chaleur de notre accueil.</p>
                        <p>Afin de mieux servir nos hôtes, nous nous sommes étendus sur deux sites stratégiques : Abomey-Calavi et Allada. Chaque site possède son propre caractère, tout en partageant la même promesse d'excellence et de sérénité.</p>
                    </div>
                    <div className="about-image-stack">
                        <img src="/Images/7cbbeea4-8825-4e89-9d81-ebc613ad9663.jpg" alt="Réception" className="img-1" />
                        <img src="/Images/bbbe2410-d06f-4968-95d5-4ebe65b80f4c.jpg" alt="Restaurant" className="img-2 glass-box" />
                    </div>
                </div>
            </div>

            <section className="philosophy section animate-up">
                <div className="container">
                    <div className="section-header">
                        <span className="subtitle">PHILOSOPHIE</span>
                        <h2>Nos Valeurs Fondamentales</h2>
                    </div>
                    <div className="values-grid">
                        <div className="value-item">
                            <h3>Authenticité</h3>
                            <p>Nous privilégions le vrai, des matériaux nobles de notre architecture aux produits locaux de notre table.</p>
                        </div>
                        <div className="value-item">
                            <h3>Sérénité</h3>
                            <p>Votre tranquillité est notre priorité absolue. Nous créons des espaces de calme au milieu du monde moderne.</p>
                        </div>
                        <div className="value-item">
                            <h3>Service</h3>
                            <p>L'anticipation de vos besoins est le cœur de notre métier. Notre équipe est dédiée à votre satisfaction totale.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="cta-section section container animate-up">
                <div className="cta-box glass-box">
                    <h2>Prêt à vivre l'exceptionnel ?</h2>
                    <p>Réservez votre séjour dès aujourd'hui et laissez-vous emporter par le calme et la verdure de notre résidence.</p>
                    <a href="/booking" className="btn-primary">RÉSERVER VOTRE SÉJOUR</a>
                </div>
            </section>
        </div>
    );
};

export default About;
