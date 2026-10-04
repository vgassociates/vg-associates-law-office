"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Scale,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Video,
  Building2,
  CalendarDays,
  BriefcaseBusiness,
  FileText,
  Users,
  Landmark,
} from "lucide-react";

import ParticleGlobe from "./components/ParticleGlobe";

const practices = [
  {
    title: "Civil Disputes",
    description:
      "Representation and legal assistance in civil disputes, recovery matters, injunctions, property disputes and related proceedings.",
    icon: Scale,
  },
  {
    title: "Criminal Matters",
    description:
      "Legal representation and assistance in criminal cases, complaints, bail matters and related proceedings.",
    icon: ShieldCheck,
  },
  {
    title: "Property & Land",
    description:
      "Legal assistance concerning land, property transactions, ownership, possession, documentation and disputes.",
    icon: Landmark,
  },
  {
    title: "Family & Matrimonial",
    description:
      "Professional legal assistance in matrimonial, family, maintenance and related family disputes.",
    icon: Users,
  },
  {
    title: "Consumer Matters",
    description:
      "Representation and assistance in consumer disputes, complaints and matters involving deficient services or products.",
    icon: FileText,
  },
  {
    title: "Commercial Matters",
    description:
      "Legal assistance in commercial disputes, business-related matters, documentation and professional representation.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Legal Notices & Replies",
    description:
      "Preparation and review of legal notices, replies, representations and other formal legal communications.",
    icon: Mail,
  },
  {
    title: "Legal Opinion – Bank Loan",
    description:
      "Legal opinion and documentation support relating to bank loans, property security and related matters.",
    icon: Building2,
  },
];

const advocates = [
  {
    name: "MUNIPALLE B V N GANGADHARA SAI",
    role: "Advocate",
  },
  {
    name: "MUNIPALLE SAI BABU",
    role: "Advocate",
  },
  {
    name: "KOLA JAHNAVI",
    role: "Advocate",
  },
  {
    name: "SHAIK BASHA AHMED",
    role: "Advocate",
  },
  {
    name: "MD FAROOQ",
    role: "Advocate",
  },
];

