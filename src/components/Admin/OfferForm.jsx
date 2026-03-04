import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { X, Check, Image as ImageIcon } from 'lucide-react';

const OfferForm = ({ offer, onSave, onCancel }) => {
    const [formData, setFormData] = useState(offer || {
        title: '',
        description: '',
        discount_percentage: 10,
        valid_until: new Date().toISOString().split('T')[0],
        image_url: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (formData.id) {
                const { error } = await supabase.from('offers').update(formData).eq('id', formData.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('offers').insert([formData]);
                if (error) throw error;
            }
            onSave();
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-card glass-box animate-up">
                <header className="modal-header">
                    <h3>{formData.id ? 'Modifier l\'offre' : 'Ajouter une offre'}</h3>
                    <button onClick={onCancel}><X size={20} /></button>
                </header>

                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="form-group">
                        <label>Titre de l'offre</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Remise (%)</label>
                            <input
                                type="number"
                                value={formData.discount_percentage}
                                onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Valide jusqu'au</label>
                            <input
                                type="date"
                                value={formData.valid_until}
                                onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Image URL</label>
                        <input
                            type="text"
                            value={formData.image_url}
                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                            placeholder="https://images.unsplash.com/..."
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            rows="4"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-outline" onClick={onCancel}>Annuler</button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Enregistrement...' : <><Check size={18} /> ENREGISTRER</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OfferForm;
