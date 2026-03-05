import React from 'react';

const Features = () => {
    return (
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
                    <img
                        src="/Images/73eec850-7b1e-4fba-b0b2-e318ecb4442c.jpg"
                        alt="Jardin"
                        loading="lazy"
                        width="600"
                        height="400"
                    />
                </div>
            </div>
        </section>
    );
};

export default Features;
