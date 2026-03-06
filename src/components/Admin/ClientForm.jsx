import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { X } from 'lucide-react';

const ClientForm = ({ client, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        unique_client_id: '',
        first_name: '',
        last_name: '',
        maiden_name: '',
        birth_date: '',
        birth_place: '',
        department: '',
        country: '',
        profession: '',
        usual_residence: '',
        nationality: '',
        id_type: 'CNI',
        id_number: '',
        id_issue_date: '',
        id_expiry_date: '',
        id_issue_place: '',
        email: '',
        phone: '',
        loyalty_points: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (client) {
            setFormData(client);
        }
    }, [client]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Convert empty string dates to null for Supabase to prevent type errors
            const payload = { ...formData };
            if (!payload.birth_date) payload.birth_date = null;
            if (!payload.id_issue_date) payload.id_issue_date = null;
            if (!payload.id_expiry_date) payload.id_expiry_date = null;

            if (client) {
                const { error: updateError } = await supabase
                    .from('clients')
                    .update(payload)
                    .eq('id', client.id);
                if (updateError) throw updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('clients')
                    .insert([payload]);
                if (insertError) throw insertError;
            }
            onSave();
        } catch (err) {
            console.error('Error saving client:', err);
            setError(err.message || 'Une erreur est survenue lors de l\'enregistrement.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-card card" style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
                <div className="modal-header" style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 10, paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                    <h3>{client ? 'Modifier le Client' : 'Ajouter un Client'}</h3>
                    <button type="button" className="delete-btn" onClick={onCancel}><X size={20} /></button>
                </div>

                {error && <div className="error-message" style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}

                <form onSubmit={handleSubmit} className="admin-form" style={{ marginTop: '1rem' }}>

                    {/* Identifier and Points */}
                    <div style={{ padding: '15px', backgroundColor: '#f9fafb', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #e5e7eb' }}>
                        <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: 0 }}>
                            <div>
                                <label style={{ fontWeight: 'bold' }}>ID Unique</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input
                                        type="text"
                                        name="unique_client_id"
                                        value={client ? formData.unique_client_id : 'Généré automatiquement'}
                                        readOnly
                                        style={{ flex: 1, backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ fontWeight: 'bold' }}>Points de Fidélité</label>
                                <input
                                    type="number"
                                    name="loyalty_points"
                                    value={formData.loyalty_points}
                                    onChange={handleChange}
                                    min="0"
                                    style={{ backgroundColor: '#fff' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section: Informations Personnelles */}
                    <h4 style={{ borderBottom: '2px solid var(--color-primary)', paddingBottom: '5px', marginBottom: '1rem' }}>Informations Personnelles</h4>

                    <div className="form-group" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div>
                            <label>Nom <span style={{ color: 'red' }}>*</span></label>
                            <input type="text" name="last_name" value={formData.last_name || ''} onChange={handleChange} required />
                        </div>
                        <div>
                            <label>Prénom(s) <span style={{ color: 'red' }}>*</span></label>
                            <input type="text" name="first_name" value={formData.first_name || ''} onChange={handleChange} required />
                        </div>
                        <div>
                            <label>Nom de jeune fille</label>
                            <input type="text" name="maiden_name" value={formData.maiden_name || ''} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-group" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div>
                            <label>Date de naissance</label>
                            <input type="date" name="birth_date" value={formData.birth_date || ''} onChange={handleChange} />
                        </div>
                        <div>
                            <label>Lieu de naissance</label>
                            <input type="text" name="birth_place" value={formData.birth_place || ''} onChange={handleChange} />
                        </div>
                        <div>
                            <label>Département</label>
                            <input type="text" name="department" value={formData.department || ''} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-group" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div>
                            <label>Nationalité</label>
                            <input type="text" name="nationality" value={formData.nationality || ''} onChange={handleChange} />
                        </div>
                        <div>
                            <label>Profession</label>
                            <input type="text" name="profession" value={formData.profession || ''} onChange={handleChange} />
                        </div>
                        <div>
                            <label>Pays</label>
                            <input type="text" name="country" value={formData.country || ''} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Domicile habituel</label>
                        <input type="text" name="usual_residence" value={formData.usual_residence || ''} onChange={handleChange} />
                    </div>

                    {/* Section: Pièce d'Identité */}
                    <h4 style={{ borderBottom: '2px solid var(--color-primary)', paddingBottom: '5px', marginTop: '2rem', marginBottom: '1rem' }}>Pièce d'Identité</h4>

                    <div className="form-group" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                        <div>
                            <label>Type de pièce d'identité</label>
                            <select name="id_type" value={formData.id_type || 'CNI'} onChange={handleChange}>
                                <option value="CNI">Carte Nationale d'Identité (CNI)</option>
                                <option value="CIP">Carte d'Identification Personnelle (CIP)</option>
                                <option value="Carte Biométrique">Carte Biométrique</option>
                                <option value="Passeport">Passeport</option>
                                <option value="Permis de conduire">Permis de conduire</option>
                                <option value="Carte Consulaire">Carte Consulaire</option>
                                <option value="Carte Professionnelle">Carte Professionnelle</option>
                                <option value="Autre">Autre</option>
                            </select>
                        </div>
                        <div>
                            <label>N° de la pièce</label>
                            <input type="text" name="id_number" value={formData.id_number || ''} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-group" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div>
                            <label>Date de délivrance</label>
                            <input type="date" name="id_issue_date" value={formData.id_issue_date || ''} onChange={handleChange} />
                        </div>
                        <div>
                            <label>Date d'expiration</label>
                            <input type="date" name="id_expiry_date" value={formData.id_expiry_date || ''} onChange={handleChange} />
                        </div>
                        <div>
                            <label>Lieu de délivrance</label>
                            <input type="text" name="id_issue_place" value={formData.id_issue_place || ''} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Section: Contact */}
                    <h4 style={{ borderBottom: '2px solid var(--color-primary)', paddingBottom: '5px', marginTop: '2rem', marginBottom: '1rem' }}>Contact Rapide</h4>

                    <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label>Email</label>
                            <input type="email" name="email" value={formData.email || ''} onChange={handleChange} />
                        </div>
                        <div>
                            <label>Téléphone</label>
                            <input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-actions" style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem', position: 'sticky', bottom: '-10px', backgroundColor: '#fff', padding: '1rem 0', borderTop: '1px solid #eee' }}>
                        <button type="button" className="btn-secondary" onClick={onCancel} disabled={loading}>
                            Annuler
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Enregistrement...' : 'Enregistrer le client'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClientForm;
