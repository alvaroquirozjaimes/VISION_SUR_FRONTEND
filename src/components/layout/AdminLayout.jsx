import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Tv, LayoutDashboard, Newspaper, Video, Calendar, Users, Radio, LogOut, ChevronRight, Mail } from 'lucide-react';
import useAuthStore from '../../hooks/useAuthStore.js';
import styles from './AdminLayout.module.css';

const NAV = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/noticias', icon: Newspaper, label: 'Noticias' },
  { to: '/admin/videos', icon: Video, label: 'Videos' },
  { to: '/admin/programacion', icon: Calendar, label: 'Programación' },
  { to: '/admin/en-vivo', icon: Radio, label: 'En Vivo' },
  { to: '/admin/contactos', icon: Mail, label: 'Contactos' },
  { to: '/admin/usuarios', icon: Users, label: 'Usuarios', adminOnly: true },
];

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <div className={`admin-scope ${styles.root}`}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <div className={styles.logoMark}><Tv size={16} /></div>
          <div>
            <span className={styles.logoName}>Canal 7</span>
            <span className={styles.logoSub}>Admin</span>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          {NAV.filter(n => !n.adminOnly || user?.role === 'admin').map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navActive : ''}`}>
              <Icon size={16} />
              <span>{label}</span>
              <ChevronRight size={12} className={styles.chevron} />
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarBottom}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>{user?.name?.[0]?.toUpperCase() || 'A'}</div>
            <div className={styles.userDetails}>
              <div className={styles.userName}>{user?.name}</div>
              <div className={styles.userRole}>{user?.role}</div>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={14} /> Cerrar sesión
          </button>
        </div>
      </aside>

      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}
