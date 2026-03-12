import { useState } from 'react';
import { contactApi } from '../services/api.js';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin, Tv, Megaphone, Newspaper, Send, CheckCircle } from 'lucide-react';
import styles from './ContactPage.module.css';

const AD_PACKAGES = [
  {
    name: 'Spot Publicitario',
    icon: '📺',
    desc: 'Comerciales de 15, 30 o 60 segundos durante la programación regular.',
    detail: 'Alcanza a toda nuestra audiencia regional durante los bloques de mayor sintonía.',
  },
  {
    name: 'Patrocinio de Programa',
    icon: '🎙️',
    desc: 'Tu marca asociada a uno de nuestros programas estrella.',
    detail: 'Mención de marca, pantalla dividida y presencia en la web del canal.',
  },
  {
    name: 'Nota de Prensa',
    icon: '📰',
    desc: 'Publicación de comunicados y notas de prensa en nuestra web y noticiero.',
    detail: 'Ideal para lanzamientos, eventos y comunicados institucionales.',
  },
  {
    name: 'Banner Web',
    icon: '🖥️',
    desc: 'Espacio publicitario en nuestra plataforma digital.',
    detail: 'Banner fijo o rotativo visible para todos los visitantes del sitio.',
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', subject: 'publicidad', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contactApi.submit(form);
      setSent(true);
      toast.success('¡Mensaje enviado!');
    } catch {
      toast.error('Error al enviar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* HERO */}
      <div className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <span className="badge badge-red" style={{ marginBottom: 12 }}>Publicidad & Contacto</span>
            <h1 className={styles.heroTitle}>Llega a toda la región con Canal 7</h1>
            <p className={styles.heroSub}>
              Somos el canal de referencia de la provincia. Conectamos tu marca con miles de
              espectadores a través de nuestra señal de televisión y plataforma digital.
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        {/* AD PACKAGES */}
        <section className={styles.section}>
          <h2 className="section-title" style={{ marginBottom: 24 }}>Opciones Publicitarias</h2>
          <div className={styles.packagesGrid}>
            {AD_PACKAGES.map((p) => (
              <div key={p.name} className={styles.packageCard}>
                <div className={styles.packageIcon}>{p.icon}</div>
                <h3 className={styles.packageName}>{p.name}</h3>
                <p className={styles.packageDesc}>{p.desc}</p>
                <p className={styles.packageDetail}>{p.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* STATS */}
        <section className={styles.statsSection}>
          <div className={styles.statItem}>
            <div className={styles.statNum}>+50K</div>
            <div className={styles.statLabel}>Televidentes diarios</div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <div className={styles.statNum}>12h</div>
            <div className={styles.statLabel}>Programación diaria</div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <div className={styles.statNum}>30+</div>
            <div className={styles.statLabel}>Años en el aire</div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <div className={styles.statNum}>100%</div>
            <div className={styles.statLabel}>Cobertura regional</div>
          </div>
        </section>

        {/* CONTACT FORM + INFO */}
        <section className={styles.section}>
          <div className={styles.contactGrid}>
            {/* Info */}
            <div className={styles.infoCol}>
              <h2 className="section-title" style={{ marginBottom: 24 }}>Contáctanos</h2>
              <p className={styles.infoText}>
                ¿Interesado en pautar con nosotros o tienes alguna consulta?
                Completa el formulario y nuestro equipo comercial se comunicará contigo
                a la brevedad.
              </p>

              <div className={styles.infoItems}>
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}><MapPin size={18} /></div>
                  <div>
                    <div className={styles.infoItemTitle}>Dirección</div>
                    <div className={styles.infoItemText}>Av. Principal 123, Regional</div>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}><Phone size={18} /></div>
                  <div>
                    <div className={styles.infoItemTitle}>Teléfono</div>
                    <div className={styles.infoItemText}>(000) 000-0000</div>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}><Mail size={18} /></div>
                  <div>
                    <div className={styles.infoItemTitle}>Email comercial</div>
                    <div className={styles.infoItemText}>publicidad@canal7.com</div>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}><Tv size={18} /></div>
                  <div>
                    <div className={styles.infoItemTitle}>Prensa</div>
                    <div className={styles.infoItemText}>prensa@canal7.com</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className={styles.formCol}>
              {sent ? (
                <div className={styles.successBox}>
                  <CheckCircle size={48} color="var(--green)" />
                  <h3>¡Mensaje enviado!</h3>
                  <p>Nuestro equipo se comunicará contigo en las próximas 24 horas hábiles.</p>
                  <button className="btn btn-ghost" onClick={() => setSent(false)}>Enviar otro mensaje</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.formRow}>
                    <div className="form-group">
                      <label className="form-label">Nombre completo *</label>
                      <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} required placeholder="Tu nombre" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Correo electrónico *</label>
                      <input className="form-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} required placeholder="tu@empresa.com" />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className="form-group">
                      <label className="form-label">Teléfono</label>
                      <input className="form-input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(000) 000-0000" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Empresa / Marca</label>
                      <input className="form-input" value={form.company} onChange={e => set('company', e.target.value)} placeholder="Nombre de tu empresa" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Asunto</label>
                    <select className="form-input" value={form.subject} onChange={e => set('subject', e.target.value)}>
                      <option value="publicidad">Publicidad / Pauta</option>
                      <option value="prensa">Nota de Prensa</option>
                      <option value="general">Consulta General</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mensaje *</label>
                    <textarea className="form-input" value={form.message} onChange={e => set('message', e.target.value)} required placeholder="Cuéntanos sobre tu consulta, tipo de publicidad que buscas, presupuesto aproximado…" rows={5} />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', width: '100%' }} disabled={loading}>
                    <Send size={15} /> {loading ? 'Enviando…' : 'Enviar mensaje'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
