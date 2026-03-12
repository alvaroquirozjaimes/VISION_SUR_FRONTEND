import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { videoApi, assetUrl } from '../services/api.js';
import { toYouTubeEmbed } from '../services/youtube.js';
import { ArrowLeft, Eye, Calendar, PlayCircle, Clock3 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import styles from './DetailPage.module.css';

function normalizeCategory(category) {
  return String(category || '').trim() || 'General';
}

export default function VideoDetailPage() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    videoApi
      .getById(id)
      .then((r) => setVideo(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className="container-sm">
          <div className={styles.stateBox}>
            <div className={styles.stateIcon}>
              <PlayCircle size={36} />
            </div>
            <p className={styles.stateTitle}>Cargando video…</p>
            <span className={styles.stateText}>
              Estamos preparando el reproductor y la información del contenido.
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className={styles.page}>
        <div className="container-sm">
          <div className={styles.stateBox}>
            <div className={styles.stateEmoji}>🎬</div>
            <p className={styles.stateTitle}>Video no encontrado</p>
            <span className={styles.stateText}>
              El contenido que buscas no está disponible o fue removido.
            </span>

            <Link to="/videos" className={styles.backBtn}>
              <ArrowLeft size={14} />
              Volver a Videos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const embedSrc = video.embedUrl ? toYouTubeEmbed(video.embedUrl) : null;
  const videoFileSrc = video.videoUrl ? assetUrl(video.videoUrl) : null;

  return (
    <div className={styles.page}>
      <div className="container-sm">
        <Link to="/videos" className={styles.backLink}>
          <ArrowLeft size={14} />
          Volver a Videos
        </Link>

        <header className={styles.header}>
          <div className={styles.metaTop}>
            <span className={styles.categoryBadge}>
              {normalizeCategory(video.category)}
            </span>

            {video.program && (
              <span className={styles.programBadge}>{video.program}</span>
            )}

            <span className={styles.metaInfo}>
              <Eye size={13} />
              {video.views ?? 0} vistas
            </span>
          </div>

          <h1 className={styles.title}>{video.title}</h1>

          {video.description && (
            <p className={styles.lead}>{video.description}</p>
          )}
        </header>

        <section className={styles.playerSection}>
          <div className={styles.videoPlayer}>
            {embedSrc ? (
              <iframe
                src={`${embedSrc}?rel=0&modestbranding=1`}
                title={video.title}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            ) : videoFileSrc ? (
              <video src={videoFileSrc} controls preload="metadata" />
            ) : (
              <div className={styles.playerEmpty}>
                <span className={styles.playerEmptyEmoji}>🎬</span>
                <p className={styles.playerEmptyTitle}>Video no disponible</p>
                <span className={styles.playerEmptyText}>
                  Este contenido no tiene una fuente de reproducción válida.
                </span>
              </div>
            )}
          </div>

          <div className={styles.playerFooter}>
            <div className={styles.playerStatus}>
              <PlayCircle size={14} />
              <span>Contenido audiovisual</span>
            </div>

            {video.createdAt && (
              <div className={styles.metaInfo}>
                <Calendar size={13} />
                Publicado el{' '}
                {format(new Date(video.createdAt), "d 'de' MMMM 'de' yyyy", {
                  locale: es,
                })}
              </div>
            )}
          </div>
        </section>

        {(video.program || video.duration || video.category) && (
          <section className={styles.infoGrid}>
            {video.program && (
              <article className={styles.infoCard}>
                <span className={styles.infoLabel}>Programa</span>
                <h3 className={styles.infoValue}>{video.program}</h3>
              </article>
            )}

            {video.category && (
              <article className={styles.infoCard}>
                <span className={styles.infoLabel}>Categoría</span>
                <h3 className={styles.infoValue}>
                  {normalizeCategory(video.category)}
                </h3>
              </article>
            )}

            {video.duration && (
              <article className={styles.infoCard}>
                <span className={styles.infoLabel}>Duración</span>
                <h3 className={styles.infoValueInline}>
                  <Clock3 size={15} />
                  {video.duration}
                </h3>
              </article>
            )}
          </section>
        )}
      </div>
    </div>
  );
}