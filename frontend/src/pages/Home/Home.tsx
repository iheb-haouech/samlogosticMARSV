import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./Home.scss";
import { useNavigate } from "react-router-dom";
import {
  BRAND_NAME,
  BRAND_SUPPORT_EMAIL,
  BRAND_TAGLINE,
} from "../../constants/branding";

import hero from "../../assets/hero.png";
import warehouse from "../../assets/warehouse.png";
import plane from "../../assets/plane.png";
import client from "../../assets/client.png";
import map from "../../assets/map.png";
import tracking from "../../assets/tracking.png";

const Home = () => {
  const [scrolled, setScrolled] = useState(false);
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

  const openWhatsApp = () => {
    window.open("https://wa.me/21625294513", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="home">
      <header className={`header ${scrolled ? "scrolled" : ""}`}>
        <div className="container nav-container">
        <div className="brand">
           <img src="/png/logosam.png" alt="SAM LOGISTIC logo" className="nav-logo" />
        <div className="logo">{BRAND_NAME}</div>
       </div>
          

          <nav className="nav">
            <a href="#services">Services</a>
            <a href="#solutions">Solutions</a>
            <a href="#tracking">Tracking</a>
            <a href="#contact">Contact</a>
            <button className="login-btn" onClick={() => navigate("/login")}>
              Login
            </button>
          </nav>
        </div>
      </header>

<section className="hero" style={{ backgroundImage: `url(${hero})` }}>
  <div className="hero-overlay">
    <motion.div
      className="hero-content"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85 }}
    >
      <span className="hero-badge">24/7 • Tunisia • Global</span>

      <h1>SAM LOGISTIC moves your shipments.</h1>

      <p className="hero-subtitle">
        Import, export, B2B and B2C delivery with 24/7 customer service and a future app for tracking.
      </p>

      <div className="hero-actions">
        <button className="cta-btn" onClick={() => navigate("/login")}>
          Login
        </button>
        <button className="ghost-btn whatsapp-btn" onClick={openWhatsApp}>
          WhatsApp Us
        </button>
      </div>
    </motion.div>

    <div className="hero-card">
      <div className="hero-card-top">
        <span className="mini-label">Trusted partner</span>
        <h3>SAM LOGISTIC</h3>
      </div>

      <div className="hero-card-list">
        <div>
          <strong>B2B / B2C</strong>
          <span>Delivery for companies and individuals.</span>
        </div>
        <div>
          <strong>Import / Export</strong>
          <span>National and international logistics.</span>
        </div>
        <div>
          <strong>24/7 Support</strong>
          <span>Service client available day and night.</span>
        </div>
      </div>
    </div>
  </div>
</section>

      <section className="section stats">
        <div className="container stats-grid">
          <div className="stat-card">
            <strong>24/7</strong>
            <span>Service client disponible à tout moment</span>
          </div>
          <div className="stat-card">
            <strong>B2B / B2C</strong>
            <span>Delivery solutions for businesses and private clients</span>
          </div>
          <div className="stat-card">
            <strong>Import / Export</strong>
            <span>National and international operations</span>
          </div>
          <div className="stat-card">
            <strong>Future App</strong>
            <span>We are building a user app for tracking and services</span>
          </div>
        </div>
      </section>

      <section className="section split" id="services">
        <div className="container split-grid">
          <div className="split-copy">
            <span className="eyebrow">OUR SERVICES</span>
            <h2>Clear logistics, fast execution.</h2>
            <p>
              We provide import and export services across Tunisia and abroad.
              Our team manages freight, delivery coordination, and client support
              with a simple focus: move shipments safely and on time.
            </p>
            <p>
              From B2B deliveries to B2C shipments, SAM LOGISTIC is designed to
              support businesses, shops, and individuals with dependable logistics.
            </p>
          </div>

          <div className="split-media panel">
            <img src={warehouse} alt="Warehouse logistics" />
          </div>
        </div>
      </section>

      <section className="section cards-section" id="solutions">
        <div className="container">
          <div className="section-title">
            <span className="eyebrow">WHAT WE DO BEST</span>
            <h2>Built for national and international logistics.</h2>
          </div>

          <div className="cards-grid">
            <article className="info-card">
              <img src={plane} alt="International transport" />
              <h3>Import & Export</h3>
              <p>We handle national and international cargo flows with reliable coordination.</p>
            </article>

            <article className="info-card">
              <img src={map} alt="Coverage map" />
              <h3>B2B and B2C Delivery</h3>
              <p>Flexible delivery services for companies, merchants, and individual clients.</p>
            </article>

            <article className="info-card">
              <img src={client} alt="Client support" />
              <h3>24/7 Customer Service</h3>
              <p>Our client support is available all day, every day, to help and guide you.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section split reverse" id="tracking">
        <div className="container split-grid">
          <div className="split-copy">
            <span className="eyebrow">TRACKING & APP</span>
            <h2>Technology that keeps clients informed.</h2>
            <p>
              We are building a dedicated application for users so they can track
              shipments, manage requests, and access logistics services with ease.
            </p>
            <p>
              Real-time visibility, simple navigation, and clear updates will make
              the experience smoother for every customer.
            </p>
          </div>

          <div className="split-media panel">
            <img src={tracking} alt="Shipment tracking" />
          </div>
        </div>
      </section>

      <section className="section quote">
        <div className="container quote-inner">
          <h2>SAM LOGISTIC. Fast, trusted, available 24/7.</h2>
          <p>Import, export, national delivery, international delivery, B2B and B2C.</p>
          <div className="hero-actions">
            <button className="cta-btn" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="ghost-btn whatsapp-btn" onClick={openWhatsApp}>
               Contact on WhatsApp
           </button>
          </div>
        </div>
      </section>

      <section id="contact" className="section contact">
        <div className="container contact-card">
          <span className="eyebrow">CONTACT</span>
          <h2>We are ready to help.</h2>
          <p>2063 Cité Ennasime N.M Ben Arous, Tunisie</p>
          <p>Phone / WhatsApp: +216 25 294 513</p>
          <p>Email: {BRAND_SUPPORT_EMAIL}</p>
        </div>
      </section>
        <footer id="FOOT" className="footer">
          <p>© 2026 SAM LOGISTIC, Inc.</p>
        </footer>
    </div>
  );
};

export default Home;