import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { videoApi, assetUrl } from '../services/api.js';
import { toYouTubeEmbed } from '../services/youtube.js';
import { ArrowLeft, Eye, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import styles from './DetailPage.module.css';

export default function VideoDetailPage() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    videoApi.getById(id)
      .then(r => setVideo(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className={styles.loading}>Cargando…</div>;
  if (!video)  return <div className={styles.loading}>Video no encontrado.</div>;

  // Convertir cualquier URL de YouTube a embed válido
  const embedSrc = video.embedUrl ? toYouTubeEmbed(video.embedUrl) : null;
  // Archivo subido directamente
  const videoFileSrc = video.videoUrl ? assetUrl(video.videoUrl) : null;

  return (
    <div className={styles.page}>
      <div className="container-sm">
        <Link to="/videos" className={styles.back}>
          <ArrowLeft size={13} /> Volver a Videos
        </Link>

        <div className={styles.meta}>
          <span className={`badge badge-category-${video.category}`}>{video.category}</span>
          {video.program && (
            <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:12, letterSpacing:1, color:'var(--red)', textTransform:'uppercase' }}>
              {video.program}
            </span>
          )}
          <span className={styles.views}><Eye size={12} /> {video.views ?? 0} vistas</span>
        </div>

        <h1 className={styles.title}>{video.title}</h1>

        {/* ── Player ── */}
        <div className={styles.videoPlayer}>
          {embedSrc ? (
            // YouTube embed (URL correcta)
            <iframe
              src={`${embedSrc}?rel=0&modestbranding=1`}
              title={video.title}
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          ) : videoFileSrc ? (
            // Archivo subido al servidor
            <video src={videoFileSrc} controls preload="metadata" />
          ) : (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:60, color:'var(--pub-muted)', flexDirection:'column', gap:12 }}>
              <span style={{ fontSize:40 }}>🎬</span>
              <p>Video no disponible</p>
            </div>
          )}
        </div>

        {video.description && (
          <p style={{ color:'var(--pub-text2)', fontSize:15, lineHeight:1.75, marginTop:20 }}>
            {video.description}
          </p>
        )}

        {video.createdAt && (
          <p style={{ fontSize:12, color:'var(--pub-muted)', marginTop:12, display:'flex', alignItems:'center', gap:5 }}>
            <Calendar size={12} />
            Publicado el {format(new Date(video.createdAt), "d 'de' MMMM 'de' yyyy", { locale: es })}
          </p>
        )}
      </div>
    </div>
  );
}
