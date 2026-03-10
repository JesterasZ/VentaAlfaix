import { useState, useEffect, useCallback } from "react";

/* ══════════════════════════════════════
   API HELPER
══════════════════════════════════════ */
const api = async (url, opts = {}) => {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

/* ══════════════════════════════════════
   TRADUCCIONES
══════════════════════════════════════ */
const T = {
  es: {
    flag: "🇬🇧", switchLang: "English",
    nav: { home: "Inicio", catalog: "Catálogo", gallery: "Galería", contact: "Contacto", admin: "Admin" },
    hero: {
      tag: "Tu tienda de confianza",
      title: "Todo lo que\nnecesitas,",
      titleHighlight: "aquí.",
      sub: "Alimentación, bebidas, productos del hogar y mucho más. Calidad y precio en un solo lugar.",
      cta1: "Ver productos", cta2: "Contáctanos",
    },
    features: [
      { icon: "🥖", title: "Frescos cada día", text: "Pan, bollería y productos frescos recibidos cada mañana." },
      { icon: "🛒", title: "Gran variedad", text: "Más de 500 productos: alimentación, limpieza, bebidas y más." },
      { icon: "💰", title: "Mejor precio", text: "Ofertas semanales y precios competitivos para tu bolsillo." },
      { icon: "📍", title: "Cerca de ti", text: "Ven a vernos o consúltanos lo que necesites por aquí." },
    ],
    catalog: {
      title: "Nuestros Productos", tag: "Catálogo",
      all: "Todos", noProducts: "No hay productos en esta categoría.",
    },
    gallery: { title: "Nuestra Tienda", tag: "Galería", empty: "No hay imágenes disponibles.", close: "Cerrar" },
    contact: {
      tag: "Escríbenos", title: "Contacto",
      sub: "¿Alguna consulta, sugerencia o encargo? Escríbenos y te responderemos lo antes posible.",
      name: "Nombre *", phone: "Teléfono", subject: "Asunto", message: "Mensaje *",
      namePh: "Tu nombre", phonePh: "+34 600 000 000", subjectPh: "¿En qué podemos ayudarte?", messagePh: "Escribe tu mensaje...",
      send: "Enviar mensaje", sending: "Enviando...",
      successTitle: "¡Mensaje enviado!", successText: "Te responderemos en breve. ¡Gracias!",
      sendAnother: "Enviar otro mensaje", errRequired: "Por favor rellena todos los campos obligatorios.",
    },
    footer: {
      desc: "Tu supermercado de barrio con todo lo que necesitas al mejor precio.",
      scheduleTitle: "Horario", contactTitle: "Contacto",
      today: "Hoy", open: "Abierto", closed: "Cerrado", rights: "Todos los derechos reservados.",
    },
    admin: {
      title: "Panel Admin", subtitle: "Gestión del sitio",
      passLabel: "Contraseña", passHint: "Introduce tu contraseña de administrador", enter: "Acceder", wrongPass: "Contraseña incorrecta.",
      tabs: { messages: "Mensajes", gallery: "Galería", schedule: "Horario", products: "Productos" },
      msg: {
        title: "Mensajes recibidos", visible: "visibles", unread: "sin leer", empty: "No hay mensajes aún.",
        new: "NUEVO", hidden: "OCULTO", subject: "Asunto:",
        markRead: "✓ Marcar leído", markUnread: "Marcar no leído", hide: "🚫 Ocultar", show: "👁 Mostrar", delete: "🗑 Eliminar",
      },
      gal: {
        title: "Gestión de Galería", addTitle: "Añadir imagen",
        urlPh: "URL de la imagen (https://...)", captionPh: "Descripción (opcional)", add: "+ Añadir",
        hide: "Ocultar", show: "Mostrar", empty: "No hay imágenes.",
        edit: "Editar", save: "Guardar", cancel: "Cancelar", featured: "Inicio", notFeatured: "No en inicio",
      },
      sched: {
        title: "Horario de apertura", saved: "✓ Guardado", save: "Guardar horario",
        from: "Desde", to: "Hasta", closedLabel: "Cerrado",
      },
      prod: {
        title: "Gestión de Productos", addTitle: "Añadir producto",
        nameEs: "Nombre (ES)", nameEn: "Nombre (EN)", category: "Categoría",
        price: "Precio", descEs: "Descripción (ES)", descEn: "Descripción (EN)",
        icon: "Emoji/Icono", add: "+ Añadir producto",
        hide: "Ocultar", show: "Mostrar", edit: "Editar", save: "Guardar", cancel: "Cancelar",
        empty: "No hay productos.", delete: "Eliminar",
      },
    },
    days: { lunes:"Lunes",martes:"Martes",miércoles:"Miércoles",jueves:"Jueves",viernes:"Viernes",sábado:"Sábado",domingo:"Domingo" },
  },
  en: {
    flag: "🇪🇸", switchLang: "Español",
    nav: { home: "Home", catalog: "Catalogue", gallery: "Gallery", contact: "Contact", admin: "Admin" },
    hero: {
      tag: "Your trusted local shop",
      title: "Everything you\nneed,",
      titleHighlight: "here.",
      sub: "Food, drinks, household products and much more. Quality and value in one place.",
      cta1: "See products", cta2: "Contact us",
    },
    features: [
      { icon: "🥖", title: "Fresh every day", text: "Bread, pastries and fresh products received every morning." },
      { icon: "🛒", title: "Wide variety", text: "Over 500 products: food, cleaning, drinks and more." },
      { icon: "💰", title: "Best price", text: "Weekly deals and competitive prices for your budget." },
      { icon: "📍", title: "Close to you", text: "Come visit us or ask us anything you need right here." },
    ],
    catalog: {
      title: "Our Products", tag: "Catalogue",
      all: "All", noProducts: "No products in this category.",
    },
    gallery: { title: "Our Shop", tag: "Gallery", empty: "No images available.", close: "Close" },
    contact: {
      tag: "Write to us", title: "Contact",
      sub: "Any question, suggestion or order? Write to us and we'll get back to you as soon as possible.",
      name: "Name *", phone: "Phone", subject: "Subject", message: "Message *",
      namePh: "Your name", phonePh: "+34 600 000 000", subjectPh: "How can we help?", messagePh: "Write your message...",
      send: "Send message", sending: "Sending...",
      successTitle: "Message sent!", successText: "We'll get back to you shortly. Thank you!",
      sendAnother: "Send another message", errRequired: "Please fill in all required fields.",
    },
    footer: {
      desc: "Your neighbourhood shop with everything you need at the best price.",
      scheduleTitle: "Opening hours", contactTitle: "Contact",
      today: "Today", open: "Open", closed: "Closed", rights: "All rights reserved.",
    },
    admin: {
      title: "Admin Panel", subtitle: "Site management",
      passLabel: "Password", passHint: "Enter your admin password", enter: "Login", wrongPass: "Wrong password.",
      tabs: { messages: "Messages", gallery: "Gallery", schedule: "Schedule", products: "Products" },
      msg: {
        title: "Received messages", visible: "visible", unread: "unread", empty: "No messages yet.",
        new: "NEW", hidden: "HIDDEN", subject: "Subject:",
        markRead: "✓ Mark read", markUnread: "Mark unread", hide: "🚫 Hide", show: "👁 Show", delete: "🗑 Delete",
      },
      gal: {
        title: "Gallery management", addTitle: "Add image",
        urlPh: "Image URL (https://...)", captionPh: "Description (optional)", add: "+ Add",
        hide: "Hide", show: "Show", empty: "No images.",
        edit: "Edit", save: "Save", cancel: "Cancel", featured: "Homepage", notFeatured: "Not on homepage",
      },
      sched: {
        title: "Opening hours", saved: "✓ Saved", save: "Save schedule",
        from: "From", to: "To", closedLabel: "Closed",
      },
      prod: {
        title: "Product management", addTitle: "Add product",
        nameEs: "Name (ES)", nameEn: "Name (EN)", category: "Category",
        price: "Price", descEs: "Description (ES)", descEn: "Description (EN)",
        icon: "Emoji/Icon", add: "+ Add product",
        hide: "Hide", show: "Show", edit: "Edit", save: "Save", cancel: "Cancel",
        empty: "No products.", delete: "Delete",
      },
    },
    days: { lunes:"Monday",martes:"Tuesday",miércoles:"Wednesday",jueves:"Thursday",viernes:"Friday",sábado:"Saturday",domingo:"Sunday" },
  },
};

/* ══════════════════════════════════════
   PALETA & UTILIDADES
══════════════════════════════════════ */
const C = {
  blue900: "#1B6CA8",
  blue700: "#2E9CCC",
  blue500: "#4DB8D8",
  blue300: "#8ED6E8",
  blue100: "#D9F2F8",
  blue50:  "#EEF9FC",
  white:   "#FFFFFF",
  gray50:  "#F7FBFC",
  gray100: "#EDF5F8",
  gray200: "#D5E8EE",
  gray400: "#90B4BF",
  gray600: "#3D6B78",
  gray800: "#1A3A42",
  green:   "#16A34A",
  red:     "#DC2626",
  orange:  "#EA580C",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fraunces:ital,wght@0,300;0,700;1,300;1,700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Plus Jakarta Sans', sans-serif; background: ${C.gray50}; color: ${C.gray800}; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: ${C.gray100}; }
  ::-webkit-scrollbar-thumb { background: ${C.blue500}; border-radius: 4px; }
  .fade { animation: fd .4s ease both; }
  @keyframes fd { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  .card-hover { transition: transform .2s, box-shadow .2s; }
  .card-hover:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(45,125,210,.15) !important; }
  input, textarea, select {
    font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px;
    border: 1.5px solid ${C.gray200}; border-radius: 8px;
    padding: 10px 14px; width: 100%; background: ${C.white}; color: ${C.gray800};
    outline: none; transition: border-color .2s, box-shadow .2s;
  }
  input:focus, textarea:focus { border-color: ${C.blue500}; box-shadow: 0 0 0 3px ${C.blue100}; }
  button { cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; }
  @media(max-width:640px){ .hide-mobile{ display:none!important; } .show-mobile{ display:flex!important; } }
`;

/* ── BTN helpers ── */
const BtnPrimary = ({ children, onClick, style = {} }) => (
  <button onClick={onClick} style={{ background: C.blue700, color: C.white, border: "none", padding: "12px 28px", borderRadius: 8, fontSize: 14, fontWeight: 600, letterSpacing: .3, transition: "background .2s", ...style }}
    onMouseOver={e => e.currentTarget.style.background = C.blue900}
    onMouseOut={e => e.currentTarget.style.background = style.background || C.blue700}>
    {children}
  </button>
);
const BtnOutline = ({ children, onClick, style = {}, color = C.blue700 }) => (
  <button onClick={onClick} style={{ background: "transparent", color, border: `1.5px solid ${color}`, padding: "11px 24px", borderRadius: 8, fontSize: 14, fontWeight: 500, transition: "all .2s", ...style }}
    onMouseOver={e => { e.currentTarget.style.background = C.blue100; }}
    onMouseOut={e => { e.currentTarget.style.background = "transparent"; }}>
    {children}
  </button>
);
const Tag = ({ children }) => (
  <span style={{ display: "inline-block", background: C.blue100, color: C.blue700, fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", padding: "4px 12px", borderRadius: 20, marginBottom: 12 }}>{children}</span>
);

/* ══════════════════════════════════════
   NAVBAR
══════════════════════════════════════ */
function Navbar({ page, setPage, lang, setLang, t }) {
  const [open, setOpen] = useState(false);
  const links = [
    { id: "inicio", label: t.nav.home },
    { id: "catálogo", label: t.nav.catalog },
    { id: "galería", label: t.nav.gallery },
    { id: "contacto", label: t.nav.contact },
  ];
  return (
    <nav style={{ background: C.white, borderBottom: `1px solid ${C.gray200}`, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 16px rgba(0,0,0,.06)" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 20px", height: 62, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div onClick={() => setPage("inicio")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, background: C.blue700, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🛒</div>
          <div>
            <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 17, color: C.blue900, lineHeight: 1 }}>La Venta De Alfaix</div>
            <div style={{ fontSize: 9, color: C.gray400, letterSpacing: 2, textTransform: "uppercase" }}>Village Storage</div>
          </div>
        </div>
        <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {links.map(l => (
            <button key={l.id} onClick={() => setPage(l.id)} style={{
              background: "none", border: "none",
              color: page === l.id ? C.blue700 : C.gray600,
              fontWeight: page === l.id ? 600 : 400,
              fontSize: 14, padding: "8px 14px", borderRadius: 6,
              borderBottom: page === l.id ? `2px solid ${C.blue700}` : "2px solid transparent",
              transition: "all .15s",
            }}>{l.label}</button>
          ))}
          <button onClick={() => setLang(l => l === "es" ? "en" : "es")} style={{
            background: C.gray100, border: "none", borderRadius: 20, padding: "6px 14px", fontSize: 13,
            color: C.gray600, fontWeight: 500, marginLeft: 8, display: "flex", alignItems: "center", gap: 6,
          }}>
            <span>{t.flag}</span> {t.switchLang}
          </button>
        </div>
        <div style={{ display: "none", alignItems: "center", gap: 8 }} className="show-mobile">
          <button onClick={() => setLang(l => l === "es" ? "en" : "es")} style={{ background: C.gray100, border: "none", borderRadius: 20, padding: "5px 10px", fontSize: 13, color: C.gray600 }}>
            {t.flag}
          </button>
          <button onClick={() => setOpen(o => !o)} style={{ background: "none", border: "none", fontSize: 22, color: C.blue700 }}>☰</button>
        </div>
      </div>
      {open && (
        <div style={{ background: C.white, borderTop: `1px solid ${C.gray100}`, padding: 16, display: "flex", flexDirection: "column", gap: 4 }}>
          {links.map(l => (
            <button key={l.id} onClick={() => { setPage(l.id); setOpen(false); }} style={{
              background: page === l.id ? C.blue100 : "none", color: page === l.id ? C.blue700 : C.gray600,
              border: "none", padding: "10px 14px", borderRadius: 6, fontSize: 14, textAlign: "left", fontWeight: page === l.id ? 600 : 400,
            }}>{l.label}</button>
          ))}
        </div>
      )}
    </nav>
  );
}

/* ══════════════════════════════════════
   FOOTER
══════════════════════════════════════ */
function Footer({ schedule, t, lang }) {
  const todayKey = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"][new Date().getDay()];
  const todayS = schedule[todayKey];
  return (
    <footer style={{ background: C.blue900, color: C.blue300, marginTop: 80, padding: "48px 24px 24px" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 36 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, background: C.blue700, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🛒</div>
            <span style={{ fontFamily: "'Fraunces', serif", color: C.white, fontSize: 18, fontWeight: 700 }}>La Venta De Alfaix</span>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.7, color: C.blue300 }}>{t.footer.desc}</p>
        </div>
        <div>
          <h4 style={{ color: C.white, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>{t.footer.scheduleTitle}</h4>
          {todayS && (
            <div style={{ background: todayS.open ? "rgba(22,163,74,.15)" : "rgba(220,38,38,.15)", border: `1px solid ${todayS.open ? "rgba(22,163,74,.3)" : "rgba(220,38,38,.3)"}`, borderRadius: 6, padding: "8px 12px", marginBottom: 10, fontSize: 13 }}>
              <span style={{ color: C.white, fontWeight: 600 }}>{t.footer.today} ({t.days[todayKey]}): </span>
              <span style={{ color: todayS.open ? "#4ADE80" : "#F87171" }}>
                {todayS.open ? `${todayS.desde} – ${todayS.hasta}` : t.footer.closed}
              </span>
            </div>
          )}
          {Object.entries(schedule).map(([dia, v]) => (
            <div key={dia} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.blue300, padding: "2px 0" }}>
              <span>{t.days[dia]}</span>
              <span style={{ color: v.open ? C.blue300 : C.gray400 }}>{v.open ? `${v.desde}–${v.hasta}` : t.footer.closed}</span>
            </div>
          ))}
        </div>
        <div>
          <h4 style={{ color: C.white, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>{t.footer.contactTitle}</h4>
          <p style={{ fontSize: 13, lineHeight: 2.2, color: C.blue300 }}>📍 Calle Ejemplo, 12 · Vigo<br />📞 +34 986 000 000<br />✉️ hola@mitienda.es</p>
        </div>
      </div>
      <div style={{ borderTop: `1px solid rgba(255,255,255,.08)`, marginTop: 36, paddingTop: 18, textAlign: "center", fontSize: 12, color: C.blue300, letterSpacing: .5 }}>
        © {new Date().getFullYear()} La Venta De Alfaix — {t.footer.rights}
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════
   PÁGINAS PÚBLICAS
══════════════════════════════════════ */

/* ── HOME ── */
function HomePage({ setPage, schedule, gallery, t, lang }) {
  const todayKey = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"][new Date().getDay()];
  const todayS = schedule[todayKey];
  return (
    <div className="fade">
      <div style={{ background: `linear-gradient(135deg, ${C.blue900} 0%, ${C.blue700} 60%, ${C.blue500} 100%)`, padding: "90px 24px 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,.04)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,.04)", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 680, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(255,255,255,.12)", color: C.blue300, fontSize: 12, fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase", padding: "5px 16px", borderRadius: 20, marginBottom: 20 }}>{t.hero.tag}</div>
          <h1 style={{ fontFamily: "'Fraunces', serif", color: C.white, fontSize: "clamp(40px,7vw,72px)", lineHeight: 1.1, marginBottom: 20, whiteSpace: "pre-line" }}>
            {t.hero.title}<br /><span style={{ color: C.blue300 }}>{t.hero.titleHighlight}</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,.75)", fontSize: 16, lineHeight: 1.75, maxWidth: 500, margin: "0 auto 36px" }}>{t.hero.sub}</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <BtnPrimary onClick={() => setPage("catálogo")} style={{ background: C.white, color: C.blue900, padding: "13px 32px", fontSize: 15 }}>{t.hero.cta1}</BtnPrimary>
            <BtnOutline onClick={() => setPage("contacto")} style={{ borderColor: "rgba(255,255,255,.5)", color: C.white }} color="white">{t.hero.cta2}</BtnOutline>
          </div>
        </div>
      </div>
      {todayS && (
        <div style={{ background: todayS.open ? C.blue700 : C.red, color: C.white, textAlign: "center", padding: "12px 24px", fontSize: 14, fontWeight: 500 }}>
          {todayS.open
            ? `✅ ${t.footer.today} (${t.days[todayKey]}): ${todayS.desde} – ${todayS.hasta}`
            : `❌ ${t.footer.closed} ${t.footer.today}`}
        </div>
      )}
      <div style={{ maxWidth: 1140, margin: "64px auto", padding: "0 20px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20 }}>
        {t.features.map((f, i) => (
          <div key={i} className="card-hover" style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12, padding: 28 }}>
            <div style={{ fontSize: 36, marginBottom: 14 }}>{f.icon}</div>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 19, color: C.blue900, marginBottom: 8 }}>{f.title}</h3>
            <p style={{ fontSize: 13, color: C.gray600, lineHeight: 1.7 }}>{f.text}</p>
          </div>
        ))}
      </div>
      {/* Gallery preview */}
      {(() => {
        const visibleGal = gallery.filter(g => g.visible && g.featured);
        if (visibleGal.length === 0) return null;
        return (
          <div style={{ maxWidth: 1140, margin: "0 auto 64px", padding: "0 20px" }}>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <Tag>{t.gallery.tag}</Tag>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(26px,4vw,38px)", color: C.blue900 }}>{t.gallery.title}</h2>
              <div style={{ width: 48, height: 3, background: C.blue500, margin: "14px auto 0", borderRadius: 2 }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16 }}>
              {visibleGal.map(img => (
                <div key={img._id} className="card-hover" style={{ overflow: "hidden", borderRadius: 10, border: `1px solid ${C.gray200}`, cursor: "pointer" }} onClick={() => setPage("galería")}>
                  <img src={img.url} alt={lang === "es" ? img.caption_es : img.caption_en} style={{ width: "100%", height: 200, objectFit: "cover", display: "block", transition: "transform .3s" }}
                    onMouseOver={e => e.target.style.transform = "scale(1.04)"}
                    onMouseOut={e => e.target.style.transform = "scale(1)"}
                    onError={e => { e.target.style.minHeight = "200px"; e.target.style.background = C.blue50; }} />
                  <div style={{ padding: "10px 14px", background: C.white }}>
                    <p style={{ fontSize: 13, color: C.gray600 }}>{lang === "es" ? img.caption_es : img.caption_en}</p>
                  </div>
                </div>
              ))}
            </div>
            {gallery.filter(g => g.visible).length > visibleGal.length && (
              <div style={{ textAlign: "center", marginTop: 24 }}>
                <BtnOutline onClick={() => setPage("galería")} style={{ fontSize: 14, padding: "11px 28px" }}>
                  {lang === "es" ? "Ver toda la galería" : "See full gallery"} →
                </BtnOutline>
              </div>
            )}
          </div>
        );
      })()}

      <div style={{ background: C.blue50, borderTop: `1px solid ${C.blue100}`, borderBottom: `1px solid ${C.blue100}`, padding: "48px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(26px,4vw,38px)", color: C.blue900, marginBottom: 10 }}>
          {lang === "es" ? "¿Qué necesitas hoy?" : "What do you need today?"}
        </h2>
        <p style={{ color: C.gray600, marginBottom: 24, fontSize: 15 }}>{lang === "es" ? "Echa un vistazo a todos nuestros productos." : "Take a look at all our products."}</p>
        <BtnPrimary onClick={() => setPage("catálogo")} style={{ fontSize: 15, padding: "13px 36px" }}>{t.hero.cta1} →</BtnPrimary>
      </div>
    </div>
  );
}

/* ── CATÁLOGO ── */
function CatalogPage({ catalog, t, lang }) {
  const [cat, setCat] = useState("all");
  const visible = catalog.filter(p => p.visible);
  const cats = ["all", ...new Set(visible.map(p => p.category))];
  const filtered = cat === "all" ? visible : visible.filter(p => p.category === cat);
  return (
    <div className="fade" style={{ maxWidth: 1140, margin: "56px auto", padding: "0 20px" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <Tag>{t.catalog.tag}</Tag>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(32px,5vw,52px)", color: C.blue900 }}>{t.catalog.title}</h2>
        <div style={{ width: 48, height: 3, background: C.blue500, margin: "14px auto 0", borderRadius: 2 }} />
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 36 }}>
        {cats.map(c => (
          <button key={c} onClick={() => setCat(c)} style={{
            background: cat === c ? C.blue700 : C.white, color: cat === c ? C.white : C.gray600,
            border: `1.5px solid ${cat === c ? C.blue700 : C.gray200}`, padding: "7px 18px",
            borderRadius: 20, fontSize: 12, fontWeight: 500, transition: "all .15s",
          }}>{c === "all" ? t.catalog.all : c}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 20 }}>
        {filtered.map(p => (
          <div key={p._id} className="card-hover" style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ background: C.blue50, height: 130, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56 }}>{p.icon}</div>
            <div style={{ padding: 18 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: C.blue500, textTransform: "uppercase" }}>{p.category}</span>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 19, color: C.blue900, margin: "5px 0 7px" }}>{lang === "es" ? p.nameEs : p.nameEn}</h3>
              <p style={{ fontSize: 13, color: C.gray600, lineHeight: 1.6, marginBottom: 14 }}>{lang === "es" ? p.desc_es : p.desc_en}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "'Fraunces', serif", fontSize: 22, color: C.blue700, fontWeight: 700 }}>{p.price}</span>
                <span style={{ background: C.blue100, color: C.blue700, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 12 }}>
                  {lang === "es" ? "En stock" : "In stock"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <p style={{ textAlign: "center", color: C.gray400, padding: 48 }}>{t.catalog.noProducts}</p>}
    </div>
  );
}

/* ── GALERÍA ── */
function GalleryPage({ gallery, t, lang }) {
  const [sel, setSel] = useState(null);
  const visible = gallery.filter(g => g.visible);
  return (
    <div className="fade" style={{ maxWidth: 1140, margin: "56px auto", padding: "0 20px" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <Tag>{t.gallery.tag}</Tag>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(32px,5vw,52px)", color: C.blue900 }}>{t.gallery.title}</h2>
        <div style={{ width: 48, height: 3, background: C.blue500, margin: "14px auto 0", borderRadius: 2 }} />
      </div>
      <div style={{ columns: "3 220px", gap: 16 }}>
        {visible.map(img => (
          <div key={img._id} onClick={() => setSel(img)} style={{ marginBottom: 16, overflow: "hidden", borderRadius: 10, cursor: "zoom-in", border: `1px solid ${C.gray200}` }}>
            <img src={img.url} alt={lang === "es" ? img.caption_es : img.caption_en} style={{ width: "100%", display: "block", transition: "transform .3s" }}
              onMouseOver={e => e.target.style.transform = "scale(1.04)"}
              onMouseOut={e => e.target.style.transform = "scale(1)"}
              onError={e => { e.target.style.minHeight = "140px"; e.target.style.background = C.blue50; }} />
          </div>
        ))}
      </div>
      {visible.length === 0 && <p style={{ textAlign: "center", color: C.gray400, padding: 48 }}>{t.gallery.empty}</p>}
      {sel && (
        <div onClick={() => setSel(null)} style={{ position: "fixed", inset: 0, background: "rgba(10,20,40,.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: 820, width: "100%", textAlign: "center" }}>
            <img src={sel.url} alt="" style={{ maxWidth: "100%", maxHeight: "72vh", borderRadius: 10, objectFit: "contain" }} />
            <p style={{ color: C.white, marginTop: 12, fontFamily: "'Fraunces', serif", fontSize: 18, fontStyle: "italic" }}>{lang === "es" ? sel.caption_es : sel.caption_en}</p>
            <button onClick={() => setSel(null)} style={{ marginTop: 14, background: "none", border: "1px solid rgba(255,255,255,.4)", color: C.white, padding: "8px 24px", borderRadius: 6, fontSize: 12, letterSpacing: 1 }}>{t.gallery.close}</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── CONTACTO ── */
function ContactPage({ onSend, t }) {
  const [form, setForm] = useState({ name: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const [sending, setSending] = useState(false);
  const ch = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErr(""); };
  const send = async () => {
    if (!form.name || !form.message) { setErr(t.contact.errRequired); return; }
    setSending(true);
    await onSend(form);
    setSending(false);
    setSent(true);
  };
  return (
    <div className="fade" style={{ maxWidth: 640, margin: "56px auto", padding: "0 20px" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <Tag>{t.contact.tag}</Tag>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(32px,5vw,52px)", color: C.blue900 }}>{t.contact.title}</h2>
        <div style={{ width: 48, height: 3, background: C.blue500, margin: "14px auto 16px", borderRadius: 2 }} />
        <p style={{ color: C.gray600, fontSize: 15, lineHeight: 1.7 }}>{t.contact.sub}</p>
      </div>
      {sent ? (
        <div style={{ background: "#F0FFF4", border: "1px solid #86EFAC", borderRadius: 12, padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>✅</div>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, color: C.green, marginBottom: 8 }}>{t.contact.successTitle}</h3>
          <p style={{ color: C.gray600, fontSize: 14 }}>{t.contact.successText}</p>
          <BtnOutline onClick={() => { setSent(false); setForm({ name:"",phone:"",subject:"",message:"" }); }} style={{ marginTop: 20 }} color={C.green}>{t.contact.sendAnother}</BtnOutline>
        </div>
      ) : (
        <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12, padding: 32, boxShadow: "0 4px 24px rgba(0,0,0,.05)" }}>
          {err && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "10px 14px", color: C.red, fontSize: 13, marginBottom: 16 }}>{err}</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.gray600, letterSpacing: .5 }}>{t.contact.name}</span>
                <input value={form.name} onChange={e => ch("name", e.target.value)} placeholder={t.contact.namePh} />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.gray600, letterSpacing: .5 }}>{t.contact.phone}</span>
                <input type="tel" value={form.phone} onChange={e => ch("phone", e.target.value)} placeholder={t.contact.phonePh} />
              </label>
            </div>
            <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.gray600, letterSpacing: .5 }}>{t.contact.subject}</span>
              <input value={form.subject} onChange={e => ch("subject", e.target.value)} placeholder={t.contact.subjectPh} />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.gray600, letterSpacing: .5 }}>{t.contact.message}</span>
              <textarea value={form.message} onChange={e => ch("message", e.target.value)} rows={5} placeholder={t.contact.messagePh} style={{ resize: "vertical" }} />
            </label>
            <BtnPrimary onClick={send} style={{ width: "100%", padding: 13, fontSize: 15, marginTop: 4 }}>
              {sending ? t.contact.sending : `${t.contact.send} →`}
            </BtnPrimary>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   ADMIN PANEL
══════════════════════════════════════ */
function AdminPanel({ messages, setMessages, gallery, setGallery, catalog, setCatalog, schedule, setSchedule, onClose, t, lang, setLang, refreshData }) {
  const [tab, setTab] = useState("products");

  // --- Gallery state ---
  const [newUrl, setNewUrl] = useState("");
  const [newCapEs, setNewCapEs] = useState("");
  const [newCapEn, setNewCapEn] = useState("");
  const [editGalId, setEditGalId] = useState(null);
  const [editGal, setEditGal] = useState({});

  // --- Schedule state ---
  const [schedEdit, setSchedEdit] = useState(JSON.parse(JSON.stringify(schedule)));
  const [saved, setSaved] = useState(false);

  // --- Product form state ---
  const emptyProduct = { nameEs: "", nameEn: "", category: "", price: "", desc_es: "", desc_en: "", icon: "📦" };
  const [newProd, setNewProd] = useState({ ...emptyProduct });
  const [editingId, setEditingId] = useState(null);
  const [editProd, setEditProd] = useState({});

  const unread = messages.filter(m => !m.read).length;

  useEffect(() => {
    setSchedEdit(JSON.parse(JSON.stringify(schedule)));
  }, [schedule]);

  const TabBtn = ({ id, icon, label, badge }) => (
    <button onClick={() => setTab(id)} style={{
      background: tab === id ? C.blue700 : C.white, color: tab === id ? C.white : C.gray600,
      border: `1.5px solid ${tab === id ? C.blue700 : C.gray200}`, padding: "9px 18px",
      borderRadius: 8, fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 6, transition: "all .15s",
    }}>
      {icon} {label}
      {badge > 0 && <span style={{ background: C.red, color: "#fff", borderRadius: 10, fontSize: 10, padding: "1px 6px", marginLeft: 2 }}>{badge}</span>}
    </button>
  );

  // --- API actions ---
  const saveSchedule = async () => {
    const result = await api("/api/schedule", { method: "PUT", body: schedEdit });
    setSchedule(result);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const addImg = async () => {
    if (!newUrl.trim()) return;
    const img = await api("/api/gallery", { method: "POST", body: { url: newUrl.trim(), caption_es: newCapEs || "Sin título", caption_en: newCapEn || "No caption" } });
    setGallery(g => [...g, img]);
    setNewUrl(""); setNewCapEs(""); setNewCapEn("");
  };

  const toggleGalleryVisible = async (img) => {
    const updated = await api(`/api/gallery?id=${img._id}`, { method: "PUT", body: { visible: !img.visible } });
    setGallery(g => g.map(i => i._id === img._id ? updated : i));
  };

  const deleteGallery = async (id) => {
    await api(`/api/gallery?id=${id}`, { method: "DELETE" });
    setGallery(g => g.filter(i => i._id !== id));
  };

  const toggleGalleryFeatured = async (img) => {
    const updated = await api(`/api/gallery?id=${img._id}`, { method: "PUT", body: { featured: !img.featured } });
    setGallery(g => g.map(i => i._id === img._id ? updated : i));
  };

  const startEditGal = (img) => {
    setEditGalId(img._id);
    setEditGal({ url: img.url, caption_es: img.caption_es, caption_en: img.caption_en });
  };

  const saveEditGal = async () => {
    const updated = await api(`/api/gallery?id=${editGalId}`, { method: "PUT", body: editGal });
    setGallery(g => g.map(i => i._id === editGalId ? updated : i));
    setEditGalId(null);
    setEditGal({});
  };

  const toggleMsgRead = async (msg) => {
    const updated = await api(`/api/messages?id=${msg._id}`, { method: "PUT", body: { read: !msg.read } });
    setMessages(ms => ms.map(m => m._id === msg._id ? updated : m));
  };

  const toggleMsgHidden = async (msg) => {
    const updated = await api(`/api/messages?id=${msg._id}`, { method: "PUT", body: { hidden: !msg.hidden } });
    setMessages(ms => ms.map(m => m._id === msg._id ? updated : m));
  };

  const deleteMsg = async (id) => {
    await api(`/api/messages?id=${id}`, { method: "DELETE" });
    setMessages(ms => ms.filter(m => m._id !== id));
  };

  // Product actions
  const addProduct = async () => {
    if (!newProd.nameEs || !newProd.category || !newProd.price) return;
    const prod = await api("/api/products", { method: "POST", body: newProd });
    setCatalog(c => [...c, prod]);
    setNewProd({ ...emptyProduct });
  };

  const toggleProductVisible = async (p) => {
    const updated = await api(`/api/products?id=${p._id}`, { method: "PUT", body: { visible: !p.visible } });
    setCatalog(c => c.map(x => x._id === p._id ? updated : x));
  };

  const deleteProduct = async (id) => {
    await api(`/api/products?id=${id}`, { method: "DELETE" });
    setCatalog(c => c.filter(x => x._id !== id));
  };

  const startEdit = (p) => {
    setEditingId(p._id);
    setEditProd({ nameEs: p.nameEs, nameEn: p.nameEn, category: p.category, price: p.price, desc_es: p.desc_es, desc_en: p.desc_en, icon: p.icon });
  };

  const saveEdit = async () => {
    const updated = await api(`/api/products?id=${editingId}`, { method: "PUT", body: editProd });
    setCatalog(c => c.map(x => x._id === editingId ? updated : x));
    setEditingId(null);
    setEditProd({});
  };

  const inputStyle = { marginBottom: 0 };

  return (
    <div style={{ minHeight: "100vh", background: C.gray50 }}>
      <div className="fade" style={{ width: "100%", maxWidth: 920, margin: "0 auto", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ background: C.blue900, padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 1 }}>
          <div>
            <h2 style={{ fontFamily: "'Fraunces', serif", color: C.white, fontSize: 22 }}>{t.admin.title}</h2>
            <p style={{ fontSize: 12, color: C.blue300 }}>{t.admin.subtitle}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setLang(l => l === "es" ? "en" : "es")} style={{
              background: "rgba(255,255,255,.15)", border: "none", borderRadius: 20, padding: "6px 14px", fontSize: 13,
              color: C.white, fontWeight: 500, display: "flex", alignItems: "center", gap: 6, cursor: "pointer",
            }}>
              <span>{t.flag}</span> {t.switchLang}
            </button>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,.1)", border: "none", color: C.white, width: 36, height: 36, borderRadius: 8, fontSize: 16 }}>✕</button>
          </div>
        </div>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 10, padding: "14px 24px", background: C.white, borderBottom: `1px solid ${C.gray200}`, flexWrap: "wrap" }}>
          <TabBtn id="products" icon="📦" label={t.admin.tabs.products} />
          <TabBtn id="messages" icon="✉" label={t.admin.tabs.messages} badge={unread} />
          <TabBtn id="gallery" icon="🖼" label={t.admin.tabs.gallery} />
          <TabBtn id="schedule" icon="🕐" label={t.admin.tabs.schedule} />
        </div>
        <div style={{ padding: 24, flex: 1 }}>

          {/* ── PRODUCTOS ── */}
          {tab === "products" && (
            <div>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, color: C.blue900, marginBottom: 20 }}>{t.admin.prod.title}</h3>

              {/* Formulario añadir */}
              <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 10, padding: 20, marginBottom: 24 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: C.gray400, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>{t.admin.prod.addTitle}</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                  <input value={newProd.nameEs} onChange={e => setNewProd(p => ({...p, nameEs: e.target.value}))} placeholder={t.admin.prod.nameEs + " *"} style={inputStyle} />
                  <input value={newProd.nameEn} onChange={e => setNewProd(p => ({...p, nameEn: e.target.value}))} placeholder={t.admin.prod.nameEn} style={inputStyle} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 80px", gap: 10, marginBottom: 10 }}>
                  <input value={newProd.category} onChange={e => setNewProd(p => ({...p, category: e.target.value}))} placeholder={t.admin.prod.category + " *"} style={inputStyle} />
                  <input value={newProd.price} onChange={e => setNewProd(p => ({...p, price: e.target.value}))} placeholder={t.admin.prod.price + " *"} style={inputStyle} />
                  <input value={newProd.icon} onChange={e => setNewProd(p => ({...p, icon: e.target.value}))} placeholder="📦" style={{ ...inputStyle, textAlign: "center", fontSize: 20 }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                  <input value={newProd.desc_es} onChange={e => setNewProd(p => ({...p, desc_es: e.target.value}))} placeholder={t.admin.prod.descEs} style={inputStyle} />
                  <input value={newProd.desc_en} onChange={e => setNewProd(p => ({...p, desc_en: e.target.value}))} placeholder={t.admin.prod.descEn} style={inputStyle} />
                </div>
                <BtnPrimary onClick={addProduct} style={{ padding: "9px 20px" }}>{t.admin.prod.add}</BtnPrimary>
              </div>

              {/* Lista de productos */}
              {catalog.length === 0 && <p style={{ textAlign: "center", color: C.gray400, padding: 32 }}>{t.admin.prod.empty}</p>}
              {catalog.map(p => (
                <div key={p._id} style={{
                  background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 10,
                  padding: 18, marginBottom: 12, opacity: p.visible ? 1 : .5,
                }}>
                  {editingId === p._id ? (
                    /* Modo edición */
                    <div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                        <input value={editProd.nameEs} onChange={e => setEditProd(ep => ({...ep, nameEs: e.target.value}))} placeholder={t.admin.prod.nameEs} />
                        <input value={editProd.nameEn} onChange={e => setEditProd(ep => ({...ep, nameEn: e.target.value}))} placeholder={t.admin.prod.nameEn} />
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 80px", gap: 10, marginBottom: 10 }}>
                        <input value={editProd.category} onChange={e => setEditProd(ep => ({...ep, category: e.target.value}))} placeholder={t.admin.prod.category} />
                        <input value={editProd.price} onChange={e => setEditProd(ep => ({...ep, price: e.target.value}))} placeholder={t.admin.prod.price} />
                        <input value={editProd.icon} onChange={e => setEditProd(ep => ({...ep, icon: e.target.value}))} style={{ textAlign: "center", fontSize: 20 }} />
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                        <input value={editProd.desc_es} onChange={e => setEditProd(ep => ({...ep, desc_es: e.target.value}))} placeholder={t.admin.prod.descEs} />
                        <input value={editProd.desc_en} onChange={e => setEditProd(ep => ({...ep, desc_en: e.target.value}))} placeholder={t.admin.prod.descEn} />
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <BtnPrimary onClick={saveEdit} style={{ padding: "7px 18px", fontSize: 13 }}>{t.admin.prod.save}</BtnPrimary>
                        <BtnOutline onClick={() => setEditingId(null)} style={{ padding: "7px 18px", fontSize: 13 }}>{t.admin.prod.cancel}</BtnOutline>
                      </div>
                    </div>
                  ) : (
                    /* Modo visualización */
                    <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 32 }}>{p.icon}</span>
                      <div style={{ flex: 1, minWidth: 180 }}>
                        <div style={{ fontWeight: 600, color: C.gray800, fontSize: 15 }}>{p.nameEs} {p.nameEn && <span style={{ color: C.gray400, fontWeight: 400, fontSize: 13 }}>/ {p.nameEn}</span>}</div>
                        <div style={{ fontSize: 12, color: C.blue500, marginTop: 2 }}>{p.category}</div>
                      </div>
                      <span style={{ fontFamily: "'Fraunces', serif", fontSize: 18, color: C.blue700, fontWeight: 700, minWidth: 60 }}>{p.price}</span>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => startEdit(p)}
                          style={{ background: C.blue100, color: C.blue700, border: "none", padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 500 }}>{t.admin.prod.edit}</button>
                        <button onClick={() => toggleProductVisible(p)}
                          style={{ background: p.visible ? "#FEF2F2" : "#F0FFF4", color: p.visible ? C.red : C.green, border: "none", padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 500 }}>
                          {p.visible ? t.admin.prod.hide : t.admin.prod.show}
                        </button>
                        <button onClick={() => deleteProduct(p._id)}
                          style={{ background: "#FEF2F2", color: C.red, border: "none", padding: "6px 10px", borderRadius: 6, fontSize: 12 }}>🗑</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── MENSAJES ── */}
          {tab === "messages" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, color: C.blue900 }}>{t.admin.msg.title}</h3>
                <span style={{ fontSize: 12, color: C.gray400 }}>{messages.length} {t.admin.msg.visible} · {unread} {t.admin.msg.unread}</span>
              </div>
              {messages.length === 0 && <p style={{ color: C.gray400, textAlign: "center", padding: 40 }}>{t.admin.msg.empty}</p>}
              {messages.map(msg => (
                <div key={msg._id} style={{
                  background: msg.read ? C.white : "#EFF6FF",
                  border: `1px solid ${msg.read ? C.gray200 : C.blue300}`,
                  borderLeft: `4px solid ${msg.read ? C.gray200 : C.blue500}`,
                  borderRadius: 10, padding: 18, marginBottom: 12,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 600, color: C.gray800, fontSize: 15 }}>{msg.name}</span>
                      {msg.phone && <span style={{ fontSize: 12, color: C.gray400 }}>📞 {msg.phone}</span>}
                      {!msg.read && <span style={{ background: C.blue700, color: C.white, fontSize: 10, padding: "2px 8px", borderRadius: 10, fontWeight: 700 }}>{t.admin.msg.new}</span>}
                    </div>
                    <span style={{ fontSize: 12, color: C.gray400 }}>{new Date(msg.createdAt).toLocaleDateString("es-ES")}</span>
                  </div>
                  {msg.subject && <p style={{ fontSize: 12, fontWeight: 600, color: C.blue700, marginBottom: 6 }}>{t.admin.msg.subject} {msg.subject}</p>}
                  <p style={{ fontSize: 14, color: C.gray600, lineHeight: 1.65, marginBottom: 14 }}>{msg.message}</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button onClick={() => toggleMsgRead(msg)}
                      style={{ background: !msg.read ? "#F0FFF4" : C.gray100, color: !msg.read ? C.green : C.gray600, border: `1px solid ${!msg.read ? "#86EFAC" : C.gray200}`, padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 500 }}>
                      {!msg.read ? t.admin.msg.markRead : t.admin.msg.markUnread}
                    </button>
                    <button onClick={() => deleteMsg(msg._id)}
                      style={{ background: "#FEF2F2", color: C.red, border: `1px solid #FECACA`, padding: "6px 12px", borderRadius: 6, fontSize: 12, marginLeft: "auto" }}>{t.admin.msg.delete}</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── GALERÍA ── */}
          {tab === "gallery" && (
            <div>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, color: C.blue900, marginBottom: 20 }}>{t.admin.gal.title}</h3>
              <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 10, padding: 20, marginBottom: 24 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: C.gray400, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>{t.admin.gal.addTitle}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <input value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder={t.admin.gal.urlPh} />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <input value={newCapEs} onChange={e => setNewCapEs(e.target.value)} placeholder="Descripción en español" />
                    <input value={newCapEn} onChange={e => setNewCapEn(e.target.value)} placeholder="Caption in English" />
                  </div>
                  <BtnPrimary onClick={addImg} style={{ alignSelf: "flex-start", padding: "9px 20px" }}>{t.admin.gal.add}</BtnPrimary>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 14 }}>
                {gallery.map(img => (
                  <div key={img._id} style={{ border: `1.5px solid ${img.visible ? C.gray200 : C.gray100}`, borderRadius: 10, overflow: "hidden", opacity: img.visible ? 1 : .5 }}>
                    <img src={editGalId === img._id ? editGal.url : img.url} alt="" style={{ width: "100%", height: 140, objectFit: "cover", display: "block" }} onError={e => { e.target.style.background = C.blue50; e.target.style.height = "140px"; }} />
                    <div style={{ padding: "10px 12px" }}>
                      {editGalId === img._id ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <input value={editGal.url} onChange={e => setEditGal(eg => ({...eg, url: e.target.value}))} placeholder="URL" style={{ fontSize: 11, padding: "6px 8px" }} />
                          <input value={editGal.caption_es} onChange={e => setEditGal(eg => ({...eg, caption_es: e.target.value}))} placeholder="🇪🇸 Descripción" style={{ fontSize: 11, padding: "6px 8px" }} />
                          <input value={editGal.caption_en} onChange={e => setEditGal(eg => ({...eg, caption_en: e.target.value}))} placeholder="🇬🇧 Caption" style={{ fontSize: 11, padding: "6px 8px" }} />
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={saveEditGal} style={{ flex:1, background: C.blue700, border:"none", color:C.white, padding:"5px", borderRadius:5, fontSize:11, fontWeight:500 }}>{t.admin.gal.save}</button>
                            <button onClick={() => setEditGalId(null)} style={{ flex:1, background: C.gray100, border:"none", color:C.gray600, padding:"5px", borderRadius:5, fontSize:11 }}>{t.admin.gal.cancel}</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p style={{ fontSize: 11, color: C.gray600, marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>🇪🇸 {img.caption_es}</p>
                          <p style={{ fontSize: 11, color: C.gray400, marginBottom: 8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>🇬🇧 {img.caption_en}</p>
                          <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                            <button onClick={() => toggleGalleryFeatured(img)}
                              style={{ flex:1, background: img.featured ? C.blue100 : C.gray100, border: img.featured ? `1px solid ${C.blue300}` : "none", color: img.featured ? C.blue700 : C.gray400, padding:"5px", borderRadius:5, fontSize:10, fontWeight:600 }}>
                              {img.featured ? `⭐ ${t.admin.gal.featured}` : t.admin.gal.notFeatured}
                            </button>
                          </div>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={() => startEditGal(img)}
                              style={{ flex:1, background: C.blue100, border:"none", color:C.blue700, padding:"5px", borderRadius:5, fontSize:11, fontWeight:500 }}>{t.admin.gal.edit}</button>
                            <button onClick={() => toggleGalleryVisible(img)}
                              style={{ flex:1, background: img.visible ? "#FEF2F2" : "#F0FFF4", border:"none", color: img.visible ? C.red : C.green, padding:"5px", borderRadius:5, fontSize:11, fontWeight:500 }}>
                              {img.visible ? t.admin.gal.hide : t.admin.gal.show}
                            </button>
                            <button onClick={() => deleteGallery(img._id)}
                              style={{ background:"#FEF2F2", border:"none", color:C.red, padding:"5px 8px", borderRadius:5, fontSize:11 }}>🗑</button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {gallery.length === 0 && <p style={{ textAlign:"center", color:C.gray400, padding:32 }}>{t.admin.gal.empty}</p>}
            </div>
          )}

          {/* ── HORARIO ── */}
          {tab === "schedule" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
                <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, color: C.blue900 }}>{t.admin.sched.title}</h3>
                {saved && <span style={{ color: C.green, fontSize: 13, fontWeight: 600 }}>{t.admin.sched.saved}</span>}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {Object.entries(schedEdit).map(([dia, val]) => (
                  <div key={dia} style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 150 }}>
                      <div onClick={() => setSchedEdit(s => ({...s, [dia]: {...s[dia], open: !s[dia].open}}))}
                        style={{ width: 40, height: 22, borderRadius: 11, background: val.open ? C.blue700 : C.gray200, position: "relative", cursor: "pointer", flexShrink: 0, transition: "background .2s" }}>
                        <span style={{ position: "absolute", top: 3, left: val.open ? 20 : 3, width: 16, height: 16, borderRadius: "50%", background: C.white, transition: "left .2s", boxShadow: "0 1px 4px rgba(0,0,0,.2)" }} />
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 600, color: C.gray800 }}>{t.days[dia]}</span>
                    </div>
                    {val.open ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 12, color: C.gray400 }}>{t.admin.sched.from}</span>
                        <input type="time" value={val.desde} onChange={e => setSchedEdit(s => ({...s, [dia]: {...s[dia], desde: e.target.value}}))} style={{ width: 120 }} />
                        <span style={{ fontSize: 12, color: C.gray400 }}>{t.admin.sched.to}</span>
                        <input type="time" value={val.hasta} onChange={e => setSchedEdit(s => ({...s, [dia]: {...s[dia], hasta: e.target.value}}))} style={{ width: 120 }} />
                      </div>
                    ) : (
                      <span style={{ fontSize: 13, color: C.gray400, fontStyle: "italic" }}>{t.admin.sched.closedLabel}</span>
                    )}
                  </div>
                ))}
              </div>
              <BtnPrimary onClick={saveSchedule} style={{ width: "100%", marginTop: 20, padding: 14, fontSize: 14 }}>{t.admin.sched.save}</BtnPrimary>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   APP PRINCIPAL
