import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, RefreshCcw } from 'lucide-react';

const SettingsForm = () => {
    const [settings, setSettings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('site_settings').select('*').order('key');
        if (!error) {
            setSettings(data);
        }
        setLoading(false);
    };

    const handleChange = (id, newValue) => {
        setSettings(settings.map(s => s.id === id ? { ...s, value: newValue } : s));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            for (const item of settings) {
                const { error } = await supabase
                    .from('site_settings')
                    .update({ value: item.value })
                    .eq('id', item.id);
                if (error) throw error;
            }
            alert('Paramètres mis à jour avec succès !');
        } catch (err) {
            alert('Erreur lors de la mise à jour : ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Chargement des paramètres...</div>;

    return (
        <div className="settings-container card glass-box animate-up" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--gold)' }}>Configuration du Site</h3>

            <div className="settings-list">
                {settings.map(setting => (
                    <div key={setting.id} className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                            {setting.description || setting.key}
                        </label>
                        <input
                            type="text"
                            value={setting.value}
                            onChange={(e) => handleChange(setting.id, e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                borderRadius: '4px',
                                border: '1px solid #ddd',
                                fontSize: '1rem'
                            }}
                        />
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                <button
                    className="btn-primary"
                    onClick={handleSave}
                    disabled={saving}
                    style={{ flex: 1 }}
                >
                    {saving ? 'Enregistrement...' : <><Save size={18} /> ENREGISTRER TOUT</>}
                </button>
                <button
                    className="btn-outline"
                    onClick={fetchSettings}
                    style={{ width: '50px', justifyContent: 'center' }}
                >
                    <RefreshCcw size={18} />
                </button>
            </div>
        </div>
    );
};

export default SettingsForm;
