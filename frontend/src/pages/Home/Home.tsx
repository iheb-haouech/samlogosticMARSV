import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./Home.scss";
import { useNavigate } from "react-router-dom";

// IMAGES (put them in src/assets/)
import hero from "../../assets/hero.png";
import warehouse from "../../assets/warehouse.png";
import plane from "../../assets/plane.png";
import client from "../../assets/client.png";
import map from "../../assets/map.png";
import tracking from "../../assets/tracking.png";



const Home = () => {
  const words = ["FAST", "GLOBAL", "RELIABLE"];
  const [index, setIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
     window.addEventListener("scroll", () => {
      setScrolled(window.scrollY > 50);
  });
}, []);
  // typing effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // scroll reveal
  useEffect(() => {
    const sections = document.querySelectorAll(".section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.2 }
    );

    sections.forEach((sec) => observer.observe(sec));
  }, []);

  return (
    <div className="home">

      {/* HEADER */}
<header className={`header ${scrolled ? "scrolled" : ""}`}>
        <div className="container nav-container">
        
        <div className="logo">
          SAM LOGISTIC
        </div>

        <nav className="nav">
          <a href="#services">Services</a>
          <a href="#tracking">Track</a>
          <a href="#contact">Contact</a>
          <button className="login-btn" onClick={() => navigate("/login")} >Login</button>
        </nav>

      </div>
    </header>

      {/* HERO */}
      <section
        className="hero"
        style={{ backgroundImage: `url(${hero})` }}
      >
        <div className="hero-overlay">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1>
              {words[index]} <br /> LOGISTICS
            </h1>
            <p>
              Delivering speed, precision, and global reach for your business.
            </p>
            <button className="cta-btn">GET STARTED</button>
          </motion.div>

          <div className="hero-side-text">
            SHIP TRACK DELIVER
          </div>
        </div>
      </section>

      {/* SERVICES */}
<section className="section services" id="services">
  <div className="container grid-2">

    {/* LEFT TEXT */}
    <div className="text-block">
      <h2>OUR SERVICES</h2>
      <p>
        We deliver precision logistics solutions across Tunisia and globally,
        ensuring speed, reliability, and full visibility of your shipments.
      </p>
      <span className="tag">Your Trusted Logistics Partner</span>
    </div>

    {/* RIGHT IMAGE */}
    <div className="image-block">
      <img src={warehouse} alt="warehouse" />
    </div>

  </div>
</section>

      {/* WHY */}
      <section className="section why">
  <div className="container">

    <h2 className="center">WHY CHOOSE US</h2>

    <div className="cards">
      <img src={plane} />
      <img src={warehouse} />
    </div>

    <p className="center sub">
      Fast, reliable delivery powered by a modern fleet and real-time logistics tracking.
    </p>

  </div>
</section>
      {/* TESTIMONIAL */}
      <section className="testimonial section">
        <div className="left">
          <h2>CLIENT TESTIMONIALS</h2>
          <p>
            Our clients trust us for fast delivery and reliable logistics solutions.
          </p>
        </div>

        <div className="right">
          <img src={client} alt="client" />
        </div>
      </section>

      {/* GLOBAL */}
      <section className="global section">
        <div className="left">
          <h2>GLOBAL CONNECTIVITY</h2>
          <p>
            Connecting Tunisia to the world with precision logistics.
          </p>
        </div>

        <div className="right">
          <img src={map} alt="map" />
        </div>
      </section>

      {/* QUOTE */}
      <section className="quote section">
        <h2>READY TO MOVE FASTER?</h2>
        <button className="cta-btn">GET YOUR QUOTE</button>
      </section>

      {/* TRACKING */}
      <section id="tracking" className="tracking section">
        <div className="left">
          <h2>SHIPMENT TRACKING</h2>
          <p>
            Track your shipment in real-time with full visibility.
          </p>
        </div>

        <div className="right">
          <img src={tracking} alt="tracking" />
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact section">
        <h2>CONTACT OUR TEAM</h2>
        <p>123 Ariana, Tunis</p>
        <p>+216 26 244 098</p>
        <p>samlogistics@gmail.com</p>
      </section>

    </div>
  );
};

export default Home;
