import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { X, Check, Coffee, Waves, Dumbbell, Sparkles, Car, Wifi, Shield, Plane } from 'lucide-react';

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

const ServiceForm = ({ service, onSave, onCancel }) => {
    const [formData, setFormData] = useState(service || {
        name: '',
        description: '',
        icon: 'Coffee',
        is_active: true
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (formData.id) {
                const { error } = await supabase.from('services').update(formData).eq('id', formData.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('services').insert([formData]);
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
                    <h3>{formData.id ? 'Modifier le service' : 'Ajouter un service'}</h3>
                    <button onClick={onCancel}><X size={20} /></button>
                </header>

                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="form-group">
                        <label>Nom du service</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Icône</label>
                        <select
                            value={formData.icon}
                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        >
                            {Object.keys(iconMap).map(iconName => (
                                <option key={iconName} value={iconName}>{iconName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            rows="4"
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
                            Actif
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

export default ServiceForm;
