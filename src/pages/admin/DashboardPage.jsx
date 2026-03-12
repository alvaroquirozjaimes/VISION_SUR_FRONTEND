import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { newsApi, videoApi, programApi, userApi } from '../../services/api.js';
import { contactApi } from '../../services/api.js';
import { Newspaper, Video, Calendar, Users, Plus, ArrowRight, Mail } from 'lucide-react';
import useAuthStore from '../../hooks/useAuthStore.js';
import styles from './Dashboard.module.css';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ news: 0, videos: 0, programs: 0, users: 0, contacts: 0 });
  const [latestNews, setLatestNews] = useState([]);
  const [latestVideos, setLatestVideos] = useState([]);

  useEffect(() => {
    newsApi.getAllAdmin({ limit: 1 }).then(r => setStats(s => ({ ...s, news: r.data.total }))).catch(() => {});
    videoApi.getAllAdmin({ limit: 1 }).then(r => setStats(s => ({ ...s, videos: r.data.total }))).catch(() => {});
    programApi.getAllAdmin().then(r => setStats(s => ({ ...s, programs: r.data.length }))).catch(() => {});
    if (user?.role === 'admin') userApi.getAll().then(r => setStats(s => ({ ...s, users: r.data.length }))).catch(() => {});
    contactApi.getAll({ status: 'nuevo' }).then(r => setStats(s => ({ ...s, contacts: r.data.length }))).catch(() => {});
    newsApi.getAllAdmin({ limit: 5 }).then(r => setLatestNews(r.data.data)).catch(() => {});
    videoApi.getAllAdmin({ limit: 5 }).then(r => setLatestVideos(r.data.data)).catch(() => {});
  }, [user]);

  const STAT_CARDS = [
    { label: 'Noticias', value: stats.news, icon: Newspaper, to: '/admin/noticias', color: '#1565C0' },
    { label: 'Videos', value: stats.videos, icon: Video, to: '/admin/videos', color: '#6A1B9A' },
    { label: 'Programas', value: stats.programs, icon: Calendar, to: '/admin/programacion', color: '#E65100' },
    { label: 'Mensajes nuevos', value: stats.contacts, icon: Mail, to: '/admin/contactos', color: '#C62828' },
    { label: 'Usuarios', value: stats.users, icon: Users, to: '/admin/usuarios', color: '#2E7D32' },
  ];

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.sub}>Bienvenido, {user?.name}</p>
      </div>

      <div className={styles.statsGrid}>
        {STAT_CARDS.map(({ label, value, icon: Icon, to, color }) => (
          <Link to={to} key={label} className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: color + '22', color }}><Icon size={22} /></div>
            <div>
              <div className={styles.statValue}>{value}</div>
              <div className={styles.statLabel}>{label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className={styles.quickActions}>
        <Link to="/admin/noticias/nueva" className="btn btn-primary btn-sm"><Plus size={14} /> Nueva Noticia</Link>
        <Link to="/admin/videos/nuevo" className="btn btn-ghost btn-sm"><Plus size={14} /> Nuevo Video</Link>
      </div>

      <div className={styles.tables}>
        <div className={styles.tableSection}>
          <div className={styles.tableHeader}>
            <h2 className={styles.tableTitle}>Últimas Noticias</h2>
            <Link to="/admin/noticias" className={styles.tableLink}>Ver todas <ArrowRight size={12} /></Link>
          </div>
          <div className={styles.tableCard}>
            {latestNews.map(n => (
              <div key={n.id} className={styles.tableRow}>
                <div className={styles.tableRowMain}>
                  <span className={styles.tableRowTitle}>{n.title}</span>
                  <span className={`badge ${n.published ? 'badge-red' : 'badge-dark'}`}>{n.published ? 'Publicado' : 'Borrador'}</span>
                </div>
                <Link to={`/admin/noticias/${n.id}/editar`} className={styles.tableRowEdit}>Editar</Link>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.tableSection}>
          <div className={styles.tableHeader}>
            <h2 className={styles.tableTitle}>Últimos Videos</h2>
            <Link to="/admin/videos" className={styles.tableLink}>Ver todos <ArrowRight size={12} /></Link>
          </div>
          <div className={styles.tableCard}>
            {latestVideos.map(v => (
              <div key={v.id} className={styles.tableRow}>
                <div className={styles.tableRowMain}>
                  <span className={styles.tableRowTitle}>{v.title}</span>
                  <span className={`badge ${v.published ? 'badge-red' : 'badge-dark'}`}>{v.published ? 'Publicado' : 'Borrador'}</span>
                </div>
                <Link to={`/admin/videos/${v.id}/editar`} className={styles.tableRowEdit}>Editar</Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