══════════════════════════════════════ */
export default function App() {
  const [lang, setLang] = useState("en");
  const [page, setPage] = useState("inicio");
  const [adminAuth, setAdminAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const [messages, setMessages] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [schedule, setSchedule] = useState({});

  const t = T[lang];

  // Hash routing for admin
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const handler = () => setHash(window.location.hash);
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  const isAdminRoute = hash === "#/admin" || hash === "#admin";

  // Load all data from API
  const loadData = useCallback(async () => {
    try {
      const [prods, gal, msgs, sched] = await Promise.all([
        api("/api/products"),
        api("/api/gallery"),
        api("/api/messages"),
        api("/api/schedule"),
      ]);
      setCatalog(prods);
      setGallery(gal);
      setMessages(msgs);
      setSchedule(sched);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const exitAdmin = () => {
    setAdminAuth(false);
    window.location.hash = "";
  };

  const sendMessage = async (form) => {
    const msg = await api("/api/messages", { method: "POST", body: form });
    setMessages(ms => [msg, ...ms]);
  };

  const handleLogin = async (password) => {
    const res = await api("/api/login", { method: "POST", body: { password } });
    if (res.ok) {
      setAdminAuth(true);
      await loadData(); // refresh data on admin login
    }
    return res;
  };

  if (loading) {
    return (
      <>
        <style>{css}</style>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.blue50 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
            <p style={{ color: C.gray600, fontSize: 16 }}>Cargando...</p>
          </div>
        </div>
      </>
    );
  }

  if (isAdminRoute) {
    if (!adminAuth) {
      return (
        <>
          <style>{css}</style>
          <div style={{ minHeight: "100vh", background: C.blue50, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div className="fade" style={{ background: C.white, borderRadius: 14, padding: 44, width: "100%", maxWidth: 400, boxShadow: "0 24px 80px rgba(0,0,0,.12)", border: `1px solid ${C.gray200}` }}>
              <div style={{ textAlign: "center", marginBottom: 30 }}>
                <div style={{ width: 60, height: 60, background: C.blue100, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px" }}>🔐</div>
                <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, color: C.blue900 }}>{t.admin.title}</h2>
                <p style={{ fontSize: 12, color: C.gray400, marginTop: 6 }}>{t.admin.passHint}</p>
              </div>
              <AdminLoginForm onLogin={handleLogin} onBack={exitAdmin} t={t} lang={lang} />
            </div>
          </div>
        </>
      );
    }
    return (
      <>
        <style>{css}</style>
        <AdminPanel
          messages={messages} setMessages={setMessages}
          gallery={gallery} setGallery={setGallery}
          catalog={catalog} setCatalog={setCatalog}
          schedule={schedule} setSchedule={setSchedule}
          onClose={exitAdmin} t={t} lang={lang} setLang={setLang}
          refreshData={loadData}
        />
      </>
    );
  }

  return (
    <>
      <style>{css}</style>
      <Navbar page={page} setPage={setPage} lang={lang} setLang={setLang} t={t} />
      <main style={{ minHeight: "calc(100vh - 62px)" }}>
        {page === "inicio"    && <HomePage    setPage={setPage} schedule={schedule} gallery={gallery} t={t} lang={lang} />}
        {page === "catálogo"  && <CatalogPage catalog={catalog} t={t} lang={lang} />}
        {page === "galería"   && <GalleryPage gallery={gallery} t={t} lang={lang} />}
        {page === "contacto"  && <ContactPage onSend={sendMessage} t={t} />}
      </main>
      <Footer schedule={schedule} t={t} lang={lang} />
    </>
  );
}

/* ── Login form ── */
function AdminLoginForm({ onLogin, onBack, t, lang }) {
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const tryLogin = async () => {
    setLoading(true);
    try {
      await onLogin(pass);
    } catch {
      setErr(t.admin.wrongPass);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {err && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 7, padding: "9px 13px", color: C.red, fontSize: 13 }}>{err}</div>}
      <input type="password" value={pass} onChange={e => { setPass(e.target.value); setErr(""); }} onKeyDown={e => e.key === "Enter" && tryLogin()} placeholder={t.admin.passLabel} autoFocus />
      <BtnPrimary onClick={tryLogin} style={{ width: "100%", padding: 13, fontSize: 14 }}>
        {loading ? "..." : t.admin.enter}
      </BtnPrimary>
      <button onClick={onBack} style={{ background: "none", border: "none", color: C.gray400, fontSize: 13, cursor: "pointer", marginTop: 4 }}>
        ← {lang === "es" ? "Volver a la tienda" : "Back to shop"}
      </button>
    </div>
  );
}
