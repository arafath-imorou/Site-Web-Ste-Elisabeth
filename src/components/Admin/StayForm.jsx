import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { X, CheckCircle } from 'lucide-react';

const StayForm = ({ client, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        site: 'Abomey-Calavi',
        room_id: '',
        check_in: new Date().toISOString().split('T')[0],
        check_out: '',
        travel_reason: '',
        transport_mode: '',
        age: '',
        profession: '',
        occupation: '',
        phone: '',
        email: '',
    });

    const [rooms, setRooms] = useState([]);
    const [activeStay, setActiveStay] = useState(null);
    const [realCheckoutDate, setRealCheckoutDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (client) {
            fetchActiveStay();
            // Pre-fill fields from client data for new stays
            setFormData(prev => ({
                ...prev,
                profession: client.profession || '',
                phone: client.phone || '',
                email: client.email || '',
                age: calculateAge(client.birth_date) || ''
            }));
        }
    }, [client]);

    const calculateAge = (birthDate) => {
        if (!birthDate) return null;
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    useEffect(() => {
        if (!activeStay) {
            fetchRooms(formData.site);
        }
    }, [formData.site, activeStay]);

    const fetchActiveStay = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('stays')
                .select('*, rooms(name)')
                .eq('client_id', client.id)
                .eq('status', 'active')
                .maybeSingle(); // Returns one or null

            if (error) throw error;
            if (data) {
                setActiveStay(data);
                setRealCheckoutDate(data.check_out);
            }
        } catch (err) {
            console.error('Error fetching stay:', err);
            setError('Erreur lors du chargement du séjour actif.');
        } finally {
            setLoading(false);
        }
    };

    const fetchRooms = async (site) => {
        try {
            const { data, error } = await supabase
                .from('rooms')
                .select('*')
                .eq('site', site)
                .eq('is_available', true); // Note: might want to refine availability based on dates

            if (error) throw error;
            setRooms(data || []);
            if (data && data.length > 0 && !formData.room_id) {
                setFormData(prev => ({ ...prev, room_id: data[0].id }));
            }
        } catch (err) {
            console.error('Error fetching rooms:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCreateStay = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { error: insertError } = await supabase
                .from('stays')
                .insert([{
                    client_id: client.id,
                    room_id: formData.room_id,
                    site: formData.site,
                    check_in: formData.check_in,
                    check_out: formData.check_out,
                    travel_reason: formData.travel_reason,
                    transport_mode: formData.transport_mode,
                    age: parseInt(formData.age) || null,
                    profession: formData.profession,
                    occupation: formData.occupation,
                    phone: formData.phone,
                    email: formData.email,
                    status: 'active'
                }]);

            if (insertError) throw insertError;
            onSave();
        } catch (err) {
            console.error('Error creating stay:', err);
            setError(err.message || 'Erreur lors de la création du séjour.');
        } finally {
            setLoading(false);
        }
    };

    const handleCheckout = async () => {
        if (!window.confirm("Voulez-vous vraiment boucler ce séjour ? Le client recevra +100 points de fidélité.")) return;

        setLoading(true);
        setError('');

        try {
            // 1. Mark stay as completed and update checkout date
            const { error: updateError } = await supabase
                .from('stays')
                .update({
                    status: 'completed',
                    check_out: realCheckoutDate
                })
                .eq('id', activeStay.id);

            if (updateError) throw updateError;

            // 2. Add loyalty points to the client
            const pointsToAdd = 100; // Fixed amount for now, could be dynamic based on stay length
            const newPoints = (client.loyalty_points || 0) + pointsToAdd;

            const { error: clientError } = await supabase
                .from('clients')
                .update({ loyalty_points: newPoints })
                .eq('id', client.id);

            if (clientError) throw clientError;

            onSave();
        } catch (err) {
            console.error('Error checking out:', err);
            setError('Erreur lors de la clôture du séjour.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-card card" style={{ maxWidth: '600px' }}>
                <div className="modal-header">
                    <h3>Séjour : {client?.first_name} {client?.last_name}</h3>
                    <button type="button" className="delete-btn" onClick={onCancel}><X size={20} /></button>
                </div>

                {error && <div className="error-message" style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}

                {loading && !activeStay && <div style={{ padding: '20px', textAlign: 'center' }}>Chargement...</div>}

                {/* ACTIVE STAY VIEW */}
                {!loading && activeStay && (
                    <div style={{ padding: '20px', backgroundColor: '#ecfdf5', border: '1px solid #10b981', borderRadius: '8px', marginTop: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                            <CheckCircle color="#10b981" />
                            <h4 style={{ margin: 0, color: '#047857' }}>Séjour en cours</h4>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                            <div><strong>Site :</strong> {activeStay.site}</div>
                            <div><strong>Chambre :</strong> {activeStay.rooms?.name || 'Inconnue'}</div>
                            <div><strong>Arrivée :</strong> {new Date(activeStay.check_in).toLocaleDateString()}</div>
                            <div><strong>Départ prévu :</strong> {new Date(activeStay.check_out).toLocaleDateString()}</div>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#047857' }}>Saisir la date de départ réelle :</label>
                            <input
                                type="date"
                                className="form-control"
                                value={realCheckoutDate}
                                onChange={(e) => setRealCheckoutDate(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #10b981' }}
                                required
                            />
                        </div>

                        <button
                            className="btn-primary"
                            style={{ width: '100%', backgroundColor: '#10b981', padding: '12px' }}
                            onClick={handleCheckout}
                            disabled={loading}
                        >
                            {loading ? 'Traitement...' : 'Boucler le séjour (Checkout) et attribuer les points'}
                        </button>
                    </div>
                )}

                {/* NEW STAY FORM */}
                {!loading && !activeStay && (
                    <form onSubmit={handleCreateStay} className="admin-form" style={{ marginTop: '1rem' }}>
                        <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label>Site</label>
                                <select name="site" value={formData.site} onChange={handleChange}>
                                    <option value="Abomey-Calavi">Abomey-Calavi</option>
                                    <option value="Allada">Allada</option>
                                </select>
                            </div>
                            <div>
                                <label>Chambre à affecter</label>
                                <select
                                    name="room_id"
                                    value={formData.room_id}
                                    onChange={handleChange}
                                    required
                                    disabled={rooms.length === 0}
                                >
                                    {rooms.length === 0 && <option value="">Aucune chambre dispo</option>}
                                    {rooms.map(room => (
                                        <option key={room.id} value={room.id}>{room.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label>Date d'arrivée</label>
                                <input
                                    type="date"
                                    name="check_in"
                                    value={formData.check_in}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Date de départ souhaitée</label>
                                <input
                                    type="date"
                                    name="check_out"
                                    value={formData.check_out}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid #eee', marginTop: '1.5rem', paddingTop: '1rem' }}>
                            <h4 style={{ marginBottom: '1rem', color: '#4b5563' }}>Informations Complémentaires</h4>

                            <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label>Motif de voyage</label>
                                    <input type="text" name="travel_reason" value={formData.travel_reason} onChange={handleChange} placeholder="ex: Affaires, Tourisme..." />
                                </div>
                                <div>
                                    <label>Mode de transport</label>
                                    <input type="text" name="transport_mode" value={formData.transport_mode} onChange={handleChange} placeholder="ex: Voiture, Avion..." />
                                </div>
                            </div>

                            <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                                <div>
                                    <label>Âge</label>
                                    <input type="number" name="age" value={formData.age} onChange={handleChange} />
                                </div>
                                <div>
                                    <label>Occupation</label>
                                    <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label>Profession</label>
                                    <input type="text" name="profession" value={formData.profession} onChange={handleChange} />
                                </div>
                                <div>
                                    <label>Téléphone (Contact)</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Email (Contact)</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="form-actions" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button type="button" className="btn-secondary" onClick={onCancel} disabled={loading}>
                                Annuler
                            </button>
                            <button type="submit" className="btn-primary" disabled={loading || rooms.length === 0}>
                                {loading ? 'Création...' : 'Créer le séjour'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default StayForm;
