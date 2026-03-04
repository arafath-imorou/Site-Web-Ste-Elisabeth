import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { X, Check } from 'lucide-react';

const MenuForm = ({ item, onSave, onCancel }) => {
    const [formData, setFormData] = useState(item || {
        name: '',
        description: '',
        price: '',
        category: 'Repas',
        is_active: true
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (formData.id) {
                const { error } = await supabase.from('restaurant_menus').update(formData).eq('id', formData.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('restaurant_menus').insert([formData]);
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
                    <h3>{formData.id ? 'Modifier le plat' : 'Ajouter un plat'}</h3>
                    <button onClick={onCancel}><X size={20} /></button>
                </header>

                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="form-group">
                        <label>Nom du plat</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label>Prix (ex: 3 000 FCFA)</label>
                            <input
                                type="text"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>Catégorie</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="Petits déjeuners">Petits déjeuners</option>
                                <option value="Repas">Les repas</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description (optionnel)</label>
                        <textarea
                            rows="3"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>

                    <div className="form-group checkbox">
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            />
                            Disponible
                        </label>
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

export default MenuForm;
