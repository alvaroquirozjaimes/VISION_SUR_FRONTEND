import { useEffect, useState } from 'react';
import { programApi } from '../services/api.js';
import { toYouTubeEmbed } from '../services/youtube.js';
import { Radio } from 'lucide-react';
import styles from './LivePage.module.css';

export default function LivePage() {
  const [liveUrl, setLiveUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    programApi.getLiveStream()
      .then(r => setLiveUrl(r.data.url || ''))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Convertir cualquier URL de YouTube a embed válido
  const embedUrl = liveUrl ? toYouTubeEmbed(liveUrl) : null;

  // Si no es YouTube, puede ser una URL de stream directo (iframe permitido)
  const directUrl = (!embedUrl && liveUrl) ? liveUrl : null;

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <div className={styles.header}>
        <div className="live-dot" />
        <Radio size={20} />
        <span>Transmisión en Vivo</span>
      </div>

      {loading && (
        <div className={styles.offline}>
          <p>Cargando transmisión…</p>
        </div>
      )}

      {!loading && (embedUrl || directUrl) && (
        <div className={styles.player}>
          <iframe
            src={embedUrl || directUrl}
            title="Canal 7 En Vivo"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      )}

      {!loading && !embedUrl && !directUrl && (
        <div className={styles.offline}>
          <span style={{ fontSize: 48 }}>📡</span>
          <p>La transmisión en vivo no está disponible en este momento.</p>
          <span>Vuelve en el próximo horario de emisión.</span>
          {/* Hint para admin */}
          <p style={{ fontSize: 12, color: 'var(--pub-muted)', marginTop: 16 }}>
            ¿Eres administrador? Configura la URL del stream en{' '}
            <a href="/admin/en-vivo" style={{ color: 'var(--red)' }}>Panel Admin → En Vivo</a>.
          </p>
        </div>
      )}

      {/* Nota técnica para YouTube */}
      {!loading && embedUrl && (
        <p className={styles.hint}>
          🎥 Si el video no carga, asegúrate de que la transmisión esté activa en YouTube.
        </p>
      )}
    </div>
  );
}
