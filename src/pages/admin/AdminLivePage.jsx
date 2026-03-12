import { useEffect, useState } from 'react';
import { programApi } from '../../services/api.js';
import { toYouTubeEmbed } from '../../services/youtube.js';
import toast from 'react-hot-toast';
import { Radio, Save, Eye, AlertCircle, CheckCircle } from 'lucide-react';
import styles from './AdminForm.module.css';

export default function AdminLivePage() {
  const [url, setUrl] = useState('');
  const [saved, setSaved] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    programApi
      .getLiveStream()
      .then((r) => {
        setUrl(r.data.url || '');
        setSaved(r.data.url || '');
      })
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
    } finally {
      setSaving(false);
    }
  };

  const embedPreview = saved ? toYouTubeEmbed(saved) : null;
  const isDirty = url !== saved;
  const currentPreview = url ? toYouTubeEmbed(url) : null;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Transmisión En Vivo</h1>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.mainCol}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>URL del stream</label>
            <input
              className={styles.formInput}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
              disabled={loading}
            />
          </div>

          <div className={styles.helpBox}>
            <strong>Formatos aceptados de YouTube</strong>
            <br />
            youtube.com/watch?v=VIDEO_ID
            <br />
            youtu.be/VIDEO_ID
            <br />
            youtube.com/embed/VIDEO_ID
          </div>

          {url && (
            <div className={styles.warningBox} style={{ color: currentPreview ? '#15803d' : '#b77710' }}>
              {currentPreview ? <CheckCircle size={13} /> : <AlertCircle size={13} />}
              <span>
                {currentPreview
                  ? 'URL válida'
                  : 'URL no reconocida como YouTube — se insertará como iframe directo.'}
              </span>
            </div>
          )}

          <button
            className={styles.submitBtn}
            onClick={handleSave}
            disabled={saving || loading || !isDirty}
            type="button"
          >
            {saving ? 'Guardando…' : (
              <>
                <Save size={14} />
                Guardar URL
              </>
            )}
          </button>
        </div>

        <div className={styles.sideCol}>
          <div className={styles.sideCard}>
            <div className={styles.toggleLabel} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Eye size={14} />
              Vista previa
            </div>

            {embedPreview ? (
              <div className={styles.embedPreviewWrap}>
                <iframe
                  src={`${embedPreview}?rel=0`}
                  title="Preview"
                  className={styles.embedPreview}
                  allowFullScreen
                />
              </div>
            ) : (
              <div className={styles.uploadPlaceholder} style={{ minHeight: 220 }}>
                <Radio size={32} />
                <span>Ingresa una URL de YouTube para ver la vista previa</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}