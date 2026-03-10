import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { X, CheckCircle, Printer, FileDown } from 'lucide-react';
import RegistrationFormPrint from './RegistrationFormPrint';

const StayForm = ({ client, userSite, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        site: userSite || 'Abomey-Calavi',
        room_id: '',
        room_number: '',
        check_in: new Date().toISOString().split('T')[0],
        check_out: '',
        travel_reason: '',
        transport_mode: '',
        age: '',
        profession: '',
        occupation: '',
        phone: '',
        email: '',
        full_address: '',
        usual_residence: '',
        coming_from: '',
        going_to: '',
        children_count: 0,
    });

    const [rooms, setRooms] = useState([]);
    const [activeStay, setActiveStay] = useState(null);
    const [realCheckoutDate, setRealCheckoutDate] = useState(new Date().toISOString().split('T')[0]);
    const [showPrintPreview, setShowPrintPreview] = useState(false);
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
                usual_residence: client.usual_residence || '',
                full_address: client.full_address || '',
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
                // Default real checkout date to today for closure
                const today = new Date().toISOString().split('T')[0];
                setRealCheckoutDate(today);
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
            // 1. Fetch available room categories
            const { data: roomsData, error: roomsError } = await supabase
                .from('rooms')
                .select('*')
                .eq('site', site)
                .is('is_available', true);

            if (roomsError) throw roomsError;

            // 2. Fetch all active stays to identify occupied room numbers (especially for Allada shared rooms)
            const { data: activeStays, error: staysError } = await supabase
                .from('stays')
                .select('room_number')
                .eq('site', site)
                .eq('status', 'active');

            if (staysError) throw staysError;

            const occupiedNumbers = activeStays?.map(s => s.room_number).filter(Boolean) || [];

            // 3. Filter rooms and their numbers
            let filteredRooms = roomsData || [];
            if (site === 'Allada') {
                // For Allada, we filter room_numbers array within each category
                filteredRooms = filteredRooms.map(room => {
                    if (room.room_numbers) {
                        return {
                            ...room,
                            room_numbers: room.room_numbers.filter(num => !occupiedNumbers.includes(num))
                        };
                    }
                    return room;
                }).filter(room => !room.room_numbers || room.room_numbers.length > 0);
            }

            setRooms(filteredRooms);

            // Pre-select first room or reset if none
            if (filteredRooms.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    room_id: filteredRooms[0].id,
                    room_number: (filteredRooms[0].site === 'Allada' && filteredRooms[0].room_numbers?.length > 0) ? filteredRooms[0].room_numbers[0] : ''
                }));
            } else {
                setFormData(prev => ({ ...prev, room_id: '', room_number: '' }));
            }
        } catch (err) {
            console.error('Error fetching rooms:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'room_id') {
            const selectedRoom = rooms.find(r => r.id === value);
            setFormData(prev => ({
                ...prev,
                room_id: value,
                room_number: (selectedRoom?.site === 'Allada' && selectedRoom?.room_numbers?.length > 0) ? selectedRoom.room_numbers[0] : ''
            }));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleCreateStay = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // 1. Update client info
            const { error: clientUpdateError } = await supabase
                .from('clients')
                .update({
                    usual_residence: formData.usual_residence,
                    full_address: formData.full_address,
                    profession: formData.profession,
                    phone: formData.phone,
                    email: formData.email
                })
                .eq('id', client.id);

            if (clientUpdateError) throw clientUpdateError;

            // 2. Insert stay
            const { data: stayData, error: insertError } = await supabase
                .from('stays')
                .insert([{
                    client_id: client.id,
                    room_id: formData.room_id,
                    room_number: formData.room_number,
                    site: formData.site,
                    check_in: formData.check_in,
                    check_out: formData.check_out,
                    travel_reason: formData.travel_reason,
                    transport_mode: formData.transport_mode,
                    coming_from: formData.coming_from,
                    going_to: formData.going_to,
                    children_count: parseInt(formData.children_count) || 0,
                    age: parseInt(formData.age) || null,
                    profession: formData.profession,
                    occupation: formData.occupation,
                    phone: formData.phone,
                    email: formData.email,
                    status: 'active'
                }])
                .select()
                .single();

            if (insertError) throw insertError;

            // 3. Mark room as unavailable (ONLY if not Allada, or if it was the last room - simplified to check if not Allada)
            if (formData.site !== 'Allada') {
                const { error: roomUpdateError } = await supabase
                    .from('rooms')
                    .update({ is_available: false })
                    .eq('id', formData.room_id);

                if (roomUpdateError) throw roomUpdateError;
            }

            // 4. Set active stay for the print preview which will handle PDF generation
            setActiveStay({ ...stayData, rooms: rooms.find(r => r.id === formData.room_id) });
            setSuccessMsg('Séjour créé avec succès ! Veuillez enregistrer la fiche PDF.');
            setShowSuccess(true);

            // We don't call onSave() yet because we want the user to see the success/print preview
        } catch (err) {
            console.error('Error creating stay:', err);
            setError(err.message || 'Erreur lors de la création du séjour.');
        } finally {
            setLoading(false);
        }
    };

    const handlePdfGenerated = async (blob) => {
        if (!activeStay) return;

        setLoading(true);
        try {
            const fileName = `${client.id}/${activeStay.id}_fiche.pdf`;

            // Upload to storage
            const { error: uploadError } = await supabase.storage
                .from('registration-forms')
                .upload(fileName, blob, {
                    contentType: 'application/pdf',
                    upsert: true
                });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('registration-forms')
                .getPublicUrl(fileName);

            // Update stays record
            const { error: updateError } = await supabase
                .from('stays')
                .update({ registration_form_url: publicUrl })
                .eq('id', activeStay.id);

            if (updateError) throw updateError;

            console.log('PDF stored and linked successfully:', publicUrl);
        } catch (err) {
            console.error('Error uploading PDF:', err);
            // Non-critical error, the stay is already created
        } finally {
            setLoading(false);
        }
    };

    const [showSuccess, setShowSuccess] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const handleCheckout = async () => {
        if (!activeStay) {
            setError('Aucun séjour actif trouvé à clôturer.');
            return;
        }

        if (!window.confirm("Voulez-vous vraiment boucler ce séjour ? Le client recevra ses points de fidélité selon la durée réelle.")) return;

        setLoading(true);
        setError('');
        console.log('Starting checkout for stay:', activeStay.id);

        try {
            // 1. Mark stay as completed and update checkout date
            const { error: updateError } = await supabase
                .from('stays')
                .update({
                    status: 'completed',
                    real_check_out: realCheckoutDate
                })
                .eq('id', activeStay.id);

            if (updateError) {
                console.error('Stay update error:', updateError);
                throw new Error(`Erreur séjour: ${updateError.message}`);
            }

            // 2. Mark room as available again (ONLY if not Allada)
            if (activeStay.site !== 'Allada') {
                const { error: roomUpdateError } = await supabase
                    .from('rooms')
                    .update({ is_available: true })
                    .eq('id', activeStay.room_id);

                if (roomUpdateError) {
                    console.error('Room update error:', roomUpdateError);
                    throw new Error(`Erreur chambre: ${roomUpdateError.message}`);
                }
            }

            // 3. Add loyalty points to the client
            const checkInDate = new Date(activeStay.check_in);
            const checkOutDate = new Date(realCheckoutDate);
            const diffTime = Math.abs(checkOutDate - checkInDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; // Minimum 1 night

            const pointsToAdd = diffDays;
            const newPoints = (client.loyalty_points || 0) + pointsToAdd;

            console.log(`Adding ${pointsToAdd} points to client ${client.id}. New total: ${newPoints}`);

            const { error: clientError } = await supabase
                .from('clients')
                .update({ loyalty_points: newPoints })
                .eq('id', client.id);

            if (clientError) {
                console.error('Client points update error:', clientError);
                throw new Error(`Erreur points: ${clientError.message}`);
            }

            setSuccessMsg(`Séjour terminé avec succès ! ${pointsToAdd} points ont été ajoutés au client.`);
            setShowSuccess(true);
        } catch (err) {
            console.error('Error checking out:', err);
            setError(`Échec de la clôture: ${err.message || 'Erreur inconnue'}`);
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

                {error && <div className="error-message" style={{ color: 'red', marginTop: '1rem', padding: '10px', backgroundColor: '#fee2e2', borderRadius: '4px' }}>{error}</div>}

                {showSuccess ? (
                    <div style={{ padding: '30px', textAlign: 'center' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <CheckCircle size={60} color="#10b981" style={{ margin: '0 auto' }} />
                        </div>
                        <h3 style={{ color: '#047857', marginBottom: '10px' }}>Félicitations !</h3>
                        <p style={{ marginBottom: '10px', color: '#374151' }}>{successMsg}</p>

                        {activeStay?.registration_form_url && (
                            <div style={{ marginBottom: '25px', textAlign: 'center' }}>
                                <a
                                    href={activeStay.registration_form_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="status confirmed"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '8px 20px',
                                        textDecoration: 'none',
                                        fontWeight: 'bold',
                                        fontSize: '1rem'
                                    }}
                                >
                                    <FileDown size={20} /> FICHE (PDF)
                                </a>
                            </div>
                        )}

                        <button
                            className="btn-primary"
                            style={{ backgroundColor: '#10b981', width: '100%', padding: '12px', marginBottom: '10px' }}
                            onClick={() => {
                                // If the form is already generated, we can close
                                onSave();
                            }}
                        >
                            Terminer et Actualiser
                        </button>

                        {!activeStay?.registration_form_url && (
                            <button
                                className="btn-secondary"
                                style={{ width: '100%', padding: '12px' }}
                                onClick={() => setShowPrintPreview(true)}
                            >
                                <FileDown size={18} style={{ marginRight: '8px' }} /> Générer/Enregistrer la fiche PDF
                            </button>
                        )}
                    </div>
                ) : (
                    <>
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
                                    <div><strong>Catégorie :</strong> {activeStay.rooms?.name || 'Inconnue'}</div>
                                    {activeStay.room_number && <div><strong>Chambre N° :</strong> {activeStay.room_number}</div>}
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

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <button
                                        className="btn-primary"
                                        style={{ backgroundColor: '#10b981', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                        onClick={handleCheckout}
                                        disabled={loading}
                                    >
                                        {loading ? 'TRAITEMENT...' : 'BOUCLER LE SÉJOUR ET ATTRIBUER LES POINTS'}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: '1px solid #10b981', color: '#047857' }}
                                        onClick={() => setShowPrintPreview(true)}
                                    >
                                        <Printer size={20} /> Aperçu de la fiche
                                    </button>
                                </div>

                                {/* Printable component with preview */}
                                {showPrintPreview && (
                                    <RegistrationFormPrint
                                        client={client}
                                        stay={activeStay}
                                        onClose={() => setShowPrintPreview(false)}
                                        onPdfGenerated={handlePdfGenerated}
                                    />
                                )}
                            </div>
                        )}

                        {/* NEW STAY FORM */}
                        {!loading && !activeStay && (
                            <form onSubmit={handleCreateStay} className="admin-form" style={{ marginTop: '1rem' }}>
                                <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label>Site</label>
                                        <select name="site" value={formData.site} onChange={handleChange} disabled={!!userSite}>
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
                                    {formData.site === 'Allada' && formData.room_id && rooms.find(r => r.id === formData.room_id)?.room_numbers && (
                                        <div>
                                            <label>Numéro de Chambre</label>
                                            <select
                                                name="room_number"
                                                value={formData.room_number}
                                                onChange={handleChange}
                                                required
                                            >
                                                {rooms.find(r => r.id === formData.room_id).room_numbers.map(num => (
                                                    <option key={num} value={num}>{num}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
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
                                            <input type="text" name="travel_reason" value={formData.travel_reason} onChange={handleChange} placeholder="ex: Affaires, Tourisme..." required />
                                        </div>
                                        <div>
                                            <label>Mode de transport</label>
                                            <input type="text" name="transport_mode" value={formData.transport_mode} onChange={handleChange} placeholder="ex: Voiture, Avion..." required />
                                        </div>
                                        <div style={{ gridColumn: 'span 1' }}>
                                            <label>Venant de (Provenance)</label>
                                            <input type="text" name="coming_from" value={formData.coming_from} onChange={handleChange} placeholder="ex: Cotonou, Paris..." />
                                        </div>
                                        <div style={{ gridColumn: 'span 1' }}>
                                            <label>Allant à (Destination)</label>
                                            <input type="text" name="going_to" value={formData.going_to} onChange={handleChange} placeholder="ex: Abidjan, Rome..." />
                                        </div>
                                        <div style={{ gridColumn: 'span 2' }}>
                                            <label>Nombre d'enfants de moins de 15 ans accompagnant le chef de famille</label>
                                            <input type="number" name="children_count" value={formData.children_count} onChange={handleChange} min="0" />
                                        </div>
                                    </div>

                                    <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label>Domicile habituel</label>
                                            <input type="text" name="usual_residence" value={formData.usual_residence} onChange={handleChange} placeholder="ex: Cotonou, Haie Vive" />
                                        </div>
                                        <div>
                                            <label>Adresse complète</label>
                                            <input type="text" name="full_address" value={formData.full_address} onChange={handleChange} placeholder="Quartier, Rue, Maison..." />
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
                    </>
                )}
            </div>
        </div>
    );
};

export default StayForm;
