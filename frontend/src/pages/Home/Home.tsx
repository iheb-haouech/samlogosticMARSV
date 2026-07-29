import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./Home.scss";

const BRAND_LOGO = "/png/logosam.png";

const CountingNumber = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const end = target;
          const totalMiliseconds = 1200;
          const increment = end / (totalMiliseconds / 16);

          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setValue(end);
              clearInterval(timer);
            } else {
              setValue(Math.floor(start));
            }
          }, 16);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{value}{suffix}</span>;
};

const Home = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("reveal-active");
        });
      },
      { threshold: 0.05 }
    );
    document.querySelectorAll(".reveal-view").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleScrollTo = (id: string) => {
    setIsMenuOpen(false);
    const element = document.querySelector(id);
    if (element) {
      const yOffset = -110;
      const yPosition = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: yPosition, behavior: "smooth" });
    }
  };

  return (
    <div className="premium-layout">
      {/* Floating Island Navbar */}
      <div className={`nav-container-holder ${isScrolled ? "is-scrolled" : ""}`}>
        <header className="innovative-floating-bar">
          <div className="brand-signature" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="icon-shield-rotating brand-logo-large">
              <img src={BRAND_LOGO} alt="SAM LOGISTIC" />
              <div className="spinning-ring"></div>
            </div>
            <div className="brand-info">
              <span className="title-top">SAM</span>
              <span className="title-sub">LOGISTIC</span>
            </div>
          </div>

          <nav className={`navigation-drawer ${isMenuOpen ? "drawer-visible" : ""}`}>
            <div className="link-cluster">
              <a href="#about" onClick={(e) => { e.preventDefault(); handleScrollTo("#about"); }}>
                <span className="link-dot"></span>{t("homeCompanySection")}
              </a>
              <a href="#services" onClick={(e) => { e.preventDefault(); handleScrollTo("#services"); }}>
                <span className="link-dot"></span>{t("homeServicesTitle")}
              </a>
              <a href="#solutions" onClick={(e) => { e.preventDefault(); handleScrollTo("#solutions"); }}>
                <span className="link-dot"></span>{t("Solutions")}
              </a>
              <a href="#tracking" onClick={(e) => { e.preventDefault(); handleScrollTo("#tracking"); }}>
                <span className="link-dot"></span>{t("Suivi")}
              </a>
            </div>

            <div className="action-cluster">
              <div className="pill-switcher">
                <button className={i18n.language === "fr" ? "pill-active" : ""} onClick={() => i18n.changeLanguage("fr")}>FR</button>
                <button className={i18n.language === "en" ? "pill-active" : ""} onClick={() => i18n.changeLanguage("en")}>EN</button>
              </div>
              <button className="neon-action-btn" onClick={() => navigate("/login")}>
                {t("Client Portal")}
              </button>
            </div>
          </nav>

          <button className={`menu-trigger ${isMenuOpen ? "trigger-close" : ""}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </button>
        </header>
      </div>

      <main>
        {/* Hero Section with Logo */}
        <section className="asymmetric-hero">
          <div className="infinite-bg-rotation"></div>

          <div className="hero-split-grid">
            <div className="hero-text-panel">
              <div className="status-tagline">
                <span className="pulse-dot"></span>
                <span className="tag-text">{t("homeHeroTagline")}</span>
              </div>
              <h1 className="hero-display-title">
                {t("homeHeroTitle")} <br />
                <span className="gradient-highlight">{t("homeHeroSubtitle")}</span>
              </h1>
              <p className="hero-descriptive-text">
                {t("homeHeroDescription")}
              </p>
              <div className="hero-interactive-buttons">
                <button className="primary-glass-btn" onClick={() => navigate("/signup")}>
                  {t("homeCTA")} <span className="arrow-vector">→</span>
                </button>
                <button className="secondary-blur-btn" onClick={() => window.open("https://wa.me/21625294513", "_blank")}>
                  {t("Live Engineering Support")}
                </button>
              </div>
            </div>

            <div className="hero-media-panel">
              <div className="geometric-frame logo-showcase">
                <img src={BRAND_LOGO} alt="SAM LOGISTIC" className="hero-logo" />
                <div className="floating-metric-badge">
                  <span className="badge-value">99.8%</span>
                  <span className="badge-label">{t("SLA Integrity")}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* KPIs Section */}
        <section className="analytics-nodes reveal-view" id="kpis">
          <div className="nodes-container">
            <div className="node-block">
              <div className="node-metric"><CountingNumber target={10000} suffix="+" /></div>
              <div className="node-caption">{t("homeKPI1Label")}</div>
            </div>
            <div className="node-block">
              <div className="node-metric"><CountingNumber target={500} suffix="+" /></div>
              <div className="node-caption">{t("homeKPI2Label")}</div>
            </div>
            <div className="node-block highlight-node">
              <div className="node-metric"><CountingNumber target={99} suffix="%" /></div>
              <div className="node-caption">{t("homeKPI3Label")}</div>
            </div>
            <div className="node-block">
              <div className="node-metric">24/7</div>
              <div className="node-caption">{t("homeKPI4Label")}</div>
            </div>
          </div>
        </section>

        {/* About / Company Section */}
        <section className="intersect-showcase reveal-view" id="about">
          <div className="intersect-grid">
            <div className="intersect-visual logo-showcase-large">
              <img src={BRAND_LOGO} alt="SAM LOGISTIC" className="about-logo" />
            </div>
            <div className="intersect-copy-deck">
              <div className="context-eyebrow">{t("homeCompanySection")}</div>
              <h2>SAM LOGISTIC</h2>
              <div className="divider-line"></div>
              <p>{t("homeCompanyDesc")}</p>
              <button className="text-link-btn" onClick={() => navigate("/signup")}>
                {t("homeCTA")} <span className="link-arrow">→</span>
              </button>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="offset-features reveal-view" id="services">
          <div className="section-header-centered">
            <span className="context-eyebrow">{t("homeServicesTitle")}</span>
            <h2>{t("Operational models configured to scale.")}</h2>
          </div>
          <div className="features-inner-container">
            <div className="feature-blade">
              <div className="blade-index">01</div>
              <div className="blade-content">
                <h3>{t("homeService1Title")}</h3>
                <p>{t("homeService1Desc")}</p>
              </div>
            </div>
            <div className="feature-blade">
              <div className="blade-index">02</div>
              <div className="blade-content">
                <h3>{t("homeService2Title")}</h3>
                <p>{t("homeService2Desc")}</p>
              </div>
            </div>
            <div className="feature-blade">
              <div className="blade-index">03</div>
              <div className="blade-content">
                <h3>{t("homeService3Title")}</h3>
                <p>{t("homeService3Desc")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* B2B & B2C Solutions */}
        <section className="solutions-split reveal-view" id="solutions">
          <div className="section-header-centered">
            <span className="context-eyebrow">{t("Solutions")}</span>
            <h2>{t("Operational models configured to scale.")}</h2>
          </div>

          <div className="solutions-grid">
            {/* B2B Card */}
            <div className="solution-card solution-b2b">
              <div className="solution-logo-area">
                <img src={BRAND_LOGO} alt="B2B" className="solution-logo" />
                <span className="solution-badge b2b-badge">B2B</span>
              </div>
              <div className="solution-body">
                <h3>{t("homeB2BSection")}</h3>
                <p>{t("homeB2BDesc")}</p>
                <ul className="solution-features">
                  <li>✓ {t("homeB2BFeature1")}</li>
                  <li>✓ {t("homeB2BFeature2")}</li>
                  <li>✓ {t("homeB2BFeature3")}</li>
                </ul>
                <button className="solution-cta" onClick={() => navigate("/signup")}>
                  {t("Initialize Request")} →
                </button>
              </div>
            </div>

            {/* B2C Card */}
            <div className="solution-card solution-b2c">
              <div className="solution-logo-area">
                <img src={BRAND_LOGO} alt="B2C" className="solution-logo" />
                <span className="solution-badge b2c-badge">B2C</span>
              </div>
              <div className="solution-body">
                <h3>{t("homeB2CSection")}</h3>
                <p>{t("homeB2CDesc")}</p>
                <ul className="solution-features">
                  <li>✓ {t("homeB2CFeature1")}</li>
                  <li>✓ {t("homeB2CFeature2")}</li>
                  <li>✓ {t("homeB2CFeature3")}</li>
                </ul>
                <button className="solution-cta" onClick={() => navigate("/signup")}>
                  {t("homeCTA")} →
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="industrial-gateway reveal-view" id="tracking">
          <div className="gateway-inner-box">
            <div className="gateway-grid">
              <div className="gateway-text">
                <span className="context-eyebrow">{t("mobileInfrastructure")}</span>
                <h2>{t("mobileInfrastructureTitle")}</h2>
                <p>{t("mobileInfrastructureDesc")}</p>
              </div>
              <div className="gateway-action">
                <a href="/SamLogisticApp.apk" className="industrial-download-btn" download>
                  <span className="btn-icon">📦</span> {t("Download System APK")}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="brutalist-footer">
        <div className="footer-layout">
          <div className="footer-left">
            <img src={BRAND_LOGO} alt="SAM LOGISTIC" className="footer-logo" />
            <p className="footer-tagline">© 2026 SAM LOGISTIC. {t("All operational interfaces reserved.")}</p>
          </div>
          <div className="footer-right">
            <div className="footer-navigation-links">
              <a href="#about" onClick={(e) => { e.preventDefault(); handleScrollTo("#about"); }}>{t("homeCompanySection")}</a>
              <a href="#services" onClick={(e) => { e.preventDefault(); handleScrollTo("#services"); }}>{t("homeServicesTitle")}</a>
              <a href="#solutions" onClick={(e) => { e.preventDefault(); handleScrollTo("#solutions"); }}>{t("Solutions")}</a>
              <a href="#tracking" onClick={(e) => { e.preventDefault(); handleScrollTo("#tracking"); }}>{t("Suivi")}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;