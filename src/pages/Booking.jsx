import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Calendar, Users, Home, CreditCard, CheckCircle, ChevronRight, MapPin, MessageCircle } from 'lucide-react';
import { SITES } from '../constants/sites';
import { MOCK_ROOMS } from '../data/mockRooms';
import { formatPrice } from '../lib/formatUtils';
import './Booking.css';

const Booking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const initialRoomId = queryParams.get('room');
    const initialCheckIn = queryParams.get('checkIn') || '';
    const initialCheckOut = queryParams.get('checkOut') || '';
    const initialSite = queryParams.get('site') || SITES.ABOMEY_CALAVI;
    const initialGuests = parseInt(queryParams.get('guests')) || 2;

    const [step, setStep] = useState(1);
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingData, setBookingData] = useState({
        room_id: initialRoomId || '',
        room_number: '',
        site: initialSite,
        check_in: initialCheckIn,
        check_out: initialCheckOut,
        guests_count: initialGuests,
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        event_type: '',
        special_requests: '',
        total_price: 0
    });

    const selectedRoomDetails = filteredRooms.find(r => r.id === bookingData.room_id);
    const isConference = selectedRoomDetails?.name?.toLowerCase().includes('conférence');

    useEffect(() => {
        fetchRooms();
    }, []);

    useEffect(() => {
        if (rooms.length > 0) {
            // Filtrer par site et étendre les options de climatisation si nécessaire
            const filtered = [];
            rooms.forEach(room => {
                if (room.site === bookingData.site) {
                    if (room.prices) {
                        // Si la chambre a plusieurs tarifs (Abomey-Calavi), on crée des options distinctes
                        if (room.prices.ventillee) {
                            filtered.push({
                                ...room,
                                id: `${room.id}-ventillee`,
                                name: `${room.name} (Ventillée)`,
                                price_per_night: room.prices.ventillee
                            });
                        }
                        if (room.prices.climee) {
                            filtered.push({
                                ...room,
                                id: `${room.id}-climee`,
                                name: `${room.name} (Climée)`,
                                price_per_night: room.prices.climee
                            });
                        }
                    } else {
                        filtered.push(room);
                    }
                }
            });

            setFilteredRooms(filtered);

            // Si la chambre sélectionnée n'est pas dans le nouveau site, on la réinitialise
            if (bookingData.room_id && !filtered.find(r => r.id === bookingData.room_id)) {
                setBookingData(prev => ({ ...prev, room_id: '', total_price: 0 }));
            }
        }
    }, [bookingData.site, rooms]);

    const fetchRooms = async () => {
        setLoading(true);
        try {
            // 1. Fetch available rooms
            const { data: roomsData, error: roomsError } = await supabase.from('rooms').select('*').eq('is_available', true);

            if (roomsError) throw roomsError;

            let occupiedNumbers = [];
            // 2. If dates are provided, fetch occupied room numbers for Allada
            if (initialCheckIn && initialCheckOut && initialSite === SITES.ALLADA) {
                const { data: stays, error: staysError } = await supabase
                    .from('stays')
                    .select('room_number')
                    .eq('site', 'Allada')
                    .lt('check_in', initialCheckOut)
                    .gt('check_out', initialCheckIn)
                    .neq('status', 'cancelled');

                const { data: reservations, error: reservationsError } = await supabase
                    .from('reservations')
                    .select('room_number')
                    .eq('site', 'Allada')
                    .lt('check_in', initialCheckOut)
                    .gt('check_out', initialCheckIn)
                    .neq('status', 'cancelled');

                if (!staysError && stays) occupiedNumbers = [...occupiedNumbers, ...stays.map(s => s.room_number)];
                if (!reservationsError && reservations) occupiedNumbers = [...occupiedNumbers, ...reservations.map(r => r.room_number)];
            }

            // 3. Filter rooms data (especially for Allada)
            const processedRooms = (roomsData || []).map(room => {
                if (room.site === 'Allada' && room.room_numbers) {
                    return {
                        ...room,
                        room_numbers: room.room_numbers.filter(num => !occupiedNumbers.includes(num))
                    };
                }
                return room;
            }).filter(room => room.site !== 'Allada' || !room.room_numbers || room.room_numbers.length > 0);

            if (processedRooms.length === 0 && (!roomsData || roomsData.length === 0)) {
                console.log('Using mock data for booking page');
                setRooms(MOCK_ROOMS);
            } else {
                setRooms(processedRooms);
            }
        } catch (err) {
            console.error('Error fetching rooms for booking, using mock data:', err);
            setRooms(MOCK_ROOMS);
        } finally {
            if (initialRoomId) {
                setBookingData(prev => {
                    // Try to find in filteredRooms (which is updated by an effect)
                    // But since filteredRooms is set in an effect depend on rooms, 
                    // we might need to calculate price here using processedRooms/rooms directly or just wait for next render.
                    // Given the existing code used filteredRooms, I will stick to a similar logic.
                    const price = calculateTotalPrice(initialRoomId, initialCheckIn, initialCheckOut);
                    return {
                        ...prev,
                        room_id: initialRoomId,
                        total_price: price || prev.total_price
                    };
                });
            }
            setLoading(false);
        }
    };

    const calculateTotalPrice = (roomId, inDate, outDate) => {
        if (!roomId || !inDate || !outDate) return 0;
        const room = filteredRooms.find(r => r.id === roomId);
        if (!room) return 0;

        const start = new Date(inDate);
        const end = new Date(outDate);
        const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

        const isRoomConf = room.name?.toLowerCase().includes('conférence') || room.name?.toLowerCase().includes('fête');

        if (isRoomConf) {
            const days = diffDays >= 0 ? diffDays + 1 : 0;
            return days * room.price_per_night;
        } else {
            const nights = diffDays > 0 ? diffDays : 0;
            return nights * room.price_per_night;
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const newData = { ...bookingData, [name]: value };

        if (name === 'room_id' || name === 'check_in' || name === 'check_out' || name === 'site') {
            const currentRoomId = name === 'room_id' ? value : bookingData.room_id;
            const currentCheckIn = name === 'check_in' ? value : bookingData.check_in;
            const currentCheckOut = name === 'check_out' ? value : bookingData.check_out;

            newData.total_price = calculateTotalPrice(currentRoomId, currentCheckIn, currentCheckOut);

            // Reset room_number if room_id changes
            if (name === 'room_id') {
                const selectedRoom = rooms.find(r => r.id === value);
                newData.room_number = (selectedRoom?.site === 'Allada' && selectedRoom?.room_numbers?.length > 0) ? selectedRoom.room_numbers[0] : '';
            }
        }
        setBookingData(newData);
    };

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const finalNotes = isConference
                ? `Type d'événement: ${bookingData.event_type} | Demandes spécifiques: ${bookingData.special_requests}`
                : '';

            const submitData = {
                site: bookingData.site,
                check_in: bookingData.check_in,
                check_out: bookingData.check_out,
                guests_count: bookingData.guests_count,
                customer_name: bookingData.customer_name,
                customer_email: bookingData.customer_email,
                customer_phone: bookingData.customer_phone,
                total_price: bookingData.total_price,
                notes: finalNotes,
                room_id: bookingData.room_id.replace('-ventillee', '').replace('-climee', ''),
                room_number: bookingData.room_number
            };
            const { error } = await supabase.from('reservations').insert([submitData]);
            if (error) throw error;
            setStep(4);
        } catch (err) {
            console.error('Submission error:', err);
            if (err.message === 'Failed to fetch') {
                alert('Erreur de connexion : Impossible de joindre le serveur. Cela peut être dû à un bloqueur de publicité ou à un problème de configuration (CORS) sur Supabase.');
            } else {
                alert('Erreur: ' + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleWhatsAppShare = () => {
        const room = rooms.find(r => r.id === bookingData.room_id);
        const sitePhone = bookingData.site === SITES.ABOMEY_CALAVI ? '2290166655757' : '2290167610909';

        const message = `Bonjour Sainte Élisabeth Hôtel,*
Je viens d'effectuer une réservation sur votre site web. Voici les détails :

*Site :* ${bookingData.site}
*Hébergement :* ${room?.name}
*Dates :* Du ${bookingData.check_in} au ${bookingData.check_out}
*Client :* ${bookingData.customer_name}
*Nombre de personnes :* ${bookingData.guests_count}
*Total :* ${formatPrice(bookingData.total_price)} FCFA

Merci de confirmer ma demande.`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${sitePhone}?text=${encodedMessage}`, '_blank');
    };

    if (loading && step !== 4) return <div className="container section">Chargement...</div>;

    return (
        <div className="booking-page">
            <section className="page-header narrow">
                <div className="container">
                    <h1>Réservation</h1>
                    <div className="steps-indicator">
                        <div className={`step-item ${step >= 1 ? 'active' : ''}`}>1. Sélection</div>
                        <div className="step-line"></div>
                        <div className={`step-item ${step >= 2 ? 'active' : ''}`}>2. Détails</div>
                        <div className="step-line"></div>
                        <div className={`step-item ${step >= 3 ? 'active' : ''}`}>3. Confirmation</div>
                    </div>
                </div>
            </section>

            <div className="container section">
                <div className="booking-layout">
                    <div className="booking-main">
                        {step === 1 && (
                            <div className="booking-step animate-up">
                                <h2>{isConference ? "Détails de l'événement" : "Sélectionnez votre séjour"}</h2>
                                <div className="booking-form-grid">
                                    <div className="form-group">
                                        <label>Choisir le site</label>
                                        <div className="select-wrapper">
                                            <MapPin size={18} className="icon" />
                                            <select name="site" value={bookingData.site} onChange={handleInputChange}>
                                                {Object.values(SITES).map(site => (
                                                    <option key={site} value={site}>{site}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Choisir une chambre</label>
                                        <div className="select-wrapper">
                                            <Home side={18} className="icon" />
                                            <select name="room_id" value={bookingData.room_id} onChange={handleInputChange}>
                                                <option value="">Sélectionnez une suite...</option>
                                                {filteredRooms.map(room => {
                                                    const isConfOption = room.name?.toLowerCase().includes('conférence') || room.name?.toLowerCase().includes('fête');
                                                    return (
                                                        <option key={room.id} value={room.id}>
                                                            {room.name} ({formatPrice(room.price_per_night)} FCFA/{isConfOption ? 'Jour' : 'nuit'})
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                    {bookingData.site === 'Allada' && bookingData.room_id && rooms.find(r => r.id === bookingData.room_id.replace('-ventillee', '').replace('-climee', ''))?.room_numbers && (
                                        <div className="form-group">
                                            <label>Numéro de chambre</label>
                                            <div className="select-wrapper">
                                                <Home side={18} className="icon" />
                                                <select name="room_number" value={bookingData.room_number} onChange={handleInputChange}>
                                                    {rooms.find(r => r.id === bookingData.room_id.replace('-ventillee', '').replace('-climee', '')).room_numbers.map(num => (
                                                        <option key={num} value={num}>Chambre {num}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                    <div className="form-group">
                                        <label>{isConference ? "Date de début" : "Date d'arrivée"}</label>
                                        <input type="date" name="check_in" value={bookingData.check_in} onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>{isConference ? "Date de fin" : "Date de départ"}</label>
                                        <input type="date" name="check_out" value={bookingData.check_out} onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>{isConference ? "Nombre de participants" : "Nombre de personnes"}</label>
                                        <select name="guests_count" value={bookingData.guests_count} onChange={handleInputChange}>
                                            {isConference ? (
                                                <>
                                                    <option value={10}>Jusqu'à 10 Personnes</option>
                                                    <option value={20}>Jusqu'à 20 Personnes</option>
                                                    <option value={50}>Jusqu'à 50 Personnes</option>
                                                    <option value={100}>Jusqu'à 100 Personnes</option>
                                                    <option value={150}>Plus de 100 Personnes</option>
                                                </>
                                            ) : (
                                                [1, 2].map(n => <option key={n} value={n}>{n} Personne{n > 1 ? 's' : ''}</option>)
                                            )}
                                        </select>
                                    </div>
                                </div>
                                <button
                                    className="btn-primary"
                                    disabled={!bookingData.room_id || !bookingData.check_in || !bookingData.check_out}
                                    onClick={handleNext}
                                >
                                    CONTINUER <ChevronRight size={18} />
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="booking-step animate-up">
                                <h2>Vos coordonnées</h2>
                                <div className="booking-form-grid">
                                    <div className="form-group">
                                        <label>Nom complet {isConference && "(ou nom de l'entreprise)"}</label>
                                        <input type="text" name="customer_name" value={bookingData.customer_name} onChange={handleInputChange} placeholder="Jean Dupont" />
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input type="email" name="customer_email" value={bookingData.customer_email} onChange={handleInputChange} placeholder="jean.dupont@email.com" />
                                    </div>
                                    <div className="form-group">
                                        <label>Téléphone</label>
                                        <input type="tel" name="customer_phone" value={bookingData.customer_phone} onChange={handleInputChange} placeholder="+229 00 00 00 00" />
                                    </div>
                                    {isConference && (
                                        <>
                                            <div className="form-group">
                                                <label>Type d'événement</label>
                                                <select name="event_type" value={bookingData.event_type} onChange={handleInputChange}>
                                                    <option value="">Sélectionnez...</option>
                                                    <option value="Reunion">Réunion / Séminaire</option>
                                                    <option value="Formation">Formation / Atelier</option>
                                                    <option value="Mariage">Mariage / Réception</option>
                                                    <option value="Autre">Autre événement</option>
                                                </select>
                                            </div>
                                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                                <label>Demandes spécifiques (Traiteur, vidéoprojecteur, etc.)</label>
                                                <textarea
                                                    name="special_requests"
                                                    value={bookingData.special_requests}
                                                    onChange={handleInputChange}
                                                    placeholder="Précisez vos besoins pour l'événement..."
                                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', minHeight: '80px' }}
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="btn-group">
                                    <button className="btn-outline" onClick={handleBack}>RETOUR</button>
                                    <button className="btn-primary" disabled={!bookingData.customer_name || !bookingData.customer_email} onClick={handleNext}>
                                        RÉCAPITULATIF <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="booking-step animate-up">
                                <h2>Confirmation</h2>
                                <div className="summary-box glass-box">
                                    <div className="summary-item">
                                        <span>Site</span>
                                        <strong>{bookingData.site}</strong>
                                    </div>
                                    <div className="summary-item">
                                        <span>{isConference ? "Espace" : "Hébergement"}</span>
                                        <strong>
                                            {rooms.find(r => r.id === bookingData.room_id.replace('-ventillee', '').replace('-climee', ''))?.name}
                                            {bookingData.room_number && ` (Chambre ${bookingData.room_number})`}
                                        </strong>
                                    </div>
                                    <div className="summary-item">
                                        <span>{isConference ? "Date de l'événement" : "Séjour"}</span>
                                        <strong>Du {bookingData.check_in} au {bookingData.check_out}</strong>
                                    </div>
                                    <div className="summary-item">
                                        <span>{isConference ? "Participants" : "Invités"}</span>
                                        <strong>{bookingData.guests_count} Personnes</strong>
                                    </div>
                                    {isConference && bookingData.event_type && (
                                        <div className="summary-item">
                                            <span>Type</span>
                                            <strong>{bookingData.event_type}</strong>
                                        </div>
                                    )}
                                    <div className="summary-total">
                                        <span>TOTAL À RÉGLER</span>
                                        <strong>{formatPrice(bookingData.total_price)} FCFA</strong>
                                    </div>
                                </div>
                                <div className="payment-notice">
                                    <CreditCard size={20} /> Paiement sécurisé à l'arrivée
                                </div>
                                <div className="btn-group">
                                    <button className="btn-outline" onClick={handleBack}>RETOUR</button>
                                    <button className="btn-primary" onClick={handleSubmit}>CONFIRMER LA RÉSERVATION</button>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="success-message glass-box animate-up">
                                <CheckCircle size={64} className="success-icon" />
                                <h2>Réservation Confirmée !</h2>
                                <p>Votre séjour a été enregistré avec succès. Un email de confirmation vous sera envoyé prochainement.</p>
                                <div className="btn-group-vertical" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '400px', margin: '0 auto' }}>
                                    <button
                                        className="btn-primary whatsapp-btn"
                                        onClick={handleWhatsAppShare}
                                        style={{ backgroundColor: '#25D366', borderColor: '#25D366', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                                    >
                                        <MessageCircle size={20} /> ENVOYER PAR WHATSAPP
                                    </button>
                                    <button className="btn-outline" onClick={() => navigate('/')}>RETOUR À L'ACCUEIL</button>
                                </div>
                            </div>
                        )}
                    </div>

                    <aside className="booking-sidebar">
                        <div className="help-box card">
                            <h4>Besoin d'aide ?</h4>
                            <p>Contactez notre service client 24h/24 ou par email.</p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Booking;
