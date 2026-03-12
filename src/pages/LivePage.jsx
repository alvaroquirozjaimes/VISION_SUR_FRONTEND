import { useEffect, useState } from 'react';
import { programApi } from '../services/api.js';
import { toYouTubeEmbed } from '../services/youtube.js';
import { Radio, ArrowRight, MonitorPlay } from 'lucide-react';
import styles from './LivePage.module.css';

export default function LivePage() {
  const [liveUrl, setLiveUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    programApi
      .getLiveStream()
      .then((r) => setLiveUrl(r.data.url || ''))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const embedUrl = liveUrl ? toYouTubeEmbed(liveUrl) : null;
  const directUrl = !embedUrl && liveUrl ? liveUrl : null;

  return (
    <div className={styles.page}>
      <div className="container">
        <section className={styles.hero}>
          <div className={styles.heroBadge}>
            <span className={styles.livePulse}></span>
            <Radio size={15} />
            <span>Señal en vivo</span>
          </div>

          <h1 className={styles.title}>Visión Sur Televisión 12.1 en vivo</h1>

          <p className={styles.subtitle}>
            Sigue nuestra transmisión en tiempo real y mantente conectado con la
            información, programación y contenidos de nuestra señal.
          </p>
        </section>

        {loading && (
          <div className={styles.stateBox}>
            <div className={styles.stateIcon}>
              <MonitorPlay size={34} />
            </div>
            <p className={styles.stateTitle}>Cargando transmisión…</p>
            <span className={styles.stateText}>
              Estamos preparando el reproductor en vivo.
            </span>
          </div>
        )}

        {!loading && (embedUrl || directUrl) && (
          <section className={styles.playerSection}>
            <div className={styles.playerFrame}>
              <iframe
                src={embedUrl || directUrl}
                title="Visión Sur Televisión 12.1 En Vivo"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>

            <div className={styles.playerFooter}>
              <div className={styles.playerStatus}>
                <span className={styles.livePulseSmall}></span>
                <span>Transmisión activa</span>
              </div>

              <div className={styles.playerMeta}>
                Señal digital · Visión Sur Televisión 12.1
              </div>
            </div>
          </section>
        )}

        {!loading && !embedUrl && !directUrl && (
          <div className={styles.stateBox}>
            <div className={styles.stateEmoji}>📡</div>
            <p className={styles.stateTitle}>
              La transmisión en vivo no está disponible en este momento.
            </p>
            <span className={styles.stateText}>
              Vuelve en el próximo horario de emisión para seguir nuestra señal.
            </span>

            <p className={styles.adminHint}>
              ¿Eres administrador? Configura la URL del stream en{' '}
              <a href="/admin/en-vivo" className={styles.adminLink}>
                Panel Admin → En Vivo <ArrowRight size={13} />
              </a>
              .
            </p>
          </div>
        )}

        {!loading && embedUrl && (
          <p className={styles.hint}>
            Si el video no carga, verifica que la transmisión esté activa en YouTube.
          </p>
        )}
      </div>
    </div>
  );
}