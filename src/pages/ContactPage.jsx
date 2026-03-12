import { useState } from 'react';
import { contactApi } from '../services/api.js';
import toast from 'react-hot-toast';
import {
  Mail,
  Phone,
  MapPin,
  Tv,
  Megaphone,
  Newspaper,
  Send,
  CheckCircle,
  MonitorPlay,
} from 'lucide-react';
import styles from './ContactPage.module.css';

const AD_PACKAGES = [
  {
    name: 'Spot Publicitario',
    icon: <Tv size={22} />,
    desc: 'Comerciales de 15, 30 o 60 segundos durante nuestra programación regular.',
    detail: 'Impulsa tu marca en franjas de alta audiencia con presencia televisiva regional.',
  },
  {
    name: 'Patrocinio de Programa',
    icon: <Megaphone size={22} />,
    desc: 'Asocia tu empresa a uno de nuestros espacios informativos o de entretenimiento.',
    detail: 'Incluye menciones, presencia visual en pantalla y exposición en nuestros canales digitales.',
  },
  {
    name: 'Nota de Prensa',
    icon: <Newspaper size={22} />,
    desc: 'Difusión de comunicados, eventos y lanzamientos en nuestra web y espacios informativos.',
    detail: 'Ideal para instituciones, marcas y organizaciones que buscan visibilidad y respaldo editorial.',
  },
  {
    name: 'Banner Web',
    icon: <MonitorPlay size={22} />,
    desc: 'Espacios publicitarios en la plataforma digital de Visión Sur.',
    detail: 'Banner fijo o rotativo para aumentar alcance, recordación y tráfico hacia tu marca.',
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: 'publicidad',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

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
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            {/* <span className={styles.heroBadge}>Publicidad & Contacto</span> */}

            <h1 className={styles.heroTitle}>
              Lleva tu marca más lejos con Visión Sur Televisión 12.1
            </h1>

            <p className={styles.heroSub}>
              Conectamos negocios, instituciones y organizaciones con una audiencia regional
              a través de nuestra señal televisiva, espacios informativos y plataforma digital.
            </p>
          </div>
        </div>
      </section>

      <div className="container">
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionKicker}>Soluciones comerciales</span>
            <h2 className={styles.sectionTitle}>Opciones publicitarias</h2>
          </div>

          <div className={styles.packagesGrid}>
            {AD_PACKAGES.map((p) => (
              <article key={p.name} className={styles.packageCard}>
                <div className={styles.packageIcon}>{p.icon}</div>
                <h3 className={styles.packageName}>{p.name}</h3>
                <p className={styles.packageDesc}>{p.desc}</p>
                <p className={styles.packageDetail}>{p.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.statsSection}>
          <div className={styles.statItem}>
            <div className={styles.statNum}>+5K</div>
            <div className={styles.statLabel}>Televidentes diarios</div>
          </div>

          <div className={styles.statDivider} />

          <div className={styles.statItem}>
            <div className={styles.statNum}>12h</div>
            <div className={styles.statLabel}>Programación diaria</div>
          </div>

          <div className={styles.statDivider} />

          <div className={styles.statItem}>
            <div className={styles.statNum}>3+</div>
            <div className={styles.statLabel}>Años de presencia</div>
          </div>

          <div className={styles.statDivider} />

          <div className={styles.statItem}>
            <div className={styles.statNum}>100%</div>
            <div className={styles.statLabel}>Cobertura regional</div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.contactGrid}>
            <div className={styles.infoCol}>
              <span className={styles.sectionKicker}>Hablemos</span>
              <h2 className={styles.sectionTitle}>Contáctanos</h2>

              <p className={styles.infoText}>
                Si deseas pautar con nosotros, difundir una campaña o realizar una consulta
                institucional, completa el formulario y nuestro equipo se pondrá en contacto
                contigo a la brevedad.
              </p>

              <div className={styles.infoItems}>
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>
                    <MapPin size={18} />
                  </div>
                  <div>
                    <div className={styles.infoItemTitle}>Dirección</div>
                    <div className={styles.infoItemText}>Av. Principal 123, Perú</div>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>
                    <Phone size={18} />
                  </div>
                  <div>
                    <div className={styles.infoItemTitle}>Teléfono</div>
                    <div className={styles.infoItemText}>(000) 000-0000</div>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>
                    <Mail size={18} />
                  </div>
                  <div>
                    <div className={styles.infoItemTitle}>Correo comercial</div>
                    <div className={styles.infoItemText}>publicidad@visionsur.com</div>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>
                    <Tv size={18} />
                  </div>
                  <div>
                    <div className={styles.infoItemTitle}>Prensa</div>
                    <div className={styles.infoItemText}>prensa@visionsur.com</div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.formCol}>
              {sent ? (
                <div className={styles.successBox}>
                  <div className={styles.successIcon}>
                    <CheckCircle size={42} />
                  </div>
                  <h3>¡Mensaje enviado!</h3>
                  <p>
                    Nuestro equipo se comunicará contigo dentro de las próximas 24 horas hábiles.
                  </p>
                  <button
                    type="button"
                    className={styles.secondaryBtn}
                    onClick={() => setSent(false)}
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Nombre completo *</label>
                      <input
                        className={styles.formInput}
                        value={form.name}
                        onChange={(e) => set('name', e.target.value)}
                        required
                        placeholder="Tu nombre"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Correo electrónico *</label>
                      <input
                        className={styles.formInput}
                        type="email"
                        value={form.email}
                        onChange={(e) => set('email', e.target.value)}
                        required
                        placeholder="tu@empresa.com"
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Teléfono</label>
                      <input
                        className={styles.formInput}
                        value={form.phone}
                        onChange={(e) => set('phone', e.target.value)}
                        placeholder="(000) 000-0000"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Empresa / Marca</label>
                      <input
                        className={styles.formInput}
                        value={form.company}
                        onChange={(e) => set('company', e.target.value)}
                        placeholder="Nombre de tu empresa"
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Asunto</label>
                    <select
                      className={styles.formInput}
                      value={form.subject}
                      onChange={(e) => set('subject', e.target.value)}
                    >
                      <option value="publicidad">Publicidad / Pauta</option>
                      <option value="prensa">Nota de Prensa</option>
                      <option value="general">Consulta General</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Mensaje *</label>
                    <textarea
                      className={`${styles.formInput} ${styles.formTextarea}`}
                      value={form.message}
                      onChange={(e) => set('message', e.target.value)}
                      required
                      placeholder="Cuéntanos sobre tu consulta, el tipo de publicidad que buscas o el objetivo de tu campaña…"
                      rows={5}
                    />
                  </div>

                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={loading}
                  >
                    <Send size={15} />
                    <span>{loading ? 'Enviando…' : 'Enviar mensaje'}</span>
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