export default function Home() {
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const sections =
      document.querySelectorAll(".reveal-section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* =========================
          DISCLAIMER
      ========================= */}

      {showDisclaimer && (
        <div className="disclaimer-overlay">
          <div className="disclaimer-panel">
            <div className="disclaimer-logo">
              <Image
                src="/vg-logo.jpg"
                alt="V G ASSOCIATES"
                width={92}
                height={92}
                priority
              />
            </div>

            <div className="disclaimer-office">
              V G ASSOCIATES
            </div>

            <h2 className="disclaimer-title">
              Legal Disclaimer
            </h2>

            <div className="disclaimer-content">
              <p>
                The information provided on this website is
                intended for general informational purposes
                only.
              </p>

              <p>
                The contents of this website should not be
                treated as legal advice or as a substitute
                for professional legal consultation.
              </p>

              <p>
                Visiting this website or communicating
                through it does not create an advocate-client
                relationship.
              </p>

              <p>
                Every legal matter depends upon its specific
                facts and circumstances. Professional advice
                should be obtained before taking any legal
                action.
              </p>
            </div>

            <button
              type="button"
              className="disclaimer-agree"
              onClick={() => setShowDisclaimer(false)}
            >
              I UNDERSTAND & CONTINUE
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* =========================
          NAVIGATION
      ========================= */}

      <nav
        className={`nav ${
          scrolled ? "nav-scrolled" : ""
        }`}
      >
        <div className="container nav-inner">
          <a href="#home" className="brand">
            <div className="brand-logo-wrap">
              <Image
                src="/vg-logo.jpg"
                alt="V G ASSOCIATES"
                width={48}
                height={48}
              />
            </div>

            <div className="brand-text">
              <span>V G ASSOCIATES</span>
              <small>LAW OFFICE</small>
            </div>
          </a>

          <div className="links">
            <a href="#about">About</a>
            <a href="#principal">Principal Advocate</a>
            <a href="#team">Legal Team</a>
            <a href="#services">Services</a>
            <a href="#appointment">Appointment</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </nav>

      {/* =========================
          HERO
      ========================= */}

      <main id="home">
        <section className="hero">
          <div className="hero-particle-background">
            <ParticleGlobe />
          </div>

          <div className="hero-overlay" />

          <div className="container hero-content">
            <div className="hero-copy">
              <div className="hero-eyebrow">
                <span />
                ADVOCATES & LEGAL SERVICES
              </div>

              <h1>
                Justice begins
                <br />
                <span>with the right guidance.</span>
              </h1>

              <p className="hero-quote">
                “Law is not merely about resolving disputes.
                It is about protecting rights, finding
                solutions and pursuing justice.”
              </p>

              <p className="hero-intro">
                V G ASSOCIATES is a professional law office
                providing legal representation, consultation
                and assistance across Andhra Pradesh, with a
                strong professional presence in Guntur
                District.
              </p>

              <div className="actions hero-actions">
                <a
                  href="/client"
                  className="btn gold"
                >
                  Book an Appointment
                  <ArrowRight size={15} />
                </a>

                <a
                  href="tel:9491139540"
                  className="btn ghost"
                >
                  <Phone size={15} />
                  Call Office
                </a>
              </div>
            </div>
          </div>

          <div className="hero-bottom">
            <div className="hero-bottom-line" />

            <div className="hero-scroll">
              <span>SCROLL TO EXPLORE</span>
              <span className="scroll-arrow">↓</span>
            </div>

            <div className="hero-bottom-line" />
          </div>
        </section>

        {/* =========================
            ABOUT
        ========================= */}

        <section
          id="about"
          className="section reveal-section"
        >
          <div className="container">
            <div className="about">
              <div>
                <div className="eyebrow">
                  <span />
                  ABOUT THE OFFICE
                </div>

                <h2>
                  Professional
                  <br />
                  <span>legal service.</span>
                </h2>
              </div>

              <div>
                <p className="section-intro">
                  V G ASSOCIATES is a law office based in
                  Ponnur, providing professional legal
                  services and representation across Andhra
                  Pradesh.
                </p>

                <p>
                  Our approach is built around understanding
                  each matter carefully, providing practical
                  legal guidance and representing clients with
                  professionalism, preparation and integrity.
                </p>

                <p>
                  With experience across civil, criminal,
                  property, family, consumer and commercial
                  matters, the office assists individuals,
                  families, businesses and institutions in
                  navigating legal issues with clarity and
                  confidence.
                </p>

                <div className="quote">
                  “Professional representation begins with
                  understanding the matter, protecting the
                  client’s interests and pursuing the most
                  appropriate legal course.”
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            PRINCIPAL ADVOCATE
        ========================= */}

        <section
          id="principal"
          className="section cream reveal-section"
        >
          <div className="container">
            <div className="section-head">
              <div>
                <div className="eyebrow">
                  <span />
                  PRINCIPAL ADVOCATE
                </div>

                <h2>
                  Experience.
                  <br />
                  <span>Professionalism.</span>
                </h2>
              </div>

              <p>
                V G ASSOCIATES is led by a senior advocate
                with extensive experience in legal practice,
                professional representation and public legal
                service.
              </p>
            </div>

            <div className="advocate-feature-card">
              <div className="card-number">
                01
              </div>

              <div className="advocate-main-details">
                <h3>
                  MUNIPALLE PANDU RANGA
                  <br />
                  VITTAL PRASAD
                </h3>

                <p className="advocate-role">
                  Principal Advocate
                </p>

                <p className="advocate-experience">
                  Over 30 years of experience in legal
                  practice, representation and professional
                  service.
                </p>
              </div>

              <div className="advocate-feature-right">
                <Scale size={38} strokeWidth={1} />

                <span>
                  Experienced legal representation
                  and professional guidance
                </span>
              </div>
            </div>

            <div className="about advocate-about-layout">
              <div>
                <div className="eyebrow">
                  <span />
                  QUALIFICATIONS
                </div>

                <h2>
                  Academic
                  <br />
                  <span>background.</span>
                </h2>
              </div>

              <div>
                <p className="section-intro">
                  A strong academic foundation combined with
                  extensive professional experience forms the
                  basis of the office&apos;s legal practice.
                </p>

                <p>
                  <strong>B.Com</strong>
                  <br />
                  <strong>LL.B</strong>
                  <br />
                  <strong>LL.M</strong>
                  <br />
                  <strong>University Gold Medalist</strong>
                </p>
              </div>
            </div>

            <div className="about advocate-about-layout">
              <div>
                <div className="eyebrow">
                  <span />
                  PROFESSIONAL EXPERIENCE
                </div>

                <h2>
                  A career of
                  <br />
                  <span>service.</span>
                </h2>
              </div>

              <div>
                <p className="section-intro">
                  Professional experience extending across
                  legal practice, public service, institutional
                  representation and the Bar.
                </p>

                <p>
                  Ex. A.P.P.
                  <br />
                  Ex. A.G.P.
                  <br />
                  Ex. Municipal Standing Counsel
                  <br />
                  Ex. Bar President, Ponnur
                  <br />
                  Panel Advocate to the Banks
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            LEGAL TEAM
        ========================= */}

        <section
          id="team"
          className="section reveal-section"
        >
          <div className="container">
            <div className="section-head">
              <div>
                <div className="eyebrow">
                  <span />
                  LEGAL TEAM
                </div>

                <h2>
                  People behind
                  <br />
                  <span>the practice.</span>
                </h2>
              </div>

              <p>
                Our legal team works with a professional,
                coordinated approach, supporting clients
                across different areas of legal practice.
              </p>
            </div>

            <div className="grid">
              {advocates.map((advocate, index) => (
                <div
                  className="team-card"
                  key={advocate.name}
                >
                  <div className="card-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="team-icon">
                    <Scale
                      size={34}
                      strokeWidth={1}
                    />
                  </div>

                  <h3>{advocate.name}</h3>

                  <p>{advocate.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================
            LEGAL SERVICES
        ========================= */}

        <section
          id="services"
          className="section cream reveal-section"
        >
          <div className="container">
            <div className="section-head">
              <div>
                <div className="eyebrow">
                  <span />
                  PRACTICE AREAS
                </div>

                <h2>
                  Legal
                  <br />
                  <span>services.</span>
                </h2>
              </div>

              <p>
                Professional legal assistance across a broad
                range of matters for individuals, families,
                businesses and institutions.
              </p>
            </div>

            <div className="grid">
              {practices.map((practice, index) => {
                const Icon = practice.icon;

                return (
                  <div
                    className="service-card"
                    key={practice.title}
                  >
                    <div className="card-number">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <Icon
                      size={34}
                      strokeWidth={1}
                    />

                    <h3>{practice.title}</h3>

                    <p>{practice.description}</p>

                    <ArrowRight
                      size={18}
                      strokeWidth={1.5}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================
            FACILITIES
        ========================= */}

        <section
          className="section reveal-section"
        >
          <div className="container">
            <div className="section-head">
              <div>
                <div className="eyebrow">
                  <span />
                  OFFICE FACILITIES
                </div>

                <h2>
                  Built around
                  <br />
                  <span>your needs.</span>
                </h2>
              </div>

              <p>
                A professional environment designed to make
                consultation, communication and legal
                assistance more accessible.
              </p>
            </div>

            <div className="grid">
              <div className="card">
                <MapPin
                  size={34}
                  strokeWidth={1}
                />

                <h3>
                  Accessible
                  <br />
                  Location
                </h3>

                <p>
                  Located at Sai Nagar, Ponnur, Guntur
                  District, Andhra Pradesh.
                </p>
              </div>

              <div className="card">
                <Video
                  size={34}
                  strokeWidth={1}
                />

                <h3>
                  Video
                  <br />
                  Consultation
                </h3>

                <p>
                  Convenient consultation options for
                  clients who are unable to visit the office
                  in person.
                </p>
              </div>

              <div className="card">
                <CalendarDays
                  size={34}
                  strokeWidth={1}
                />

                <h3>
                  Scheduled
                  <br />
                  Appointments
                </h3>

                <p>
                  Book an appointment through the online
                  appointment portal at a convenient
                  available time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            APPOINTMENT
        ========================= */}

        <section
          id="appointment"
          className="section cream reveal-section"
        >
          <div className="container">
            <div className="appointment-card">
              <div>
                <div className="eyebrow">
                  <span />
                  CONSULTATION
                </div>

                <h3>
                  Let&apos;s discuss
                  <br />
                  your legal matter.
                </h3>

                <p>
                  Schedule an appointment with V G
                  ASSOCIATES for professional legal
                  consultation and assistance.
                </p>
              </div>

              <a
                href="/client"
                className="btn gold"
              >
                Book an Appointment
                <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </section>

        {/* =========================
            CONTACT
        ========================= */}

        <section
          id="contact"
          className="section contact reveal-section"
        >
          <div className="container">
            <div className="section-head">
              <div>
                <div className="eyebrow">
                  <span />
                  CONTACT
                </div>

                <h2>
                  Visit or
                  <br />
                  <span>get in touch.</span>
                </h2>
              </div>

              <p>
                For appointments, consultations and general
                office enquiries, please contact V G
                ASSOCIATES.
              </p>
            </div>

            <div className="contact-box">
              <div className="contact-row">
                <MapPin
                  size={22}
                  strokeWidth={1.4}
                />

                <div>
                  <span className="label">
                    OFFICE
                  </span>

                  <span className="value">
                    V G ASSOCIATES
                    <br />
                    Sai Nagar, Ponnur
                    <br />
                    Guntur District,
                    Andhra Pradesh – 522124
                  </span>
                </div>
              </div>

              <div className="contact-row">
                <Phone
                  size={22}
                  strokeWidth={1.4}
                />

                <div>
                  <span className="label">
                    PHONE
                  </span>

                  <a
                    href="tel:9491139540"
                    className="value"
                  >
                    94911 39540
                  </a>
                </div>
              </div>

              <div className="contact-row">
                <Mail
                  size={22}
                  strokeWidth={1.4}
                />

                <div>
                  <span className="label">
                    EMAIL
                  </span>

                  <a
                    href="mailto:vgassociates1995@gmail.com"
                    className="value"
                  >
                    vgassociates1995@gmail.com
                  </a>
                </div>
              </div>

              <div className="contact-actions">
                <a
                  href="/client"
                  className="btn gold"
                >
                  Book an Appointment
                  <CalendarDays size={15} />
                </a>

                <a
                  href="tel:9491139540"
                  className="btn ghost"
                >
                  <Phone size={15} />
                  Call Office
                </a>
              </div>

              <div className="contact-map">
                <iframe
                  title="V G ASSOCIATES Location"
                  src="https://www.google.com/maps?q=V%20G%20Associates%2C%20Sai%20Nagar%2C%20Ponnur%2C%20Guntur%20District%2C%20Andhra%20Pradesh%20522124&output=embed"
                  width="100%"
                  height="420"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =========================
          FOOTER
      ========================= */}

      <footer className="footer">
        <div className="container footer-inner">
          <div>
            <strong>V G ASSOCIATES</strong>

            <span>
              ADVOCATES & LEGAL SERVICES
            </span>
          </div>

          <p>
            © {new Date().getFullYear()} V G ASSOCIATES.
            All rights reserved.
          </p>

          <a href="#home">
            Back to top ↑
          </a>
        </div>
      </footer>
    </>
  );
}