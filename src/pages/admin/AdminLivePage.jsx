import { useEffect, useState } from 'react';
import { programApi } from '../../services/api.js';
import { toYouTubeEmbed } from '../../services/youtube.js';
import toast from 'react-hot-toast';
import { Radio, Save, Eye, AlertCircle, CheckCircle } from 'lucide-react';

export default function AdminLivePage() {
  const [url, setUrl] = useState('');
  const [saved, setSaved] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    programApi.getLiveStream()
      .then(r => { setUrl(r.data.url || ''); setSaved(r.data.url || ''); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await programApi.updateLiveStream(url);
      setSaved(url);
      toast.success('URL del stream guardada');
    } catch {
      toast.error('Error al guardar');
    } finally { setSaving(false); }
  };

  const embedPreview = saved ? toYouTubeEmbed(saved) : null;
  const isDirty = url !== saved;

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 26, color: 'var(--adm-text)' }}>
          Transmisión En Vivo
        </h1>
        <p style={{ color: 'var(--adm-muted)', fontSize: 13, marginTop: 4 }}>
          Configura la URL del stream que aparece en la página pública.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
        {/* Formulario */}
        <div style={{ background: 'var(--adm-bg2)', border: '1px solid var(--adm-border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
          <div className="form-group" style={{ marginBottom: 20 }}>
            <label className="form-label">URL del Stream</label>
            <input
              className="form-input"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
              disabled={loading}
            />
          </div>

          {/* Ayuda visual */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--adm-border)', borderRadius: 'var(--radius)', padding: 14, marginBottom: 20 }}>
            <p style={{ fontSize: 12, color: 'var(--adm-muted)', fontFamily: 'var(--font-display)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Formatos aceptados de YouTube</p>
            {[
              'https://www.youtube.com/watch?v=VIDEO_ID',
              'https://youtu.be/VIDEO_ID',
              'https://www.youtube.com/embed/VIDEO_ID',
            ].map(ex => (
              <code key={ex} style={{ display: 'block', fontSize: 11, color: 'var(--adm-text2)', fontFamily: 'monospace', marginBottom: 4, opacity: 0.7 }}>{ex}</code>
            ))}
          </div>

          {/* Validación en tiempo real */}
          {url && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontSize: 13 }}>
              {toYouTubeEmbed(url)
                ? <><CheckCircle size={14} color="var(--green)" /><span style={{ color: 'var(--green)' }}>URL válida — se mostrará como embed</span></>
                : <><AlertCircle size={14} color="var(--accent)" /><span style={{ color: 'var(--accent)' }}>URL no reconocida como YouTube — se insertará como iframe directo</span></>
              }
            </div>
          )}

          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving || loading || !isDirty}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {saving ? 'Guardando…' : <><Save size={14} /> Guardar URL</>}
          </button>
        </div>

        {/* Preview */}
        <div style={{ background: 'var(--adm-bg2)', border: '1px solid var(--adm-border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, letterSpacing: 1, color: 'var(--adm-muted)', textTransform: 'uppercase', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Eye size={14} /> Vista Previa
          </p>

          {embedPreview ? (
            <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', background: '#000' }}>
              <iframe
                src={`${embedPreview}?rel=0`}
                title="Preview"
                style={{ width: '100%', aspectRatio: '16/9', border: 'none', display: 'block' }}
                allowFullScreen
              />
            </div>
          ) : (
            <div style={{ aspect: '16/9', background: 'var(--adm-bg3)', borderRadius: 'var(--radius)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '40px 20px', textAlign: 'center' }}>
              <Radio size={32} color="var(--adm-muted)" />
              <p style={{ fontSize: 13, color: 'var(--adm-muted)' }}>Ingresa una URL de YouTube para ver la vista previa</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
