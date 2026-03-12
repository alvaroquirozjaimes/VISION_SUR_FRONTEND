import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { newsApi, videoApi, programApi, userApi } from '../../services/api.js';
import { contactApi } from '../../services/api.js';
import {
  Newspaper,
  Video,
  Calendar,
  Users,
  Plus,
  ArrowRight,
  Mail,
  FileText,
} from 'lucide-react';
import useAuthStore from '../../hooks/useAuthStore.js';
import styles from './Dashboard.module.css';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    news: 0,
    videos: 0,
    programs: 0,
    users: 0,
    contacts: 0,
  });
  const [latestNews, setLatestNews] = useState([]);
  const [latestVideos, setLatestVideos] = useState([]);

  useEffect(() => {
    newsApi
      .getAllAdmin({ limit: 1 })
      .then((r) => setStats((s) => ({ ...s, news: r.data.total })))
      .catch(() => {});

    videoApi
      .getAllAdmin({ limit: 1 })
      .then((r) => setStats((s) => ({ ...s, videos: r.data.total })))
      .catch(() => {});

    programApi
      .getAllAdmin()
      .then((r) => setStats((s) => ({ ...s, programs: r.data.length })))
      .catch(() => {});

    if (user?.role === 'admin') {
      userApi
        .getAll()
        .then((r) => setStats((s) => ({ ...s, users: r.data.length })))
        .catch(() => {});
    }

    contactApi
      .getAll({ status: 'nuevo' })
      .then((r) => setStats((s) => ({ ...s, contacts: r.data.length })))
      .catch(() => {});

    newsApi
      .getAllAdmin({ limit: 5 })
      .then((r) => setLatestNews(r.data.data || []))
      .catch(() => {});

    videoApi
      .getAllAdmin({ limit: 5 })
      .then((r) => setLatestVideos(r.data.data || []))
      .catch(() => {});
  }, [user]);

  const STAT_CARDS = [
    {
      label: 'Noticias',
      value: stats.news,
      icon: Newspaper,
      to: '/admin/noticias',
      tone: 'blue',
    },
    {
      label: 'Videos',
      value: stats.videos,
      icon: Video,
      to: '/admin/videos',
      tone: 'indigo',
    },
    {
      label: 'Programas',
      value: stats.programs,
      icon: Calendar,
      to: '/admin/programacion',
      tone: 'gold',
    },
    {
      label: 'Mensajes nuevos',
      value: stats.contacts,
      icon: Mail,
      to: '/admin/contactos',
      tone: 'amber',
    },
    {
      label: 'Usuarios',
      value: stats.users,
      icon: Users,
      to: '/admin/usuarios',
      tone: 'green',
      adminOnly: true,
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <span className={styles.kicker}>Panel administrativo</span>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.sub}>
            Bienvenido, <strong>{user?.name || 'Administrador'}</strong>
          </p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        {STAT_CARDS.filter((item) => !item.adminOnly || user?.role === 'admin').map(
          ({ label, value, icon: Icon, to, tone }) => (
            <Link to={to} key={label} className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles[`tone${capitalize(tone)}`]}`}>
                <Icon size={20} />
              </div>

              <div className={styles.statContent}>
                <div className={styles.statValue}>{value}</div>
                <div className={styles.statLabel}>{label}</div>
              </div>

              <ArrowRight size={15} className={styles.statArrow} />
            </Link>
          )
        )}
      </div>

      <div className={styles.quickActions}>
        <Link to="/admin/noticias/nueva" className={styles.primaryAction}>
          <Plus size={15} />
          Nueva noticia
        </Link>

        <Link to="/admin/videos/nuevo" className={styles.secondaryAction}>
          <Plus size={15} />
          Nuevo video
        </Link>
      </div>

      <div className={styles.tables}>
        <section className={styles.tableSection}>
          <div className={styles.tableHeader}>
            <div>
              <span className={styles.tableKicker}>Contenido</span>
              <h2 className={styles.tableTitle}>Últimas noticias</h2>
            </div>

            <Link to="/admin/noticias" className={styles.tableLink}>
              Ver todas
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className={styles.tableCard}>
            {latestNews.length === 0 ? (
              <div className={styles.emptyState}>
                <FileText size={18} />
                <span>No hay noticias recientes.</span>
              </div>
            ) : (
              latestNews.map((n) => (
                <div key={n.id} className={styles.tableRow}>
                  <div className={styles.tableRowMain}>
                    <span className={styles.tableRowTitle}>{n.title}</span>
                    <span
                      className={`${styles.statusBadge} ${
                        n.published ? styles.statusPublished : styles.statusDraft
                      }`}
                    >
                      {n.published ? 'Publicado' : 'Borrador'}
                    </span>
                  </div>

                  <Link
                    to={`/admin/noticias/${n.id}/editar`}
                    className={styles.tableRowEdit}
                  >
                    Editar
                  </Link>
                </div>
              ))
            )}
          </div>
        </section>

        <section className={styles.tableSection}>
          <div className={styles.tableHeader}>
            <div>
              <span className={styles.tableKicker}>Multimedia</span>
              <h2 className={styles.tableTitle}>Últimos videos</h2>
            </div>

            <Link to="/admin/videos" className={styles.tableLink}>
              Ver todos
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className={styles.tableCard}>
            {latestVideos.length === 0 ? (
              <div className={styles.emptyState}>
                <Video size={18} />
                <span>No hay videos recientes.</span>
              </div>
            ) : (
              latestVideos.map((v) => (
                <div key={v.id} className={styles.tableRow}>
                  <div className={styles.tableRowMain}>
                    <span className={styles.tableRowTitle}>{v.title}</span>
                    <span
                      className={`${styles.statusBadge} ${
                        v.published ? styles.statusPublished : styles.statusDraft
                      }`}
                    >
                      {v.published ? 'Publicado' : 'Borrador'}
                    </span>
                  </div>

                  <Link
                    to={`/admin/videos/${v.id}/editar`}
                    className={styles.tableRowEdit}
                  >
                    Editar
                  </Link>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function capitalize(value) {
  return String(value || '').charAt(0).toUpperCase() + String(value || '').slice(1);
}