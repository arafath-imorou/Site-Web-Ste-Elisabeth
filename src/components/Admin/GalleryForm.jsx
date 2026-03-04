import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { X, Check, Image as ImageIcon } from 'lucide-react';

const GalleryForm = ({ item, onSave, onCancel }) => {
    const [formData, setFormData] = useState(item || {
        title: '',
        image_url: '',
        category: 'Suites'
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (formData.id) {
                const { error } = await supabase.from('gallery').update(formData).eq('id', formData.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('gallery').insert([formData]);
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
                    <h3>{formData.id ? 'Modifier l\'image' : 'Ajouter à la galerie'}</h3>
                    <button onClick={onCancel}><X size={20} /></button>
                </header>

                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="form-group">
                        <label>Titre (Optionnel)</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Catégorie</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="Suites">Suites</option>
                            <option value="Restaurant">Restaurant</option>
                            <option value="Espaces">Espaces Verts</option>
                            <option value="Événements">Événements</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Image URL</label>
                        <input
                            type="text"
                            value={formData.image_url}
                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                            required
                            placeholder="https://images.unsplash.com/..."
                        />
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

export default GalleryForm;
