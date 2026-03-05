import React from 'react';
import { X, Printer } from 'lucide-react';

const RegistrationFormPrint = ({ client, stay, onClose }) => {
    if (!client || !stay) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="registration-print-overlay no-print-bg" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            zIndex: 9999,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px',
            backdropFilter: 'blur(5px)'
        }}>
            {/* Preview Controls - Hidden during print */}
            <div className="no-print" style={{
                width: '100%',
                maxWidth: '800px',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '15px',
                marginBottom: '15px',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <button
                    onClick={handlePrint}
                    style={{
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontWeight: '600',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                    }}
                >
                    <Printer size={18} /> Lancer l'impression
                </button>
                <button
                    onClick={onClose}
                    style={{
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontWeight: '600',
                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                    }}
                >
                    <X size={18} /> Fermer
                </button>
            </div>

            {/* The Actual Form Paper - Optimized for A4 */}
            <div className="registration-print-container" style={{
                width: '100%',
                maxWidth: '800px',
                backgroundColor: '#fff',
                padding: '30px 45px',
                color: '#000',
                fontFamily: 'serif',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                minHeight: '290mm',
                position: 'relative',
                borderRadius: '2px',
                boxSizing: 'border-box'
            }}>
                {/* Header with Logo and Title */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #000', paddingBottom: '10px', marginBottom: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <img src="/Images/LOGO SANS FOND.png" alt="Logo SDF" style={{ height: '65px', width: 'auto' }} />
                        <div>
                            <h1 style={{ margin: 0, fontSize: '18px', textTransform: 'uppercase', letterSpacing: '1px' }}>Sainte Élisabeth Hôtel</h1>
                            <p style={{ margin: '2px 0 0 0', fontSize: '11px', fontWeight: 'bold' }}>{stay.site} - Bénin</p>
                            <p style={{ margin: '2px 0 0 0', fontSize: '9px', color: '#333' }}>
                                RCCM RB/ABC/25 B 9135 | IFU: 3202570633445
                            </p>
                            <p style={{ margin: '1px 0 0 0', fontSize: '9px', color: '#333' }}>
                                Tél: 00229 01 95 43 92 33
                            </p>
                        </div>
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                    <h2 style={{ margin: 0, fontSize: '16px', textTransform: 'uppercase', borderBottom: '1px solid #000', display: 'inline-block', paddingBottom: '2px' }}>
                        Fiche d'Enregistrement
                    </h2>
                    <p style={{ margin: '5px 0 0 0', fontSize: '11px' }}>N° Client: <strong>{client.unique_client_id}</strong></p>
                </div>

                {/* HIGHLIGHT: Chambre Affectée (Request: Chambre affecté reste au dessus des informations avant Identité) */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <div style={{ border: '2px solid #000', padding: '8px 40px', borderRadius: '4px', textAlign: 'center', backgroundColor: '#f0f0f0' }}>
                        <span style={{ fontSize: '13px', textTransform: 'uppercase', fontWeight: 'bold' }}>Chambre Affectée : </span>
                        <span style={{ fontSize: '18px', fontWeight: '900' }}>{stay.rooms?.name || 'Non spécifiée'}</span>
                    </div>
                </div>

                {/* Section 1: Identité du Client */}
                <div style={{ marginBottom: '15px' }}>
                    <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '2px', marginBottom: '8px', fontSize: '13px', textTransform: 'uppercase', backgroundColor: '#f9f9f9', paddingLeft: '5px' }}>
                        1. Identité du Client
                    </h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                        <tbody>
                            <tr>
                                <td style={{ padding: '4px 0', width: '25%' }}><strong>Nom :</strong></td>
                                <td style={{ padding: '4px 0', width: '25%' }}>{client.last_name}</td>
                                <td style={{ padding: '4px 0', width: '25%' }}><strong>Prénoms :</strong></td>
                                <td style={{ padding: '4px 0', width: '25%' }}>{client.first_name}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '4px 0' }}><strong>Nom de jeune fille :</strong></td>
                                <td style={{ padding: '4px 0' }}>{client.maiden_name || '-'}</td>
                                <td style={{ padding: '4px 0' }}><strong>Nationalité :</strong></td>
                                <td style={{ padding: '4px 0' }}>{client.nationality || '-'}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '4px 0' }}><strong>Né(e) le :</strong></td>
                                <td style={{ padding: '4px 0' }}>{client.birth_date ? new Date(client.birth_date).toLocaleDateString() : '-'}</td>
                                <td style={{ padding: '4px 0' }}><strong>À :</strong></td>
                                <td style={{ padding: '4px 0' }}>{client.birth_place || '-'}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '4px 0' }}><strong>Profession :</strong></td>
                                <td style={{ padding: '4px 0' }}>{client.profession || '-'}</td>
                                <td style={{ padding: '4px 0' }}><strong>Domicile habituel :</strong></td>
                                <td style={{ padding: '4px 0' }}>{client.usual_residence || '-'}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '4px 0' }}><strong>Adresse complète :</strong></td>
                                <td style={{ padding: '4px 0' }} colSpan="3">{client.full_address || '-'}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '4px 0' }} colSpan="3"><strong>Nombre d'enfants de moins de 15 ans accompagnant le chef de famille :</strong></td>
                                <td style={{ padding: '4px 0' }}>{stay.children_count || '0'}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '4px 0' }}><strong>Téléphone :</strong></td>
                                <td style={{ padding: '4px 0' }}>{client.phone || '-'}</td>
                                <td style={{ padding: '4px 0' }}><strong>Email :</strong></td>
                                <td style={{ padding: '4px 0' }}>{client.email || '-'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Section 2: Pièce d'Identité & Séjour Dates */}
                <div style={{ marginBottom: '15px' }}>
                    <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '2px', marginBottom: '8px', fontSize: '13px', textTransform: 'uppercase', backgroundColor: '#f9f9f9', paddingLeft: '5px' }}>
                        2. Pièce d'Identité & Séjour
                    </h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                        <tbody>
                            <tr>
                                <td style={{ padding: '4px 0', width: '25%' }}><strong>Type de pièce :</strong></td>
                                <td style={{ padding: '4px 0', width: '25%' }}>{client.id_type || '-'}</td>
                                <td style={{ padding: '4px 0', width: '25%' }}><strong>Numéro :</strong></td>
                                <td style={{ padding: '4px 0', width: '25%' }}>{client.id_number || '-'}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '4px 0' }}><strong>Délivrée le :</strong></td>
                                <td style={{ padding: '4px 0' }}>{client.id_issue_date ? new Date(client.id_issue_date).toLocaleDateString() : '-'}</td>
                                <td style={{ padding: '4px 0' }}><strong>À :</strong></td>
                                <td style={{ padding: '4px 0' }}>{client.id_issue_place || '-'}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '4px 0' }}><strong>Date d'arrivée :</strong></td>
                                <td style={{ padding: '4px 0' }}>{new Date(stay.check_in).toLocaleDateString()}</td>
                                <td style={{ padding: '4px 0' }}><strong>Date de départ :</strong></td>
                                <td style={{ padding: '4px 0' }}>{new Date(stay.check_out).toLocaleDateString()}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '4px 0' }}><strong>Venant de :</strong></td>
                                <td style={{ padding: '4px 0' }}>{stay.coming_from || '-'}</td>
                                <td style={{ padding: '4px 0' }}><strong>Allant à :</strong></td>
                                <td style={{ padding: '4px 0' }}>{stay.going_to || '-'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Intermediate Signature (Request: juste avant le détail du séjour) */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
                    <div style={{ textAlign: 'center', width: '35%' }}>
                        <p style={{ textDecoration: 'underline', marginBottom: '25px', fontSize: '11px', fontWeight: 'bold' }}>Signature du Client</p>
                        <div style={{ borderBottom: '1px dotted #000', width: '100%' }}></div>
                    </div>
                </div>

                {/* Section 3: Détails du Séjour */}
                <div style={{ marginBottom: '15px' }}>
                    <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '2px', marginBottom: '8px', fontSize: '13px', textTransform: 'uppercase', backgroundColor: '#f9f9f9', paddingLeft: '5px' }}>
                        3. Détails du Séjour
                    </h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                        <tbody>
                            <tr>
                                <td style={{ padding: '4px 0', width: '25%' }}><strong>Nom :</strong></td>
                                <td style={{ padding: '4px 0', width: '25%' }}>{client.last_name}</td>
                                <td style={{ padding: '4px 0', width: '25%' }}><strong>Prénoms :</strong></td>
                                <td style={{ padding: '4px 0', width: '25%' }}>{client.first_name}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '4px 0' }}><strong>Âge :</strong></td>
                                <td style={{ padding: '4px 0' }}>{stay.age || '-'} ans</td>
                                <td style={{ padding: '4px 0' }}><strong>Nationalité :</strong></td>
                                <td style={{ padding: '4px 0' }}>{client.nationality || '-'}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '4px 0' }}><strong>Profession :</strong></td>
                                <td style={{ padding: '4px 0' }}>{client.profession || stay.profession || '-'}</td>
                                <td style={{ padding: '4px 0' }}><strong>Contact :</strong></td>
                                <td style={{ padding: '4px 0' }}>{client.phone || '-'}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '4px 0' }}><strong>Adresse :</strong></td>
                                <td style={{ padding: '4px 0' }} colSpan="3">{client.full_address || '-'}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '4px 0', width: '25%' }}><strong>Site :</strong></td>
                                <td style={{ padding: '4px 0', width: '25%' }}>{stay.site}</td>
                                <td style={{ padding: '4px 0', width: '25%' }}><strong>Motif du voyage :</strong></td>
                                <td style={{ padding: '4px 0', width: '25%' }}>{stay.travel_reason || '-'}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '4px 0' }}><strong>Mode de transport :</strong></td>
                                <td style={{ padding: '4px 0' }} colSpan="3">{stay.transport_mode || '-'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Section 4: Signatures */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                    <div style={{ textAlign: 'center', width: '40%' }}>
                        <p style={{ textDecoration: 'underline', marginBottom: '35px', fontSize: '11px' }}>Signature du Réceptionniste</p>
                        <div style={{ borderBottom: '1px dotted #000', width: '100%' }}></div>
                    </div>
                    <div style={{ textAlign: 'center', width: '40%' }}>
                        <p style={{ textDecoration: 'underline', marginBottom: '35px', fontSize: '11px' }}>Signature du Client</p>
                        <div style={{ borderBottom: '1px dotted #000', width: '100%' }}></div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{ position: 'absolute', bottom: '15px', left: '45px', right: '45px', fontSize: '8px', color: '#666', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '8px' }}>
                    Sainte Élisabeth Hôtel - Document automatisé - Généré le {new Date().toLocaleString()}
                </div>
            </div>

            {/* CSS for printing */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page {
                        size: A4;
                        margin: 0;
                    }
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        box-sizing: border-box !important;
                    }
                    body { 
                        background: white !important; 
                        margin: 0; 
                        padding: 0;
                        width: 210mm;
                        height: 297mm;
                    }
                    body * { visibility: hidden; }
                    .registration-print-container, .registration-print-container * { 
                        visibility: visible; 
                        overflow-wrap: break-word !important;
                        word-break: normal !important;
                    }
                    .registration-print-container {
                        position: absolute !important;
                        left: 0;
                        top: 0;
                        width: 210mm;
                        height: 297mm;
                        padding: 10mm 15mm !important;
                        margin: 0 !important;
                        box-shadow: none !important;
                        background: white !important;
                        display: block !important;
                    }
                    .no-print { display: none !important; }
                    .registration-print-overlay { 
                        background-color: transparent !important; 
                        position: static !important;
                        padding: 0 !important;
                        width: auto !important;
                        height: auto !important;
                        display: block !important;
                    }
                    table {
                        width: 100% !important;
                        border-collapse: collapse !important;
                    }
                    td {
                        padding: 4px 0 !important;
                        vertical-align: top !important;
                        overflow-wrap: break-word !important;
                    }
                }
            `}} />
        </div>
    );
};

export default RegistrationFormPrint;
