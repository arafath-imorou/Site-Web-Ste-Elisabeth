import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { X, Check } from 'lucide-react';

const RoomForm = ({ room, onSave, onCancel }) => {
    const [formData, setFormData] = useState(room || {
        name: '',
        description: '',
        price_per_night: 0,
        capacity: 2,
        size_sqm: 30,
        amenities: [],
        is_available: true,
        site: 'Abomey-Calavi',
        image: ''
    });
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(formData.image || '');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = formData.image;

            // Upload file if selected
            if (file) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError, data } = await supabase.storage
                    .from('hotel-images')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('hotel-images')
                    .getPublicUrl(filePath);

                imageUrl = publicUrl;
            }

            const dataToSave = { ...formData, image: imageUrl };

            if (dataToSave.id) {
                const { error } = await supabase.from('rooms').update(dataToSave).eq('id', dataToSave.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('rooms').insert([dataToSave]);
                if (error) throw error;
            }
            onSave();
        } catch (err) {
            alert("Erreur lors de l'enregistrement: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-card glass-box animate-up">
                <header className="modal-header">
                    <h3>{formData.id ? 'Modifier la chambre' : 'Ajouter une chambre'}</h3>
                    <button onClick={onCancel}><X size={20} /></button>
                </header>

                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="form-group">
                        <label>Nom de la chambre</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Site / Emplacement</label>
                        <select
                            value={formData.site}
                            onChange={(e) => setFormData({ ...formData, site: e.target.value })}
                            required
                        >
                            <option value="Abomey-Calavi">Abomey-Calavi</option>
                            <option value="Allada">Allada</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Image de la chambre</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: '#f9f9f9', padding: '1rem', borderRadius: '8px' }}>
                            {previewUrl && (
                                <img src={previewUrl} alt="Aperçu" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }} />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ padding: '0.5rem', background: 'white', border: '1px solid #ccc', borderRadius: '4px' }}
                            />
                            <small style={{ color: '#666' }}>Laissez vide si vous ne souhaitez pas modifier l'image actuelle.</small>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Prix Unique (FCFA)</label>
                            <input
                                type="number"
                                value={formData.price_per_night}
                                onChange={(e) => setFormData({ ...formData, price_per_night: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Capacité (pers)</label>
                            <input
                                type="number"
                                value={formData.capacity}
                                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row" style={{ background: '#f0f4f8', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                        <div className="form-group">
                            <label>Prix Ventillée (Optionnel)</label>
                            <input
                                type="number"
                                value={formData.prices?.ventillee || ''}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    prices: { ...formData.prices, ventillee: e.target.value ? parseInt(e.target.value) : null }
                                })}
                                placeholder="ex: 10500"
                            />
                        </div>
                        <div className="form-group">
                            <label>Prix Climée (Optionnel)</label>
                            <input
                                type="number"
                                value={formData.prices?.climee || ''}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    prices: { ...formData.prices, climee: e.target.value ? parseInt(e.target.value) : null }
                                })}
                                placeholder="ex: 12500"
                            />
                        </div>
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

export default RoomForm;
