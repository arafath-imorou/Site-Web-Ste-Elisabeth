import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Phone, MapPin, Send, CheckCircle, MessageCircle, ExternalLink } from 'lucide-react';
import './Contact.css';

const Contact = () => {
    const [settings, setSettings] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState(null); // 'submitting', 'success', 'error'

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        const { data, error } = await supabase.from('site_settings').select('key, value');
        if (!error && data) {
            const settingsMap = data.reduce((acc, curr) => {
                acc[curr.key] = curr.value;
                return acc;
            }, {});
            setSettings(settingsMap);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            const { error } = await supabase.from('contacts').insert([formData]);
            if (error) throw error;
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            console.error('Error sending message:', err);
            setStatus('error');
        }
    };

    return (
        <div className="contact-page">
            <section className="page-header narrow">
                <div className="container animate-up">
                    <h1>Contactez-nous</h1>
                    <p>Notre équipe est à votre écoute pour préparer votre séjour idéal.</p>
                </div>
            </section>

            <div className="container section">
                <div className="contact-grid animate-up">
                    <div className="contact-info">
                        <div className="info-box glass-box">
                            <h3>Site Abomey-Calavi</h3>
                            <div className="info-item">
                                <MapPin className="icon" size={24} />
                                <div>
                                    <h4>Adresse</h4>
                                    <p>{settings.contact_address_calavi || 'Abomey-Calavi, Bénin'}</p>
                                    <a
                                        href="https://maps.app.goo.gl/DsmsM7kh92g7ha4o9"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="map-link"
                                    >
                                        <ExternalLink size={14} /> Voir sur Google Maps
                                    </a>
                                </div>
                            </div>
                            <div className="info-item">
                                <Phone className="icon" size={24} />
                                <div className="contact-details-group">
                                    <div>
                                        <h4>Téléphone (WhatsApp)</h4>
                                        <p>{(settings.contact_whatsapp_calavi || '+229 01 66 65 57 57').split(' / ')[0]}</p>
                                        {(settings.contact_whatsapp_calavi || '').includes(' / ') && (
                                            <p className="secondary-phone">{(settings.contact_whatsapp_calavi || '').split(' / ')[1]}</p>
                                        )}
                                    </div>
                                    <a
                                        href={`https://wa.me/${(settings.contact_whatsapp_calavi || '+229 01 66 65 57 57').replace(/[^0-9]/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="whatsapp-btn"
                                    >
                                        <MessageCircle size={18} /> WhatsApp
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="info-box glass-box" style={{ marginTop: '20px' }}>
                            <h3>Site Allada</h3>
                            <div className="info-item">
                                <MapPin className="icon" size={24} />
                                <div>
                                    <h4>Adresse</h4>
                                    <p>{settings.contact_address_allada || 'Allada, Bénin'}</p>
                                    <a
                                        href="https://maps.app.goo.gl/FtbPQc5Gdins6gJX7"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="map-link"
                                    >
                                        <ExternalLink size={14} /> Voir sur Google Maps
                                    </a>
                                </div>
                            </div>
                            <div className="info-item">
                                <Phone className="icon" size={24} />
                                <div className="contact-details-group">
                                    <div>
                                        <h4>Téléphone (WhatsApp)</h4>
                                        <p>{(settings.contact_whatsapp_allada || '+229 01 67 61 09 09').split(' / ')[0]}</p>
                                        {(settings.contact_whatsapp_allada || '').includes(' / ') && (
                                            <p className="secondary-phone">{(settings.contact_whatsapp_allada || '').split(' / ')[1]}</p>
                                        )}
                                    </div>
                                    <a
                                        href={`https://wa.me/${(settings.contact_whatsapp_allada || '+229 01 67 61 09 09').replace(/[^0-9]/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="whatsapp-btn"
                                    >
                                        <MessageCircle size={18} /> WhatsApp
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="contact-form-wrapper">
                        {status === 'success' ? (
                            <div className="success-message glass-box animate-up">
                                <CheckCircle size={48} className="success-icon" />
                                <h2>Message Envoyé !</h2>
                                <p>Merci de nous avoir contactés. Nous vous répondrons dans les plus brefs délais.</p>
                                <button className="btn-outline" onClick={() => setStatus(null)}>Envoyer un autre message</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="contact-form glass-box">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Nom complet</label>
                                        <input name="name" type="text" value={formData.name} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input name="email" type="email" value={formData.email} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Sujet</label>
                                    <input name="subject" type="text" value={formData.subject} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Message</label>
                                    <textarea name="message" rows="5" value={formData.message} onChange={handleChange} required></textarea>
                                </div>
                                {status === 'error' && <p className="error-text">Une erreur est survenue. Veuillez réessayer.</p>}
                                <button type="submit" className="btn-primary" disabled={status === 'submitting'}>
                                    {status === 'submitting' ? 'Envoi...' : <><Send size={18} /> ENVOYER LE MESSAGE</>}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
