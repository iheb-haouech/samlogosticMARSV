import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./Home.scss";

import warehouse from "../../assets/warehouse.png";
import plane from "../../assets/plane.png";
import client from "../../assets/client.png";
import map from "../../assets/map.png";
import tracking from "../../assets/tracking.png";

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
      {/* Innovative Floating Island Navbar */}
      <div className={`nav-container-holder ${isScrolled ? "is-scrolled" : ""}`}>
        <header className="innovative-floating-bar">
          <div className="brand-signature" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="icon-shield-rotating">
              <img src="/png/logosam.png" alt="SAM LOGISTIC" />
              <div className="spinning-ring"></div>
            </div>
            <div className="brand-info">
              <span className="title-top">SAM</span>
              <span className="title-sub">LOGISTIC</span>
            </div>
          </div>

          <nav className={`navigation-drawer ${isMenuOpen ? "drawer-visible" : ""}`}>
            <div className="link-cluster">
              <a href="#services" onClick={(e) => { e.preventDefault(); handleScrollTo("#services"); }}>
                <span className="link-dot"></span>{t("Services")}
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
        <section className="asymmetric-hero">
          {/* Constantly Rotating Tech Geometric Wireframe in background */}
          <div className="infinite-bg-rotation"></div>
          
          <div className="hero-split-grid">
            <div className="hero-text-panel">
              <div className="status-tagline">
                <span className="pulse-dot"></span>
                <span className="tag-text">{t("Next-Gen Logistics Framework")}</span>
              </div>
              <h1 className="hero-display-title">
                {t("Global Supply Flows.")} <br />
                <span className="gradient-highlight">{t("Executed Flawlessly.")}</span>
              </h1>
              <p className="hero-descriptive-text">
                {t("Tailored B2B cargo systems, precise customs coordination, and streamlined cross-border delivery infrastructure built for enterprise performance.")}
              </p>
              <div className="hero-interactive-buttons">
                <button className="primary-glass-btn" onClick={() => navigate("/login")}>
                  {t("Initialize Request")} <span className="arrow-vector">→</span>
                </button>
                <button className="secondary-blur-btn" onClick={() => window.open("https://wa.me/21625294513", "_blank")}>
                  {t("Live Engineering Support")}
                </button>
              </div>
            </div>

            <div className="hero-media-panel">
              <div className="geometric-frame">
                <img src={tracking} alt="Tracking System" className="parallax-asset" />
                <div className="floating-metric-badge">
                  <span className="badge-value">99.8%</span>
                  <span className="badge-label">{t("SLA Integrity")}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="offset-features reveal-view">
          <div className="features-inner-container">
            <div className="feature-blade">
              <div className="blade-index">01</div>
              <div className="blade-content">
                <h3>{t("Enterprise B2B Delivery")}</h3>
                <p>{t("High-capacity scheduled distribution pathways optimized for merchant and commercial cargo networks.")}</p>
              </div>
            </div>
            <div className="feature-blade">
              <div className="blade-index">02</div>
              <div className="blade-content">
                <h3>{t("Global Customs Matrix")}</h3>
                <p>{t("End-to-end import and export compliance architecture navigating borders with frictionless speed.")}</p>
              </div>
            </div>
            <div className="feature-blade">
              <div className="blade-index">03</div>
              <div className="blade-content">
                <h3>{t("Continuous Dispatch")}</h3>
                <p>{t("Round-the-clock structural oversight ensuring systemic movement remains operational at any hour.")}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="intersect-showcase reveal-view" id="services">
          <div className="intersect-grid">
            <div className="intersect-visual">
              <img src={warehouse} alt="Hub Operations" />
            </div>
            <div className="intersect-copy-deck">
              <div className="context-eyebrow">{t("SYSTEM OVERVIEW")}</div>
              <h2>{t("Highly synchronized asset distribution operations.")}</h2>
              <div className="divider-line"></div>
              <p>{t("We establish reliable transportation channels covering key domestic and international hubs.")}</p>
              <p>{t("By integrating real-time node validation, SAM LOGISTIC changes the scope of freight coordination for regional vendors and distributors.")}</p>
              <button className="text-link-btn" onClick={() => navigate("/login")}>
                {t("Review Capabilities")} <span className="link-arrow">→</span>
              </button>
            </div>
          </div>
        </section>

        <section className="analytics-nodes reveal-view">
          <div className="nodes-container">
            <div className="node-block">
              <div className="node-metric"><CountingNumber target={500} suffix="+" /></div>
              <div className="node-caption">{t("Processed Convocations")}</div>
            </div>
            <div className="node-block highlight-node">
              <div className="node-metric">24/7</div>
              <div className="node-caption">{t("Active Fleet Validation")}</div>
            </div>
            <div className="node-block">
              <div className="node-metric"><CountingNumber target={99} suffix="%" /></div>
              <div className="node-caption">{t("On-Time Precision Rate")}</div>
            </div>
          </div>
        </section>

        <section className="modular-solutions reveal-view" id="solutions">
          <div className="section-header-centered">
            <span className="context-eyebrow">{t("ARCHITECTURAL SOLUTIONS")}</span>
            <h2>{t("Operational models configured to scale.")}</h2>
          </div>
          
          <div className="modular-grid">
            <div className="matrix-card">
              <div className="matrix-image-area">
                <img src={plane} alt="Air Transit Matrix" />
              </div>
              <div className="matrix-body">
                <span className="matrix-tag">{t("Transit")}</span>
                <h3>{t("Import & Export Systems")}</h3>
                <p>{t("Seamless cross-border custom workflows coupled with multi-modal delivery paths.")}</p>
              </div>
            </div>

            <div className="matrix-card">
              <div className="matrix-image-area">
                <img src={map} alt="Regional Distribution" />
              </div>
              <div className="matrix-body">
                <span className="matrix-tag">{t("Fulfillment")}</span>
                <h3>{t("B2B & B2C Distribution")}</h3>
                <p>{t("Intelligent distribution systems serving high-volume business centers and individual clients.")}</p>
              </div>
            </div>

            <div className="matrix-card">
              <div className="matrix-image-area">
                <img src={client} alt="Control Center" />
              </div>
              <div className="matrix-body">
                <span className="matrix-tag">{t("Operations")}</span>
                <h3>{t("24/7 Control Center")}</h3>
                <p>{t("Direct channel access to engineering and tracking response desks around the clock.")}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="industrial-gateway reveal-view" id="tracking">
          <div className="gateway-inner-box">
            <div className="gateway-grid">
              <div className="gateway-text">
                <span className="context-eyebrow">{t("MOBILE INFRASTRUCTURE")}</span>
                <h2>{t("Track ecosystem nodes on any mobile interface.")}</h2>
                <p>{t("Deploy and access your shipment matrix, monitor real-time node arrivals, and manage routing assignments via our native workspace application.")}</p>
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
            <span className="footer-brand">SAM LOGISTIC</span>
            <p className="footer-tagline">© 2026. {t("All operational interfaces reserved.")}</p>
          </div>
          <div className="footer-right">
            <div className="footer-navigation-links">
              <a href="#services" onClick={(e) => { e.preventDefault(); handleScrollTo("#services"); }}>{t("Services")}</a>
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