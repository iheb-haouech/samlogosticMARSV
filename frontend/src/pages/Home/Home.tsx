import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./Home.scss";
import { useNavigate } from "react-router-dom";
import { BRAND_SUPPORT_EMAIL } from "../../constants/branding";
import warehouse from "../../assets/warehouse.png";
import plane from "../../assets/plane.png";
import client from "../../assets/client.png";
import map from "../../assets/map.png";
import tracking from "../../assets/tracking.png";

const Home = () => {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll(".section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.18 }
    );
    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const openWhatsApp = () => {
    window.open("https://wa.me/21625294513", "_blank", "noopener,noreferrer");
  };

  const switchToFrench = () => i18n.changeLanguage("fr");
  const switchToEnglish = () => i18n.changeLanguage("en");

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="home">
      <header className={`header ${scrolled ? "scrolled" : ""}`} role="banner">
        <div className="container nav-container">
          <div className="brand">
            <img src="/png/logoslogan.png" alt="SAM LOGISTIC" className="nav-logo" />
          </div>
          
          <button 
            className={`mobile-menu-btn ${mobileMenuOpen ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <nav className={`nav ${mobileMenuOpen ? 'nav-open' : ''}`} role="navigation" aria-label="Main navigation">
            <div className="nav-links">
              <a href="#services" onClick={() => handleNavClick("#services")}>{t("Services")}</a>
              <a href="#solutions" onClick={() => handleNavClick("#solutions")}>{t("Solutions")}</a>
              <a href="#tracking" onClick={() => handleNavClick("#tracking")}>{t("Tracking")}</a>
              <a href="#contact" onClick={() => handleNavClick("#contact")}>{t("Contact")}</a>
            </div>
            <div className="nav-actions">
              <div className="lang-switch" role="group" aria-label="Language selection">
                <button className={`lang-btn ${i18n.language === 'fr' ? 'active' : ''}`} onClick={switchToFrench} aria-label="French">FR</button>
                <button className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`} onClick={switchToEnglish} aria-label="English">EN</button>
              </div>
              <button className="login-btn" onClick={() => navigate("/login")} aria-label="Log in">
                {t("Log in")}
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-overlay">
            <div className="hero-content">
              <span className="hero-badge">24/7 • Tunisia • Global</span>
              <h1 id="hero-title">{t("Fast logistics, trusted delivery.")}</h1>
              <p className="hero-subtitle">
                {t("Import, export, B2B and B2C delivery with 24/7 customer service and a future app for tracking.")}
              </p>
              <div className="hero-actions">
                <button className="cta-btn" onClick={() => navigate("/login")}>
                  {t("Log in")}
                </button>
                <button className="ghost-btn whatsapp-btn" onClick={openWhatsApp}>
                  {t("Contact on WhatsApp")}
                </button>
              </div>
            </div>
            <div className="hero-card">
              <div className="hero-card-top">
                <span className="mini-label">{t("Trusted partner")}</span>
                <h3>SAM LOGISTIC</h3>
              </div>
              <div className="hero-card-list">
                <div>
                  <strong>B2B / B2C</strong>
                  <span>{t("Delivery for companies and individuals.")}</span>
                </div>
                <div>
                  <strong>{t("Import / Export")}</strong>
                  <span>{t("National and international logistics.")}</span>
                </div>
                <div>
                  <strong>24/7 Support</strong>
                  <span>{t("Service client available day and night.")}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section stats">
          <div className="container stats-grid">
            <div className="stat-card">
              <strong>24/7</strong>
              <span>{t("Service client disponible à tout moment")}</span>
            </div>
            <div className="stat-card">
              <strong>B2B / B2C</strong>
              <span>{t("Delivery solutions for businesses and private clients")}</span>
            </div>
            <div className="stat-card">
              <strong>{t("Import / Export")}</strong>
              <span>{t("National and international operations")}</span>
            </div>
            <div className="stat-card">
              <strong>{t("Future App")}</strong>
              <span>{t("We are building a user app for tracking and services")}</span>
            </div>
          </div>
        </section>

        <section className="section split" id="services">
          <div className="container split-grid">
            <div className="split-copy">
              <span className="eyebrow">OUR SERVICES</span>
              <h2>{t("Clear logistics, fast execution.")}</h2>
              <p>{t("We provide import and export services across Tunisia and abroad.")}</p>
              <p>{t("From B2B deliveries to B2C shipments, SAM LOGISTIC is designed to support businesses, shops, and individuals with dependable logistics.")}</p>
            </div>
            <div className="split-media panel">
              <img src={warehouse} alt={t("Warehouse logistics")} />
            </div>
          </div>
        </section>

        <section className="section cards-section" id="solutions">
          <div className="container">
            <div className="section-title">
              <span className="eyebrow">WHAT WE DO BEST</span>
              <h2>{t("Built for national and international logistics.")}</h2>
            </div>
            <div className="cards-grid">
              <article className="info-card">
                <img src={plane} alt={t("International transport")} />
                <h3>{t("Import & Export")}</h3>
                <p>{t("We handle national and international cargo flows with reliable coordination.")}</p>
              </article>
              <article className="info-card">
                <img src={map} alt={t("Coverage map")} />
                <h3>{t("B2B and B2C Delivery")}</h3>
                <p>{t("Flexible delivery services for companies, merchants, and individual clients.")}</p>
              </article>
              <article className="info-card">
                <img src={client} alt={t("Client support")} />
                <h3>{t("24/7 Customer Service")}</h3>
                <p>{t("Our client support is available all day, every day, to help and guide you.")}</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section split reverse" id="tracking">
          <div className="container split-grid">
            <div className="split-copy">
              <span className="eyebrow">TRACKING & APP</span>
              <h2>{t("Technology that keeps clients informed.")}</h2>
              <p>{t("We are building a dedicated application for users so they can track shipments, manage requests, and access logistics services with ease.")}</p>
              <p>{t("Real-time visibility, simple navigation, and clear updates will make the experience smoother for every customer.")}</p>
            </div>
            <div className="split-media panel">
              <img src={tracking} alt={t("Shipment tracking")} />
            </div>
          </div>
        </section>

        <section className="section quote">
          <div className="container quote-inner">
            <h2>SAM LOGISTIC. {t("Fast, trusted, available 24/7.")}</h2>
            <p>{t("Import, export, national delivery, international delivery, B2B and B2C.")}</p>
            <div className="hero-actions">
              <button className="cta-btn" onClick={() => navigate("/login")}>
                {t("Log in")}
              </button>
              <button className="ghost-btn whatsapp-btn" onClick={openWhatsApp}>
                {t("Contact on WhatsApp")}
              </button>
            </div>
          </div>
        </section>
      </main>

      <section id="contact" className="section contact">
        <div className="container contact-card">
          <span className="eyebrow">CONTACT</span>
          <h2>{t("We are ready to help.")}</h2>
          <p>2063 Cité Ennasime N.M Ben Arous, Tunisie</p>
          <p>Phone / WhatsApp: +216 25 294 513</p>
          <p>Email: {BRAND_SUPPORT_EMAIL}</p>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <p>© 2026 SAM LOGISTIC, Inc.</p>
          <div className="footer-links">
            <a href="#services" onClick={() => handleNavClick("#services")}>{t("Services")}</a>
            <a href="#solutions" onClick={() => handleNavClick("#solutions")}>{t("Solutions")}</a>
            <a href="#tracking" onClick={() => handleNavClick("#tracking")}>{t("Tracking")}</a>
            <a href="#contact" onClick={() => handleNavClick("#contact")}>{t("Contact")}</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;