import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { LayoutDashboard, Bed, CalendarCheck, Image as ImageIcon, Briefcase, MessageSquare, LogOut, Plus, Trash2, Edit, Sparkles, Cog, Utensils, Eye, Users, CheckCircle, Printer, Search, LayoutGrid, FileDown } from 'lucide-react';
import Login from './Login';
import RoomForm from './RoomForm';
import ServiceForm from './ServiceForm';
import OfferForm from './OfferForm';
import GalleryForm from './GalleryForm';
import SettingsForm from './SettingsForm';
import MenuForm from './MenuForm';
import ClientForm from './ClientForm';
import StayForm from './StayForm';
import RegistrationFormPrint from './RegistrationFormPrint';
import { formatPrice } from '../../lib/formatUtils';
import './Dashboard.css';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [activeTab, setActiveTab] = useState('');
    const [rooms, setRooms] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [services, setServices] = useState([]);
    const [menus, setMenus] = useState([]);
    const [offers, setOffers] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [clients, setClients] = useState([]);
    const [activeStays, setActiveStays] = useState([]);
    const [activeStaysWithClients, setActiveStaysWithClients] = useState([]);
    const [userSite, setUserSite] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showRoomForm, setShowRoomForm] = useState(false);
    const [showServiceForm, setShowServiceForm] = useState(false);
    const [showMenuForm, setShowMenuForm] = useState(false);
    const [showOfferForm, setShowOfferForm] = useState(false);
    const [showGalleryForm, setShowGalleryForm] = useState(false);
    const [showClientForm, setShowClientForm] = useState(false);
    const [showStayForm, setShowStayForm] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [editingService, setEditingService] = useState(null);
    const [editingMenu, setEditingMenu] = useState(null);
    const [editingOffer, setEditingOffer] = useState(null);
    const [editingGallery, setEditingGallery] = useState(null);
    const [editingClient, setEditingClient] = useState(null);
    const [managingStayFor, setManagingStayFor] = useState(null);
    const [viewingReservation, setViewingReservation] = useState(null);
    const [viewingClient, setViewingClient] = useState(null);
    const [clientStaysHistory, setClientStaysHistory] = useState([]);
    const [clientSearchTerm, setClientSearchTerm] = useState('');
    const [selectedStayForPrint, setSelectedStayForPrint] = useState(null);
    const [showHistoryPrint, setShowHistoryPrint] = useState(false);

    useEffect(() => {
        checkUser();
    }, []);

    useEffect(() => {
        if (user) {
            loadUserProfile(user.id);
        }
    }, [user]);

    const loadUserProfile = async (userId) => {
        const { role: userRole, site: siteName } = await fetchUserInfo(userId);
        setRole(userRole);
        setUserSite(siteName);

        // Default tab based on role
        if (userRole === 'reception') {
            setActiveTab('bookings');
        } else {
            setActiveTab('rooms');
        }
    };

    useEffect(() => {
        if (user && role) {
            if (activeTab === 'rooms' || activeTab === 'room-status') fetchRooms();
            if (activeTab === 'bookings' || activeTab === 'room-status') fetchReservations();
            if (activeTab === 'messages') fetchMessages();
            if (activeTab === 'services') fetchServices();
            if (activeTab === 'menus') fetchMenus();
            if (activeTab === 'offers') fetchOffers();
            if (activeTab === 'gallery') fetchGallery();
            if (activeTab === 'clients') {
                fetchClients();
                fetchActiveStays();
            }
            if (activeTab === 'room-status') {
                fetchActiveStays();
            }
        }
    }, [user, activeTab]);

    useEffect(() => {
        if (viewingClient) {
            fetchClientHistory(viewingClient.id);
        } else {
            setClientStaysHistory([]);
        }
    }, [viewingClient]);

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setUser(user);
        }
        setLoading(false);
    };

    const fetchUserInfo = async (userId) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('role, site')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching user info:', error);
            return { role: 'reception', site: null }; // Default to restricted if error
        }
        return data;
    };

    const fetchRooms = async () => {
        let query = supabase.from('rooms').select('*');
        if (userSite) {
            query = query.eq('site', userSite);
        }
        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) console.error('Fetch Rooms Error:', error);
        setRooms(data || []);
    };

    const fetchReservations = async () => {
        let query = supabase.from('reservations').select('*, rooms(name)');
        if (userSite) {
            query = query.eq('site', userSite);
        }
        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) console.error('Fetch Reservations Error:', error);
        setReservations(data || []);
    };

    const fetchMessages = async () => {
        const { data, error } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
        if (error) console.error('Fetch Messages Error:', error);
        setMessages(data || []);
    };

    const fetchServices = async () => {
        const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: false });
        if (error) console.error('Fetch Services Error:', error);
        setServices(data || []);
    };

    const fetchMenus = async () => {
        const { data, error } = await supabase.from('restaurant_menus').select('*').order('created_at', { ascending: false });
        if (error) console.error('Fetch Menus Error:', error);
        setMenus(data || []);
    };

    const fetchOffers = async () => {
        const { data, error } = await supabase.from('offers').select('*').order('created_at', { ascending: false });
        if (error) console.error('Fetch Offers Error:', error);
        setOffers(data || []);
    };

    const fetchGallery = async () => {
        const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
        if (error) console.error('Fetch Gallery Error:', error);
        setGallery(data || []);
    };

    const fetchClients = async () => {
        const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
        if (error) console.error('Fetch Clients Error:', error);
        setClients(data || []);
    };

    const fetchActiveStays = async () => {
        let query = supabase.from('stays')
            .select('client_id, room_id, room_number, status, check_in, check_out, registration_form_url, clients(first_name, last_name)')
            .eq('status', 'active');

        if (userSite) {
            query = query.eq('site', userSite);
        }
        const { data, error } = await query;
        if (error) console.error('Fetch Active Stays Error:', error);
        setActiveStays(data?.map(s => s.client_id) || []);
        setActiveStaysWithClients(data || []);
    };

    const fetchClientHistory = async (clientId) => {
        const { data, error } = await supabase
            .from('stays')
            .select('*, rooms(name), registration_form_url')
            .eq('client_id', clientId)
            .order('check_in', { ascending: false });
        if (error) console.error('Fetch Client History Error:', error);
        setClientStaysHistory(data || []);
    };

    const handleDeleteRoom = async (id) => {
        if (window.confirm('Voulez-vous vraiment supprimer cette chambre ?')) {
            const { error } = await supabase.from('rooms').delete().eq('id', id);
            if (!error) fetchRooms();
        }
    };

    const handleDeleteService = async (id) => {
        if (window.confirm('Voulez-vous vraiment supprimer ce service ?')) {
            const { error } = await supabase.from('services').delete().eq('id', id);
            if (!error) fetchServices();
        }
    };

    const handleDeleteMenu = async (id) => {
        if (window.confirm('Voulez-vous vraiment supprimer ce plat du menu ?')) {
            const { error } = await supabase.from('restaurant_menus').delete().eq('id', id);
            if (!error) fetchMenus();
        }
    };

    const handleDeleteOffer = async (id) => {
        if (window.confirm('Voulez-vous vraiment supprimer cette offre ?')) {
            const { error } = await supabase.from('offers').delete().eq('id', id);
            if (!error) fetchOffers();
        }
    };

    const handleDeleteGallery = async (id) => {
        if (window.confirm('Voulez-vous vraiment supprimer cette image ?')) {
            const { error } = await supabase.from('gallery').delete().eq('id', id);
            if (!error) fetchGallery();
        }
    };

    const handleDeleteClient = async (id) => {
        if (window.confirm('Voulez-vous vraiment supprimer ce client ?')) {
            const { error } = await supabase.from('clients').delete().eq('id', id);
            if (!error) fetchClients();
        }
    };

    const handleMarkAsRead = async (id) => {
        await supabase.from('contacts').update({ is_read: true }).eq('id', id);
        fetchMessages();
    };

    const handleUpdateStatus = async (id, status) => {
        const res = reservations.find(r => r.id === id);
        const { error } = await supabase.from('reservations').update({ status }).eq('id', id);
        
        if (!error && res && res.site !== 'Allada' && res.room_id) {
            // If confirmed, block the room. If cancelled, free it.
            const shouldBeAvailable = status === 'cancelled';
            if (status === 'confirmed' || status === 'cancelled') {
                await supabase.from('rooms').update({ is_available: shouldBeAvailable }).eq('id', res.room_id);
            }
        }
        
        fetchReservations();
        if (activeTab === 'rooms') fetchRooms();
    };

    const handleDeleteReservation = async (id) => {
        const res = reservations.find(r => r.id === id);
        if (window.confirm('Voulez-vous vraiment supprimer cette réservation ?')) {
            const { error } = await supabase.from('reservations').delete().eq('id', id);
            if (error) {
                console.error('Delete Reservation Error:', error);
                alert('Erreur lors de la suppression de la réservation.');
            } else {
                // If it was blocking a room, free it (except Allada which uses manual room numbers)
                if (res && res.site !== 'Allada' && res.room_id && res.status !== 'cancelled') {
                    await supabase.from('rooms').update({ is_available: true }).eq('id', res.room_id);
                }
                fetchReservations();
                if (activeTab === 'rooms') fetchRooms();
            }
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setRole(null);
        setUserSite(null);
        setActiveTab('');
    };

    if (loading) return <div className="admin-loading">Chargement...</div>;

    if (!user) return <Login onLogin={setUser} />;

    return (
        <div className="dashboard-container">
            {showRoomForm && (
                <RoomForm
                    room={editingRoom}
                    onSave={() => { setShowRoomForm(false); setEditingRoom(null); fetchRooms(); }}
                    onCancel={() => { setShowRoomForm(false); setEditingRoom(null); }}
                />
            )}
            {showServiceForm && (
                <ServiceForm
                    service={editingService}
                    onSave={() => { setShowServiceForm(false); setEditingService(null); fetchServices(); }}
                    onCancel={() => { setShowServiceForm(false); setEditingService(null); }}
                />
            )}
            {showMenuForm && (
                <MenuForm
                    item={editingMenu}
                    onSave={() => { setShowMenuForm(false); setEditingMenu(null); fetchMenus(); }}
                    onCancel={() => { setShowMenuForm(false); setEditingMenu(null); }}
                />
            )}
            {showOfferForm && (
                <OfferForm
                    offer={editingOffer}
                    onSave={() => { setShowOfferForm(false); setEditingOffer(null); fetchOffers(); }}
                    onCancel={() => { setShowOfferForm(false); setEditingOffer(null); }}
                />
            )}
            {showGalleryForm && (
                <GalleryForm
                    item={editingGallery}
                    onSave={() => { setShowGalleryForm(false); setEditingGallery(null); fetchGallery(); }}
                    onCancel={() => { setShowGalleryForm(false); setEditingGallery(null); }}
                />
            )}
            {showClientForm && (
                <ClientForm
                    client={editingClient}
                    onSave={() => { setShowClientForm(false); setEditingClient(null); fetchClients(); }}
                    onCancel={() => { setShowClientForm(false); setEditingClient(null); }}
                />
            )}
            {showStayForm && (
                <StayForm
                    client={managingStayFor}
                    userSite={userSite}
                    onSave={() => {
                        setShowStayForm(false);
                        setManagingStayFor(null);
                        fetchClients();
                        fetchActiveStays();
                        fetchRooms();
                        fetchReservations();
                    }}
                    onCancel={() => { setShowStayForm(false); setManagingStayFor(null); }}
                />
            )}

            {viewingReservation && (
                <div className="modal-overlay">
                    <div className="modal-card card" style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <h3>Détails de la Réservation</h3>
                            <button className="delete-btn" onClick={() => setViewingReservation(null)}>✖</button>
                        </div>
                        <div className="admin-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="form-group">
                                <strong>Client :</strong> {viewingReservation.customer_name}
                            </div>
                            <div className="form-group">
                                <strong>Email :</strong> {viewingReservation.customer_email || 'Non renseigné'}
                            </div>
                            <div className="form-group">
                                <strong>Téléphone :</strong> {viewingReservation.customer_phone}
                            </div>
                            <div className="form-group">
                                <strong>Chambre :</strong> {viewingReservation.rooms?.name} {viewingReservation.room_number ? `(N° ${viewingReservation.room_number})` : ''}
                            </div>
                            <div className="form-group">
                                <strong>Site :</strong> {viewingReservation.site}
                            </div>
                            <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <strong>Arrivée :</strong> {new Date(viewingReservation.check_in).toLocaleDateString()}
                                </div>
                                <div>
                                    <strong>Départ :</strong> {new Date(viewingReservation.check_out).toLocaleDateString()}
                                </div>
                            </div>
                            <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <strong>Nombre de personnes :</strong> {viewingReservation.guests_count}
                                </div>
                                <div>
                                    <strong>Montant total :</strong> {viewingReservation.total_price ? `${formatPrice(viewingReservation.total_price)} FCFA` : 'Non défini'}
                                </div>
                            </div>
                            <div className="form-group">
                                <strong>Notes spéciales :</strong>
                                <p style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>
                                    {viewingReservation.notes || 'Aucune note'}
                                </p>
                            </div>
                            <div className="form-group">
                                <strong>Statut :</strong> <span className={`status ${viewingReservation.status}`}>{viewingReservation.status}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {viewingClient && (
                <div className="modal-overlay">
                    <div className="modal-card card" style={{ maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div className="modal-header" style={{ position: 'sticky', top: 0, backgroundColor: 'white', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                            <h3>Détails du Client: {viewingClient.unique_client_id}</h3>
                            <button className="delete-btn" onClick={() => setViewingClient(null)}>✖</button>
                        </div>
                        <div className="admin-form" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9fafb', padding: '15px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                                <div>
                                    <span style={{ display: 'block', fontSize: '0.9em', color: '#6b7280' }}>Points de Fidélité</span>
                                    <strong style={{ fontSize: '1.5em', color: 'var(--color-primary)' }}>{viewingClient.loyalty_points} pts</strong>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ display: 'block', fontSize: '0.9em', color: '#6b7280' }}>Date d'inscription</span>
                                    <strong>{new Date(viewingClient.created_at).toLocaleDateString()}</strong>
                                </div>
                            </div>

                            <div>
                                <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '5px', color: '#374151' }}>Informations Personnelles</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                                    <div><strong>Nom :</strong> {viewingClient.last_name}</div>
                                    <div><strong>Prénom(s) :</strong> {viewingClient.first_name}</div>
                                    <div><strong>Nom de jeune fille :</strong> {viewingClient.maiden_name || '-'}</div>
                                    <div><strong>Date de naissance :</strong> {viewingClient.birth_date ? new Date(viewingClient.birth_date).toLocaleDateString() : '-'}</div>
                                    <div><strong>Lieu de naissance :</strong> {viewingClient.birth_place || '-'}</div>
                                    <div><strong>Département :</strong> {viewingClient.department || '-'}</div>
                                    <div><strong>Pays :</strong> {viewingClient.country || '-'}</div>
                                    <div><strong>Nationalité :</strong> {viewingClient.nationality || '-'}</div>
                                    <div><strong>Profession :</strong> {viewingClient.profession || '-'}</div>
                                    <div><strong>Site d'inscription :</strong> {viewingClient.site || '-'}</div>
                                </div>
                            </div>

                            <div>
                                <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '5px', color: '#374151' }}>Contact & Domicile</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                                    <div><strong>Email :</strong> {viewingClient.email || '-'}</div>
                                    <div><strong>Téléphone :</strong> {viewingClient.phone || '-'}</div>
                                    <div style={{ gridColumn: '1 / -1' }}><strong>Domicile habituel :</strong> {viewingClient.usual_residence || '-'}</div>
                                </div>
                            </div>

                            <div>
                                <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '5px', color: '#374151' }}>Pièce d'Identité</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                                    <div><strong>Type :</strong> {viewingClient.id_type || '-'}</div>
                                    <div><strong>Numéro :</strong> {viewingClient.id_number || '-'}</div>
                                    <div><strong>Délivrée le :</strong> {viewingClient.id_issue_date ? new Date(viewingClient.id_issue_date).toLocaleDateString() : '-'}</div>
                                    <div><strong>Expire le :</strong> {viewingClient.id_expiry_date ? new Date(viewingClient.id_expiry_date).toLocaleDateString() : '-'}</div>
                                    <div style={{ gridColumn: '1 / -1' }}><strong>Lieu de délivrance :</strong> {viewingClient.id_issue_place || '-'}</div>
                                </div>
                            </div>

                            <div>
                                <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '5px', color: '#374151' }}>Historique des Séjours</h4>
                                <div style={{ marginTop: '10px' }}>
                                    {clientStaysHistory.length > 0 ? (
                                        <table className="admin-table" style={{ fontSize: '0.9em' }}>
                                            <thead>
                                                <tr>
                                                    <th>Période</th>
                                                    <th>Site</th>
                                                    <th>Chambre</th>
                                                    <th>FICHE</th>
                                                    <th>Statut</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {clientStaysHistory.map(stay => (
                                                    <tr key={stay.id}>
                                                        <td>
                                                            {new Date(stay.check_in).toLocaleDateString()} au {new Date(stay.check_out).toLocaleDateString()}
                                                        </td>
                                                        <td>{stay.site}</td>
                                                        <td>{stay.rooms?.name || '-'} {stay.room_number ? `(N° ${stay.room_number})` : ''}</td>
                                                        <td>
                                                            {stay.registration_form_url ? (
                                                                <a
                                                                    href={stay.registration_form_url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="status confirmed"
                                                                    style={{ textDecoration: 'none', fontSize: '0.75rem', fontWeight: 'bold' }}
                                                                >
                                                                    PDF
                                                                </a>
                                                            ) : (
                                                                <span style={{ opacity: 0.3 }}>-</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <span className={`status ${stay.status === 'completed' ? 'confirmed' : stay.status}`}>
                                                                {stay.status === 'completed' ? 'Terminé' : stay.status === 'active' ? 'En cours' : stay.status}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                                <button
                                                                    className="edit-btn"
                                                                    title="Voir les détails / Imprimer"
                                                                    onClick={() => { setSelectedStayForPrint(stay); setShowHistoryPrint(true); }}
                                                                >
                                                                    <Eye size={16} />
                                                                </button>
                                                                <button
                                                                    className="edit-btn"
                                                                    title="Imprimer directement"
                                                                    onClick={() => { setSelectedStayForPrint(stay); setShowHistoryPrint(true); }}
                                                                >
                                                                    <Printer size={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p style={{ color: '#6b7280', fontStyle: 'italic' }}>Aucun séjour enregistré pour ce client.</p>
                                    )}
                                </div>
                            </div>

                            {showHistoryPrint && selectedStayForPrint && (
                                <RegistrationFormPrint
                                    client={viewingClient}
                                    stay={selectedStayForPrint}
                                    onClose={() => { setShowHistoryPrint(false); setSelectedStayForPrint(null); }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}

            <aside className="sidebar">
                <div className="sidebar-header">
                    <h3>CMS ADMIN</h3>
                    <span>{user.email}</span>
                </div>

                <nav className="sidebar-nav">
                    {role === 'admin' && (
                        <button className={activeTab === 'rooms' ? 'active' : ''} onClick={() => setActiveTab('rooms')}>
                            <Bed size={20} /> <span>Gestion des Chambres</span>
                        </button>
                    )}
                    <button className={activeTab === 'bookings' ? 'active' : ''} onClick={() => setActiveTab('bookings')}>
                        <CalendarCheck size={20} /> <span>Réservations</span>
                    </button>
                    <button className={activeTab === 'clients' ? 'active' : ''} onClick={() => setActiveTab('clients')}>
                        <Users size={20} /> <span>Clients & Fidélité</span>
                    </button>
                    {role === 'admin' && (
                        <>
                            <button className={activeTab === 'room-status' ? 'active' : ''} onClick={() => setActiveTab('room-status')}>
                                <LayoutGrid size={20} /> <span>État des Chambres</span>
                            </button>
                            <button className={activeTab === 'services' ? 'active' : ''} onClick={() => setActiveTab('services')}>
                                <Briefcase size={20} /> <span>Services</span>
                            </button>
                            <button className={activeTab === 'menus' ? 'active' : ''} onClick={() => setActiveTab('menus')}>
                                <Utensils size={20} /> <span>Restaurant</span>
                            </button>
                            <button className={activeTab === 'offers' ? 'active' : ''} onClick={() => setActiveTab('offers')}>
                                <Sparkles size={20} /> <span>Offres Spéciales</span>
                            </button>
                            <button className={activeTab === 'gallery' ? 'active' : ''} onClick={() => setActiveTab('gallery')}>
                                <ImageIcon size={20} /> <span>Galerie Photos</span>
                            </button>
                            <button className={activeTab === 'messages' ? 'active' : ''} onClick={() => setActiveTab('messages')}>
                                <MessageSquare size={20} /> <span>Messages Contact</span>
                            </button>
                            <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
                                <Cog size={20} /> <span>Configuration Site</span>
                            </button>
                        </>
                    )}
                </nav>

                <button className="logout-btn" onClick={handleLogout}>
                    <LogOut size={20} /> Déconnexion {role === 'reception' && <span style={{ fontSize: '0.7em', marginLeft: 'auto', opacity: 0.6 }}>(Réception)</span>}
                </button>
            </aside>

            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('rooms', 'Chambres').replace('bookings', 'Réservations').replace('messages', 'Messages').replace('services', 'Services').replace('gallery', 'Galerie').replace('settings', 'Configuration').replace('clients', 'Clients & Fidélité').replace('room-status', 'État des Chambres')}</h2>
                        <button className="logout-btn-header" onClick={handleLogout} title="Se déconnecter" style={{ border: 'none', background: 'none', color: '#ff4d4d', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
                            <LogOut size={18} /> <span>Déconnexion</span>
                        </button>
                    </div>
                    {activeTab === 'rooms' && role === 'admin' && (
                        <button className="btn-primary btn-add" onClick={() => setShowRoomForm(true)}>
                            <Plus size={18} /> Ajouter une chambre
                        </button>
                    )}
                    {activeTab === 'services' && role === 'admin' && (
                        <button className="btn-primary btn-add" onClick={() => setShowServiceForm(true)}>
                            <Plus size={18} /> Ajouter un service
                        </button>
                    )}
                    {activeTab === 'menus' && role === 'admin' && (
                        <button className="btn-primary btn-add" onClick={() => setShowMenuForm(true)}>
                            <Plus size={18} /> Ajouter un plat
                        </button>
                    )}
                    {activeTab === 'offers' && role === 'admin' && (
                        <button className="btn-primary btn-add" onClick={() => setShowOfferForm(true)}>
                            <Plus size={18} /> Ajouter une offre
                        </button>
                    )}
                    {activeTab === 'gallery' && role === 'admin' && (
                        <button className="btn-primary btn-add" onClick={() => setShowGalleryForm(true)}>
                            <Plus size={18} /> Ajouter à la galerie
                        </button>
                    )}
                    {activeTab === 'clients' && (
                        <button className="btn-primary btn-add" onClick={() => setShowClientForm(true)}>
                            <Plus size={18} /> Inscrire un client
                        </button>
                    )}
                </header>

                <section className="dashboard-content">
                    {activeTab === 'rooms' && (
                        <div className="admin-table-wrapper card">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Nom</th>
                                        <th>Site</th>
                                        <th>Prix</th>
                                        <th>Capacité</th>
                                        {role === 'admin' && <th>Actions</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {rooms.map(room => (
                                        <tr key={room.id}>
                                            <td>
                                                <img
                                                    src={room.image || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=100&q=80'}
                                                    alt=""
                                                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                                                />
                                            </td>
                                            <td>{room.name}</td>
                                            <td>{room.site}</td>
                                            <td>
                                                {room.prices ? (
                                                    <div style={{ fontSize: '0.8rem' }}>
                                                        {room.prices.ventillee && <div>V: {formatPrice(room.prices.ventillee)}</div>}
                                                        {room.prices.climee && <div>C: {formatPrice(room.prices.climee)}</div>}
                                                    </div>
                                                ) : (
                                                    `${formatPrice(room.price_per_night)} FCFA`
                                                )}
                                            </td>
                                            <td>{room.capacity} pers.</td>
                                            {role === 'admin' && (
                                                <td className="actions">
                                                    <button className="edit-btn" onClick={() => { setEditingRoom(room); setShowRoomForm(true); }}><Edit size={16} /></button> {/* Updated edit button */}
                                                    <button className="delete-btn" onClick={() => handleDeleteRoom(room.id)}><Trash2 size={16} /></button> {/* Updated delete button */}
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                    {rooms.length === 0 && <tr><td colSpan="5" className="empty-state">Aucune chambre trouvée.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'bookings' && (
                        <div className="admin-table-wrapper card">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Client</th>
                                        <th>Catégorie</th>
                                        <th>N° Chambre</th>
                                        <th>Arrivée</th>
                                        <th>Départ</th>
                                        <th>Statut</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reservations.map(res => (
                                        <tr key={res.id}>
                                            <td>{res.customer_name}</td>
                                            <td>{res.rooms?.name}</td>
                                            <td>{res.room_number || '-'}</td>
                                            <td>{res.check_in}</td>
                                            <td>{res.check_out}</td>
                                            <td><span className={`status ${res.status}`}>{res.status}</span></td>
                                            <td className="actions">
                                                <button className="edit-btn" title="Voir les détails" onClick={() => setViewingReservation(res)}><Eye size={16} /></button>
                                                <button className="delete-btn" title="Supprimer" onClick={() => handleDeleteReservation(res.id)}><Trash2 size={16} /></button>
                                                <select
                                                    className="status-select"
                                                    value={res.status}
                                                    onChange={(e) => handleUpdateStatus(res.id, e.target.value)}
                                                >
                                                    <option value="pending">En attente</option>
                                                    <option value="confirmed">Confirmé</option>
                                                    <option value="cancelled">Annulé</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                    {reservations.length === 0 && <tr><td colSpan="6" className="empty-state">Aucune réservation.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'clients' && (
                        <div className="admin-table-wrapper card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <div className="search-container" style={{ position: 'relative', width: '300px' }}>
                                    <input
                                        type="text"
                                        placeholder="Rechercher par nom, téléphone ou ID..."
                                        value={clientSearchTerm}
                                        onChange={(e) => setClientSearchTerm(e.target.value)}
                                        style={{ width: '100%', padding: '8px 12px', paddingLeft: '35px', borderRadius: '6px', border: '1px solid #ddd' }}
                                    />
                                    <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                                </div>
                            </div>
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>ID Unique</th>
                                        <th>Nom Complet</th>
                                        <th>Contact (Email / Tél)</th>
                                        <th>Points de Fidélité</th>
                                        <th>Inscrit le</th>
                                        <th>Site</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clients
                                        .filter(c =>
                                            (c.first_name && c.first_name.toLowerCase().includes(clientSearchTerm.toLowerCase())) ||
                                            (c.last_name && c.last_name.toLowerCase().includes(clientSearchTerm.toLowerCase())) ||
                                            (c.phone && c.phone.includes(clientSearchTerm)) ||
                                            (c.unique_client_id && c.unique_client_id.toLowerCase().includes(clientSearchTerm.toLowerCase()))
                                        )
                                        .map(client => (
                                            <tr key={client.id}>
                                                <td><strong>{client.unique_client_id}</strong></td>
                                                <td>{client.first_name} {client.last_name}</td>
                                                <td>
                                                    <div style={{ fontSize: '0.8rem' }}>
                                                        {client.email && <div>{client.email}</div>}
                                                        {client.phone && <div>{client.phone}</div>}
                                                    </div>
                                                </td>
                                                <td><span className="status confirmed">{client.loyalty_points} pts</span></td>
                                                <td>{new Date(client.created_at).toLocaleDateString()}</td>
                                                <td><span className="status" style={{ backgroundColor: '#f3f4f6', color: '#374151', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{client.site === 'Abomey-Calavi' ? 'ABC' : client.site === 'Allada' ? 'ALD' : '-'}</span></td>
                                                <td className="actions" style={{ display: 'flex', gap: '5px' }}>
                                                    {activeStays.includes(client.id) ? (
                                                        <>
                                                            {(() => {
                                                                const activeStay = activeStaysWithClients.find(s => s.client_id === client.id);
                                                                return activeStay?.registration_form_url && (
                                                                    <a
                                                                        href={activeStay.registration_form_url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="edit-btn"
                                                                        title="Voir la fiche PDF"
                                                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                                    >
                                                                        <FileDown size={16} />
                                                                    </a>
                                                                );
                                                            })()}
                                                            <button className="btn-primary" style={{ padding: '4px 8px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#10b981' }} onClick={() => { setManagingStayFor(client); setShowStayForm(true); }}>
                                                                <CheckCircle size={14} /> Clôturer
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => { setManagingStayFor(client); setShowStayForm(true); }}>
                                                            <Bed size={14} /> Séjour
                                                        </button>
                                                    )}
                                                    <button className="edit-btn" title="Voir les détails" onClick={() => setViewingClient(client)}><Eye size={16} /></button>
                                                    <button className="edit-btn" title="Modifier" onClick={() => { setEditingClient(client); setShowClientForm(true); }}><Edit size={16} /></button>
                                                    <button className="delete-btn" title="Supprimer" onClick={() => handleDeleteClient(client.id)}><Trash2 size={16} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    {clients.length === 0 && <tr><td colSpan="6" className="empty-state">Aucun client enregistré.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'messages' && (
                        <div className="admin-table-wrapper card">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Nom</th>
                                        <th>Email</th>
                                        <th>Sujet</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {messages.map(msg => (
                                        <tr key={msg.id} style={{ opacity: msg.is_read ? 0.6 : 1 }}>
                                            <td>{msg.name}</td>
                                            <td>{msg.email}</td>
                                            <td>{msg.subject}</td>
                                            <td>{new Date(msg.created_at).toLocaleDateString()}</td>
                                            <td className="actions">
                                                {!msg.is_read && <button className="edit-btn" onClick={() => handleMarkAsRead(msg.id)} title="Marquer comme lu">✓</button>}
                                            </td>
                                        </tr>
                                    ))}
                                    {messages.length === 0 && <tr><td colSpan="5" className="empty-state">Aucun message.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'services' && (
                        <div className="admin-table-wrapper card">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Icône</th>
                                        <th>Nom</th>
                                        <th>Description</th>
                                        <th>Statut</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {services.map(service => (
                                        <tr key={service.id}>
                                            <td>{service.icon}</td>
                                            <td>{service.name}</td>
                                            <td>{service.description?.substring(0, 50)}...</td>
                                            <td>{service.is_active ? 'Actif' : 'Inactif'}</td>
                                            <td className="actions">
                                                <button className="edit-btn" onClick={() => { setEditingService(service); setShowServiceForm(true); }}><Edit size={16} /></button>
                                                <button className="delete-btn" onClick={() => handleDeleteService(service.id)}><Trash2 size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                    {services.length === 0 && <tr><td colSpan="5" className="empty-state">Aucun service trouvé.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'menus' && (
                        <div className="admin-table-wrapper card">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Nom</th>
                                        <th>Catégorie</th>
                                        <th>Prix</th>
                                        <th>Statut</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {menus.map(menu => (
                                        <tr key={menu.id}>
                                            <td>{menu.name}</td>
                                            <td>{menu.category}</td>
                                            <td>{menu.price}</td>
                                            <td>{menu.is_active ? 'Disponible' : 'Indisponible'}</td>
                                            <td className="actions">
                                                <button className="edit-btn" onClick={() => { setEditingMenu(menu); setShowMenuForm(true); }}><Edit size={16} /></button>
                                                <button className="delete-btn" onClick={() => handleDeleteMenu(menu.id)}><Trash2 size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                    {menus.length === 0 && <tr><td colSpan="5" className="empty-state">Aucun plat au menu.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'offers' && (
                        <div className="admin-table-wrapper card">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Titre</th>
                                        <th>Remise</th>
                                        <th>Validité</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {offers.map(offer => (
                                        <tr key={offer.id}>
                                            <td>{offer.title}</td>
                                            <td>{offer.discount_percentage}%</td>
                                            <td>{offer.valid_until}</td>
                                            <td className="actions">
                                                <button className="edit-btn" onClick={() => { setEditingOffer(offer); setShowOfferForm(true); }}><Edit size={16} /></button>
                                                <button className="delete-btn" onClick={() => handleDeleteOffer(offer.id)}><Trash2 size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                    {offers.length === 0 && <tr><td colSpan="4" className="empty-state">Aucune offre trouvée.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'room-status' && role === 'admin' && (
                        <div className="room-status-container">
                            {['Abomey-Calavi', 'Allada'].map(site => {
                                const siteRooms = rooms.filter(r => r.site === site).sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
                                if (siteRooms.length === 0) return null;

                                const stats = {
                                    total: siteRooms.length,
                                    libre: siteRooms.filter(r => r.is_available && !activeStaysWithClients.some(s => s.room_id === r.id) && !reservations.some(res => res.room_id === r.id && res.status === 'confirmed')).length,
                                    occupe: siteRooms.filter(r => activeStaysWithClients.some(s => s.room_id === r.id)).length,
                                    reserve: siteRooms.filter(r => reservations.some(res => res.room_id === r.id && res.status === 'confirmed') && !activeStaysWithClients.some(s => s.room_id === r.id)).length,
                                };

                                return (
                                    <div key={site} className="site-section">
                                        <h3><Bed size={24} /> {site}</h3>
                                        <div className="status-stats-bar">
                                            <div className="stat-item total">Total: {stats.total}</div>
                                            <div className="stat-item libre">Libre: {stats.libre}</div>
                                            <div className="stat-item occupe">Occupé: {stats.occupe}</div>
                                            <div className="stat-item reserve">Réservé: {stats.reserve}</div>
                                        </div>
                                        <div className="room-status-grid">
                                            {siteRooms.flatMap(room => {
                                                if (site === 'Allada' && room.room_numbers?.length > 0) {
                                                    return room.room_numbers.map(roomNum => {
                                                        const stay = activeStaysWithClients.find(s => s.room_id === room.id && s.room_number === roomNum);
                                                        const reservation = reservations.find(res => res.room_id === room.id && res.room_number === roomNum && res.status === 'confirmed');

                                                        let status = 'libre';
                                                        let guest = '';
                                                        let dates = '';

                                                        if (stay) {
                                                            status = 'occupe';
                                                            guest = `${stay.clients?.first_name} ${stay.clients?.last_name}`;
                                                            dates = `${new Date(stay.check_in).toLocaleDateString()} - ${new Date(stay.check_out).toLocaleDateString()}`;
                                                        } else if (reservation) {
                                                            status = 'reserve';
                                                            guest = reservation.customer_name;
                                                            dates = `${new Date(reservation.check_in).toLocaleDateString()} - ${new Date(reservation.check_out).toLocaleDateString()}`;
                                                        } else if (!room.is_available) {
                                                            status = 'maintenance';
                                                        }

                                                        return (
                                                            <div key={`${room.id}-${roomNum}`} className={`room-status-card ${status}`}>
                                                                <div className="room-card-header">
                                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                        <span className="room-number">{roomNum}</span>
                                                                        <span style={{ fontSize: '0.6rem', opacity: 0.6 }}>{room.name}</span>
                                                                    </div>
                                                                    <span className="status-badge">{status}</span>
                                                                </div>
                                                                <div className="room-card-content">
                                                                    {guest ? (
                                                                        <>
                                                                            <span className="guest-name" title={guest}>{guest}</span>
                                                                            <div style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '4px' }}>
                                                                                {dates}
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <span style={{ opacity: 0.5, fontSize: '0.75rem' }}>Aucun occupant</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    });
                                                }

                                                // Default behavior for other sites or rooms without numbers
                                                const stay = activeStaysWithClients.find(s => s.room_id === room.id);
                                                const reservation = reservations.find(res => res.room_id === room.id && res.status === 'confirmed');

                                                let status = 'libre';
                                                let guest = '';
                                                let dates = '';

                                                if (stay) {
                                                    status = 'occupe';
                                                    guest = `${stay.clients?.first_name} ${stay.clients?.last_name}`;
                                                    dates = `${new Date(stay.check_in).toLocaleDateString()} - ${new Date(stay.check_out).toLocaleDateString()}`;
                                                } else if (reservation) {
                                                    status = 'reserve';
                                                    guest = reservation.customer_name;
                                                    dates = `${new Date(reservation.check_in).toLocaleDateString()} - ${new Date(reservation.check_out).toLocaleDateString()}`;
                                                } else if (!room.is_available) {
                                                    status = 'maintenance';
                                                }

                                                return (
                                                    <div key={room.id} className={`room-status-card ${status}`}>
                                                        <div className="room-card-header">
                                                            <span className="room-number">{room.name}</span>
                                                            <span className="status-badge">{status}</span>
                                                        </div>
                                                        <div className="room-card-content">
                                                            {guest ? (
                                                                <>
                                                                    <span className="guest-name" title={guest}>{guest}</span>
                                                                    <div style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '4px' }}>
                                                                        {dates}
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <span style={{ opacity: 0.5, fontSize: '0.75rem' }}>Aucun occupant</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {activeTab === 'gallery' && (
                        <div className="admin-table-wrapper card">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Titre</th>
                                        <th>Catégorie</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {gallery.map(item => (
                                        <tr key={item.id}>
                                            <td><img src={item.image_url} alt="" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} /></td>
                                            <td>{item.title || '-'}</td>
                                            <td>{item.category}</td>
                                            <td className="actions">
                                                <button className="edit-btn" onClick={() => { setEditingGallery(item); setShowGalleryForm(true); }}><Edit size={16} /></button>
                                                <button className="delete-btn" onClick={() => handleDeleteGallery(item.id)}><Trash2 size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                    {gallery.length === 0 && <tr><td colSpan="4" className="empty-state">Aucune image dans la galerie.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <SettingsForm />
                    )}
                </section>
            </main>
        </div>
    );
};

export default Dashboard;
