import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Tv, Menu, X, Search, Radio } from 'lucide-react';
import styles from './PublicLayout.module.css';

const TICKER_ITEMS = [
  'Bienvenidos a Canal 7 Regional — Tu canal de noticias y entretenimiento',
  'Noticiero Central de lunes a viernes a las 7:00 AM',
  'Magazín de la Tarde todos los días a la 1:00 PM',
  'Transmisión en vivo disponible 24/7 en nuestra web',
  'Síguenos en redes sociales para más contenido regional',
  '¿Quieres pautar con nosotros? Contáctanos en publicidad@canal7.com',
];

const NAV_ITEMS = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/noticias', label: 'Noticias' },
  { to: '/videos', label: 'Videos' },
  { to: '/programacion', label: 'Programación' },
  { to: '/contacto', label: 'Publicidad' },
];

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) { navigate(`/noticias?search=${encodeURIComponent(search)}`); setSearch(''); }
  };

  return (
    <div className={styles.root}>
      {/* Ticker */}
      <div className={styles.ticker}>
        <span className={styles.tickerLabel}>ÚLTIMA HORA</span>
        <div className={styles.tickerTrack}>
          <div className={styles.tickerInner}>
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => <span key={i}>{item}</span>)}
          </div>
        </div>
      </div>

      {/* Header */}
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className="container">
          <div className={styles.headerInner}>
            <Link to="/" className={styles.logo}>
              <div className={styles.logoMark}><Tv size={18} /></div>
              <div className={styles.logoText}>Canal 7<span>Regional</span></div>
            </Link>

            <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
              {NAV_ITEMS.map(({ to, label, end }) => (
                <NavLink key={to} to={to} end={end}
                  className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navActive : ''}`}
                  onClick={() => setMenuOpen(false)}>
                  {label}
                </NavLink>
              ))}
            </nav>

            <div className={styles.headerRight}>
              <form onSubmit={handleSearch} className={styles.searchForm}>
                <input type="text" placeholder="Buscar noticias…" value={search}
                  onChange={e => setSearch(e.target.value)} className={styles.searchInput} />
                <button type="submit" className={styles.searchBtn}><Search size={14} /></button>
              </form>
              <Link to="/en-vivo" className={styles.liveBtn}>
                <div className="live-dot" /><span>En Vivo</span>
              </Link>
              <button className={styles.menuBtn} onClick={() => setMenuOpen(v => !v)} aria-label="Menú">
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className={styles.main}>
        <Outlet />
      </main>

      {/* Footer — negro */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerTop}>
            {/* Brand */}
            <div>
              <div className={styles.footerLogo}>
                <div className={styles.footerLogoMark}><Tv size={16} /></div>
                <div className={styles.footerLogoText}>Canal 7<span>Regional</span></div>
              </div>
              <p className={styles.footerDesc}>
                Tu canal de referencia en la región. Noticias, entretenimiento y cultura
                al alcance de toda la familia desde 1995.
              </p>
              <div className={styles.footerSocials}>
                <a href="#" className={styles.socialBtn} aria-label="Facebook">f</a>
                <a href="#" className={styles.socialBtn} aria-label="Twitter">𝕏</a>
                <a href="#" className={styles.socialBtn} aria-label="Instagram">▣</a>
                <a href="#" className={styles.socialBtn} aria-label="YouTube">▶</a>
              </div>
            </div>

            {/* Secciones */}
            <div>
              <h4 className={styles.footerTitle}>Secciones</h4>
              <ul className={styles.footerLinks}>
                {NAV_ITEMS.map(({ to, label }) => (
                  <li key={to}><Link to={to}>{label}</Link></li>
                ))}
                <li><Link to="/en-vivo">En Vivo</Link></li>
              </ul>
            </div>

            {/* Categorías */}
            <div>
              <h4 className={styles.footerTitle}>Categorías</h4>
              <ul className={styles.footerLinks}>
                {['Noticias', 'Entretenimiento', 'Deportes', 'Cultura', 'Política', 'Economía'].map(c => (
                  <li key={c}><Link to={`/noticias?category=${c.toLowerCase()}`}>{c}</Link></li>
                ))}
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h4 className={styles.footerTitle}>Contacto</h4>
              <ul className={styles.footerLinks}>
                <li><span>📍 Av. Principal 123, Regional</span></li>
                <li><span>📞 (000) 000-0000</span></li>
                <li><a href="mailto:contacto@canal7.com">✉ contacto@canal7.com</a></li>
                <li><a href="mailto:publicidad@canal7.com">📣 publicidad@canal7.com</a></li>
              </ul>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <span className={styles.footerCopy}>© {new Date().getFullYear()} Canal 7 Regional. Todos los derechos reservados.</span>
            <Link to="/admin" className={styles.footerAdminLink}>Panel Admin →</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
