import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { newsApi, videoApi, programApi, assetUrl } from '../services/api.js';
import NewsCard from '../components/common/NewsCard.jsx';
import VideoCard from '../components/common/VideoCard.jsx';
import { Radio, ArrowRight, Clock, CalendarDays } from 'lucide-react';
import styles from './HomePage.module.css';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [videos, setVideos] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [liveUrl, setLiveUrl] = useState('');

  useEffect(() => {
    newsApi
      .getAll({ featured: true, limit: 4 })
      .then((r) => setFeatured(r.data.data))
      .catch(() => {});

    newsApi
      .getAll({ limit: 6 })
      .then((r) => setLatestNews(r.data.data))
      .catch(() => {});

    videoApi
      .getAll({ limit: 4 })
      .then((r) => setVideos(r.data.data))
      .catch(() => {});

    programApi
      .getAll()
      .then((r) => setPrograms(r.data))
      .catch(() => {});

    programApi
      .getLiveStream()
      .then((r) => setLiveUrl(r.data.url))
      .catch(() => {});
  }, []);

  const hero = featured[0];
  const featuredRest = featured.slice(1);

  const heroImage = hero?.image
    ? assetUrl(hero.image)
    : hero
      ? `https://picsum.photos/seed/${hero.id}/1600/900`
      : '';

  return (
    <div className={styles.page}>
      {/* HERO */}
      {hero && (
        <section className={styles.hero}>
          <div
            className={styles.heroImg}
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className={styles.heroOverlay} />

            <div className="container">
              <div className={styles.heroContent}>
                {hero.category && (
                  <span className={styles.heroCategory}>{hero.category}</span>
                )}

                <h1 className={styles.heroTitle}>{hero.title}</h1>

                {hero.summary && (
                  <p className={styles.heroSummary}>{hero.summary}</p>
                )}

                <div className={styles.heroActions}>
                  <Link
                    to={`/noticias/${hero.slug}`}
                    className={styles.heroBtn}
                  >
                    <span>Leer nota completa</span>
                    <ArrowRight size={15} />
                  </Link>

                  <Link to="/noticias" className={styles.heroGhostBtn}>
                    Más noticias
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* LIVE BANNER */}
      {liveUrl && (
        <section className={styles.liveBanner}>
          <div className="container">
            <Link to="/en-vivo" className={styles.liveBannerInner}>
              <div className={styles.liveBannerLeft}>
                <span className={styles.livePulse}></span>
                <Radio size={16} />
                <span>Transmisión en vivo disponible</span>
              </div>

              <span className={styles.liveBannerCta}>
                Ver canal en vivo
                <ArrowRight size={14} />
              </span>
            </Link>
          </div>
        </section>
      )}

      <div className="container">
        {/* FEATURED */}
        {featured.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <span className={styles.sectionKicker}>Portada</span>
                <h2 className={styles.sectionTitle}>Noticias destacadas</h2>
              </div>

              <Link to="/noticias" className={styles.seeAll}>
                Ver todas
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className={styles.featuredRow}>
              <div className={styles.featuredMain}>
                {hero && <NewsCard news={hero} featured />}
              </div>

              <div className={styles.featuredSide}>
                {featuredRest.slice(0, 2).map((n) => (
                  <NewsCard key={n.id} news={n} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* LATEST */}
        {latestNews.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <span className={styles.sectionKicker}>Actualidad</span>
                <h2 className={styles.sectionTitle}>Últimas noticias</h2>
              </div>

              <Link to="/noticias" className={styles.seeAll}>
                Ver todas
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className={styles.newsGrid}>
              {latestNews.map((n) => (
                <NewsCard key={n.id} news={n} />
              ))}
            </div>
          </section>
        )}

        {/* VIDEOS */}
        {videos.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <span className={styles.sectionKicker}>Multimedia</span>
                <h2 className={styles.sectionTitle}>Videos recientes</h2>
              </div>

              <Link to="/videos" className={styles.seeAll}>
                Ver todos
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className={styles.videoGrid}>
              {videos.map((v) => (
                <VideoCard key={v.id} video={v} />
              ))}
            </div>
          </section>
        )}

        {/* SCHEDULE */}
        {programs.length > 0 && (
          <section className={`${styles.section} ${styles.sectionNoBottom}`}>
            <div className={styles.sectionHeader}>
              <div>
                <span className={styles.sectionKicker}>Agenda</span>
                <h2 className={styles.sectionTitle}>Programación del día</h2>
              </div>

              <Link to="/programacion" className={styles.seeAll}>
                Ver completa
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className={styles.scheduleGrid}>
              {programs.slice(0, 4).map((p) => (
                <article key={p.id} className={styles.scheduleCard}>
                  <div className={styles.scheduleTop}>
                    <span className={styles.scheduleBadge}>
                      <CalendarDays size={12} />
                      Programa
                    </span>
                  </div>

                  <div className={styles.scheduleTimeRow}>
                    <div className={styles.scheduleTime}>{p.startTime}</div>
                    <div className={styles.scheduleSeparator}></div>
                    <div className={styles.scheduleEnd}>{p.endTime}</div>
                  </div>

                  <h3 className={styles.scheduleName}>{p.name}</h3>

                  <div className={styles.scheduleDays}>
                    <Clock size={12} />
                    <span>
                      {p.days?.slice(0, 3).join(', ')}
                      {p.days?.length > 3 ? '…' : ''}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}