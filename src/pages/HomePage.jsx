import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { newsApi, videoApi, programApi } from '../services/api.js';
import NewsCard from '../components/common/NewsCard.jsx';
import VideoCard from '../components/common/VideoCard.jsx';
import { Radio, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import styles from './HomePage.module.css';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [videos, setVideos] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [liveUrl, setLiveUrl] = useState('');

  useEffect(() => {
    newsApi.getAll({ featured: true, limit: 4 }).then(r => setFeatured(r.data.data)).catch(() => {});
    newsApi.getAll({ limit: 6 }).then(r => setLatestNews(r.data.data)).catch(() => {});
    videoApi.getAll({ limit: 4 }).then(r => setVideos(r.data.data)).catch(() => {});
    programApi.getAll().then(r => setPrograms(r.data)).catch(() => {});
    programApi.getLiveStream().then(r => setLiveUrl(r.data.url)).catch(() => {});
  }, []);

  const hero = featured[0];
  const featuredRest = featured.slice(1);

  return (
    <div className={styles.page}>
      {/* HERO */}
      {hero && (
        <section className={styles.hero}>
          <div className={styles.heroImg} style={{ backgroundImage: `url(${hero.image || `https://picsum.photos/seed/${hero.id}/1400/600`})` }}>
            <div className={styles.heroOverlay} />
            <div className="container">
              <div className={styles.heroContent}>
                <span className={`badge badge-category-${hero.category}`}>{hero.category}</span>
                <h1 className={styles.heroTitle}>{hero.title}</h1>
                <p className={styles.heroSummary}>{hero.summary}</p>
                <Link to={`/noticias/${hero.slug}`} className="btn btn-primary">
                  Leer nota completa <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* LIVE BANNER */}
      {liveUrl && (
        <div className={styles.liveBanner}>
          <div className="container">
            <Link to="/en-vivo" className={styles.liveBannerInner}>
              <div className={styles.liveBannerLeft}>
                <div className="live-dot" />
                <Radio size={16} />
                <span>Transmisión en vivo ahora</span>
              </div>
              <span className={styles.liveBannerCta}>Ver canal en vivo <ArrowRight size={13} /></span>
            </Link>
          </div>
        </div>
      )}

      <div className="container">

        {/* FEATURED — grid layout */}
        {featured.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className="section-title">Noticias Destacadas</h2>
              <Link to="/noticias" className={styles.seeAll}>Ver todas <ArrowRight size={13} /></Link>
            </div>
            <div className={styles.featuredRow}>
              <div className={styles.featuredMain}>
                {hero && <NewsCard news={hero} featured />}
              </div>
              <div className={styles.featuredSide}>
                {featuredRest.slice(0, 2).map(n => <NewsCard key={n.id} news={n} />)}
              </div>
            </div>
          </section>
        )}

        {/* LATEST */}
        {latestNews.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className="section-title">Últimas Noticias</h2>
              <Link to="/noticias" className={styles.seeAll}>Ver todas <ArrowRight size={13} /></Link>
            </div>
            <div className="news-grid fade-in">
              {latestNews.map(n => <NewsCard key={n.id} news={n} />)}
            </div>
          </section>
        )}

        {/* VIDEOS */}
        {videos.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className="section-title">Videos Recientes</h2>
              <Link to="/videos" className={styles.seeAll}>Ver todos <ArrowRight size={13} /></Link>
            </div>
            <div className="video-grid fade-in">
              {videos.map(v => <VideoCard key={v.id} video={v} />)}
            </div>
          </section>
        )}

        {/* SCHEDULE */}
        {programs.length > 0 && (
          <section className={styles.section} style={{ paddingBottom: 0 }}>
            <div className={styles.sectionHeader}>
              <h2 className="section-title">Programación del Día</h2>
              <Link to="/programacion" className={styles.seeAll}>Ver completa <ArrowRight size={13} /></Link>
            </div>
            <div className={styles.scheduleGrid}>
              {programs.slice(0, 4).map(p => (
                <div key={p.id} className={styles.scheduleCard}>
                  <div className={styles.scheduleTime}>{p.startTime}</div>
                  <div className={styles.scheduleEnd}>{p.endTime}</div>
                  <div className={styles.scheduleName}>{p.name}</div>
                  <div className={styles.scheduleDays}>{p.days?.slice(0,3).join(', ')}{p.days?.length > 3 ? '…' : ''}</div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
