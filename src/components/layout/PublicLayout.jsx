import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, Search, Play, MapPin, Phone, Mail } from 'lucide-react';
import styles from './PublicLayout.module.css';

const TICKER_ITEMS = [
  'Bienvenidos a Visión Sur Televisión 12.1 — información y contenido para nuestra región',
  'Cobertura informativa, programación local y transmisiones especiales',
  'Mira nuestra señal en vivo y mantente conectado con la actualidad',
  'Espacios informativos, culturales y de entretenimiento para toda la familia',
  '¿Deseas anunciar con nosotros? Contáctanos para publicidad y alianzas',
  'Visión Sur Televisión 12.1 — cercanía, credibilidad e identidad regional',
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

    if (search.trim()) {
      navigate(`/noticias?search=${encodeURIComponent(search)}`);
      setSearch('');
      setMenuOpen(false);
    }
  };

  return (
    <div className={styles.root}>
      {/* Ticker */}
      <div className={styles.ticker}>
        <span className={styles.tickerLabel}>ÚLTIMA HORA</span>

        <div className={styles.tickerTrack}>
          <div className={styles.tickerInner}>
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i}>{item}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Header */}
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className="container">
          <div className={styles.headerInner}>
            <Link to="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
              <div className={styles.logoMark}>
                <span className={styles.logoGold}></span>
                <span className={styles.logoBlue}></span>
              </div>

              <div className={styles.logoText}>
                VISIÓN SUR
                <span>TELEVISIÓN 12.1</span>
              </div>
            </Link>

            <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
              {NAV_ITEMS.map(({ to, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.navActive : ''}`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            <div className={styles.headerRight}>
              <form onSubmit={handleSearch} className={styles.searchForm}>
                <input
                  type="text"
                  placeholder="Buscar noticias…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={styles.searchInput}
                />
                <button type="submit" className={styles.searchBtn} aria-label="Buscar">
                  <Search size={15} />
                </button>
              </form>

              <Link to="/en-vivo" className={styles.liveBtn} onClick={() => setMenuOpen(false)}>
                <span className={styles.liveDot}></span>
                <Play size={14} />
                <span>En Vivo</span>
              </Link>

              <button
                className={styles.menuBtn}
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Menú"
                type="button"
              >
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

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerTop}>
            {/* Brand */}
            <div className={styles.footerBrand}>
              <div className={styles.footerLogo}>
                <div className={styles.footerLogoMark}>
                  <span className={styles.footerLogoGold}></span>
                  <span className={styles.footerLogoBlue}></span>
                </div>

                <div className={styles.footerLogoText}>
                  VISIÓN SUR
                  <span>TELEVISIÓN 12.1</span>
                </div>
              </div>

              <p className={styles.footerDesc}>
                Señal informativa y televisiva con identidad regional. Compartimos
                noticias, programación y contenido de valor para nuestra comunidad.
              </p>

              <div className={styles.footerSocials}>
                <a href="#" className={styles.socialBtn} aria-label="Facebook">
                  f
                </a>
                <a href="#" className={styles.socialBtn} aria-label="X">
                  𝕏
                </a>
                <a href="#" className={styles.socialBtn} aria-label="Instagram">
                  ◉
                </a>
                <a href="#" className={styles.socialBtn} aria-label="YouTube">
                  ▶
                </a>
              </div>
            </div>

            {/* Secciones */}
            <div>
              <h4 className={styles.footerTitle}>Secciones</h4>
              <ul className={styles.footerLinks}>
                {NAV_ITEMS.map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to}>{label}</Link>
                  </li>
                ))}
                <li>
                  <Link to="/en-vivo">En Vivo</Link>
                </li>
              </ul>
            </div>

            {/* Categorías */}
            <div>
              <h4 className={styles.footerTitle}>Categorías</h4>
              <ul className={styles.footerLinks}>
                {['Noticias', 'Actualidad', 'Cultura', 'Deportes', 'Entrevistas', 'Especiales'].map(
                  (c) => (
                    <li key={c}>
                      <Link to={`/noticias?category=${encodeURIComponent(c.toLowerCase())}`}>
                        {c}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h4 className={styles.footerTitle}>Contacto</h4>
              <ul className={styles.footerLinks}>
                <li>
                  <span className={styles.footerInfoItem}>
                    <MapPin size={14} />
                    Av. Principal 123, Perú
                  </span>
                </li>
                <li>
                  <span className={styles.footerInfoItem}>
                    <Phone size={14} />
                    (000) 000-0000
                  </span>
                </li>
                <li>
                  <a href="mailto:contacto@visionsur.com" className={styles.footerInfoItem}>
                    <Mail size={14} />
                    contacto@visionsur.com
                  </a>
                </li>
                <li>
                  <a href="mailto:publicidad@visionsur.com" className={styles.footerInfoItem}>
                    <Mail size={14} />
                    publicidad@visionsur.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <span className={styles.footerCopy}>
              © {new Date().getFullYear()} Visión Sur Televisión 12.1. Todos los derechos reservados.
            </span>

            <Link to="/admin" className={styles.footerAdminLink}>
              Panel Admin →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}