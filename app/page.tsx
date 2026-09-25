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
} from "lucide-react";
const practices = [
  [
    "Civil Disputes",
    "Legal assistance and representation in civil disputes, property matters and related proceedings.",
  ],
  [
    "Criminal Matters",
    "Legal representation and assistance in criminal matters, subject to the facts and applicable law.",
  ],
  [
    "Property & Land",
    "Guidance and representation concerning property, land, documentation and related disputes.",
  ],
  [
    "Family & Matrimonial",
    "Legal assistance in family and matrimonial matters and related proceedings.",
  ],
  [
    "Consumer Matters",
    "Assistance with consumer disputes, complaints and related legal proceedings.",
  ],
  [
    "Commercial Matters",
    "Legal assistance for businesses, contracts, disputes and commercial documentation.",
  ],
  [
    "Legal Notices & Replies",
    "Assistance with preparation, review and response to legal notices and related matters.",
  ],
  [
    "Legal Opinion – Bank Loan",
    "Legal opinions and assistance relating to bank loans, documents and related legal requirements.",
  ],
];

const consultationPurposes = [
  "Property / Land Dispute",
  "Family / Matrimonial Matter",
  "Civil Dispute",
  "Criminal Matter",
  "Court Case / Existing Case",
  "Legal Notice / Reply",
  "Agreement / Contract / Document",
  "Money / Loan / Recovery Matter",
  "Legal Opinion – Bank Loan",
  "Business / Company Matter",
  "Legal Advice / Consultation",
  "Other",
];

const advocates = [
  "Advocate M B V N G S",
  "Advocate M H S S B",
  "Advocate SK.B.A",
];

export default function Home() {
    const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [checkingDisclaimer, setCheckingDisclaimer] = useState(true);

  useEffect(() => {
    const agreed = localStorage.getItem("vgassociates_disclaimer_agreed");

    if (agreed === "true") {
      setShowDisclaimer(false);
    }

    setCheckingDisclaimer(false);
  }, []);

  const agreeToDisclaimer = () => {
    localStorage.setItem("vgassociates_disclaimer_agreed", "true");
    setShowDisclaimer(false);
  };

  if (checkingDisclaimer) {
    return null;
  }
  return (
  <>
    {showDisclaimer && (
      <div className="disclaimer-overlay">
        <div className="disclaimer-panel">

          <div className="disclaimer-logo">
            <Image
              src="/logo.svg"
              alt="V G ASSOCIATES"
              width={64}
              height={64}
            />
          </div>

          <div className="disclaimer-office">
            V G ASSOCIATES
          </div>

          <div className="disclaimer-title">
            DISCLAIMER
          </div>

          <div className="disclaimer-content">

            <p>
              The rules of the Bar Council of India restrict advocates
              from soliciting work or advertising, directly or indirectly.
            </p>

            <p>
              By clicking on <strong>“I AGREE”</strong>, the user acknowledges that:
            </p>

            <ul>
              <li>
                The user wishes to obtain information about
                <strong> V G ASSOCIATES, its advocates, areas of legal practice
                and office</strong>, solely for the user's own information and use.
              </li>

              <li>
                The information contained on this website is made available
                to the user at the user's specific request. Any access to,
                transmission, receipt or use of this website, and any information
                obtained or material viewed or downloaded from it, is at the user's
                own volition and does not create, and is not intended to create,
                any advocate-client relationship.
              </li>

              <li>
                None of the information contained on this website constitutes
                a legal opinion or legal advice.
              </li>

              <li>
                The information provided on this website is for general
                informational purposes and should not be relied upon as a
                substitute for obtaining independent legal advice in relation
                to any specific legal matter.
              </li>
            </ul>

            <p>
              <strong>V G ASSOCIATES</strong> shall not be responsible for any
              consequence arising from any action taken by a user in reliance
              upon information or material contained on this website. Persons
              having specific legal concerns should seek independent legal advice
              appropriate to their circumstances.
            </p>

          </div>

          <button
            type="button"
            className="disclaimer-agree"
            onClick={agreeToDisclaimer}
          >
            I AGREE
          </button>

        </div>
      </div>
    )}

    <nav className="nav">
        <div className="container nav-inner">
          <a className="brand" href="#">
            <Image
              src="/logo.svg"
              alt="VG Associates logo"
              width={44}
              height={44}
            />
            <span>V G ASSOCIATES</span>
          </a>

          <div className="links">
            <a href="#about">About</a>
            <a href="#advocates">Advocates</a>
            <a href="#practice">Legal Services</a>
            <a href="#facilities">Facilities</a>
            <a href="#appointment">Book Appointment</a>
            <a href="#contact">Contact</a>
            <a href="/admin">Admin</a>
          </div>
        </div>
      </nav>

      <header className="hero">
  <div className="container">
    <div className="eyebrow">
      Advocates & Legal Services · Ponnur
    </div>

    <h1>
      Justice begins with
      <br />
      the right guidance.
    </h1>

    <p className="hero-quote">
      “Every legal matter deserves careful attention,
      clear guidance and responsible representation.”
    </p>

    <p className="hero-intro"> 
  V G ASSOCIATES has been providing legal services since 1995, 
  with experience in handling a range of civil, criminal, 
  property, family, commercial and other legal matters. 
  The office provides legal assistance, advice and 
  representation before courts and other legal forums, 
  according to the nature of each matter and applicable law. 
</p>

    <div className="actions">
      <a className="btn gold" href="#appointment">
        Book an Appointment
        <ArrowRight size={16} />
      </a>

      <a
        className="btn ghost"
        href="tel:+919491139540"
      >
        Call 94911 39540
      </a>
    </div>
  </div>
</header>

      <section id="about" className="section">
        <div className="container about">
          <div>
            <div className="eyebrow">The Office</div>

            <h2>About V G ASSOCIATES</h2>

            <p className="section-intro">
              V G ASSOCIATES is a legal office based in Sai Nagar,
              Ponnur, Guntur District, Andhra Pradesh, providing
              legal assistance and representation across a range
              of matters.
            </p>

            <p className="section-intro">
              The office is led by{" "}
              <b>Advocate M P R V P</b> and is focused on
              professional communication, careful attention to
              legal matters and accessible client service.
            </p>

            <p className="quote">
              “Every matter deserves careful attention, clear
              communication and responsible legal representation.”
            </p>
          </div>

          <div className="card">
            <Scale size={32} color="#c8a45b" />

            <h3>Legal Representation</h3>

            <p>
              Assistance and representation in appropriate legal
              matters before courts and other relevant forums.
            </p>

            <ShieldCheck size={32} color="#c8a45b" />

            <h3>Client Focus</h3>

            <p>
              Clear communication, organized information and
              convenient appointment options for clients.
            </p>
          </div>
        </div>
      </section>

      <section id="advocates" className="section cream">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Principal Advocate</div>

              <h2>Advocate M P R V P</h2>
            </div>

            <p className="section-intro">
              Principal Advocate of V G ASSOCIATES with over
              30 years of experience in legal practice and
              professional service.
            </p>
          </div>

          <div className="about">
            <div className="card">
              <Scale size={36} color="#c8a45b" />

              <h3>Advocate M P R V P</h3>

              <p>
                <b>Principal Advocate</b>
              </p>

              <p>
                With over 30 years of experience in legal practice,
                Advocate M P R V P has served in various professional
                and legal capacities.
              </p>

              <h3>Qualifications</h3>

              <p>
                B.Com, LL.B, LL.M
                <br />
                <b>University Gold Medalist</b>
              </p>

              <h3>Professional Experience</h3>

              <ul>
                <li>Ex. A.P.P.</li>
                <li>Ex. A.G.P.</li>
                <li>Ex. Municipal Standing Counsel</li>
                <li>Ex. Bar President, Ponnur</li>
                <li>Panel Advocate to the Banks</li>
              </ul>
            </div>

            <div className="card">
              <ShieldCheck size={32} color="#c8a45b" />

              <h3>Legal Experience</h3>

              <p>
                Extensive experience in legal practice,
                representation and professional legal services
                across a range of matters.
              </p>

              <Scale size={32} color="#c8a45b" />

              <h3>Professional Service</h3>

              <p>
                The office provides legal assistance with a focus
                on careful attention to each matter, clear
                communication and responsible representation.
              </p>
            </div>
          </div>

          <div style={{ marginTop: "32px" }}>
            <div className="eyebrow">Our Advocates</div>

            <h2>Legal Team</h2>

            <div className="grid">
              {advocates.map((advocate) => (
                <article className="card" key={advocate}>
                  <Scale size={28} color="#c8a45b" />

                  <h3>{advocate}</h3>

                  <p>
                    Advocate associated with V G ASSOCIATES.
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="practice" className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Practice Areas</div>

              <h2>Legal Services</h2>
            </div>

            <p className="section-intro">
              Select the area that best describes the legal
              assistance you are looking for.
            </p>
          </div>

          <div className="grid">
            {practices.map(([title, description]) => (
              <article className="card" key={title}>
                <h3>{title}</h3>

                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="facilities" className="section cream">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Client Facilities</div>

              <h2>Facilities We Provide</h2>
            </div>

            <p className="section-intro">
              Convenient options designed to make it easier for
              clients to connect with the office.
            </p>
          </div>

          <div className="grid">
            <article className="card">
              <Building2 size={30} color="#c8a45b" />

              <h3>Visit Our Office</h3>

              <p>
                Clients can visit our office in Ponnur for an
                in-person consultation with an advocate.
              </p>
            </article>

            <article className="card">
              <Video size={30} color="#c8a45b" />

              <h3>Online / Video Consultation</h3>

              <p>
                Clients can choose an online or video consultation
                when visiting the office is not convenient.
              </p>
            </article>

            <article className="card">
              <CalendarDays size={30} color="#c8a45b" />

              <h3>Online Appointment Booking</h3>

              <p>
                Clients can use the website to select a convenient
                date and time for an appointment.
              </p>
            </article>

            <article className="card">
              <ShieldCheck size={30} color="#c8a45b" />

              <h3>Professional Legal Assistance</h3>

              <p>
                Matters are handled with attention to the facts,
                applicable law and the client's requirements.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="appointment" className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Appointments</div>

              <h2>Book an Appointment</h2>
            </div>

            <p className="section-intro">
              Choose how you would like to meet the advocate and
              tell us what you need help with.
            </p>
          </div>

          <div className="grid">
            <article className="card">
              <Video size={30} color="#c8a45b" />

              <h3>
                How would you like to meet the advocate?
              </h3>

              <p>
                <b>Visit Our Office</b>
              </p>

              <p>
                Meet the advocate in person at our office in
                Ponnur.
              </p>

              <p>
                <b>Online / Video Consultation</b>
              </p>

              <p>
                Speak with the advocate online when an office
                visit is not convenient.
              </p>
            </article>

            <article className="card">
              <Scale size={30} color="#c8a45b" />

              <h3>What do you need help with?</h3>

              <ul>
                {consultationPurposes.map((purpose) => (
                  <li key={purpose}>{purpose}</li>
                ))}
              </ul>
            </article>
          </div>

          <div
            className="actions"
            style={{ marginTop: "28px" }}
          >
            <a className="btn gold" href="/client">
              Book an Appointment
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      <section id="contact" className="section cream">
  <div className="container contact">

    <div>
      <div className="eyebrow">Contact Us</div>

      <h2>Get in Touch</h2>

      <p className="section-intro">
        Contact V G ASSOCIATES for legal assistance,
        consultation and appointment information.
      </p>

      <div className="actions">

        <a
          className="btn gold"
          href="tel:+919491139540"
        >
          <Phone size={16} />
          Call Office
        </a>

        <a
          className="btn"
          href="https://wa.me/919491139540"
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </a>

        <a
          className="btn"
          href="mailto:vgassociates1995@gmail.com"
        >
          <Mail size={16} />
          Email
        </a>

      </div>

      <div style={{ marginTop: "30px" }}>

        <div className="contact-row">
          <div className="label">Office</div>

          <div className="value">
            Sai Nagar, Ponnur, Guntur District,
            Andhra Pradesh – 522124
          </div>
        </div>

        <div className="contact-row">
          <div className="label">
            <Phone size={16} />
          </div>

          <div className="value">
            <a href="tel:+919491139540">
              94911 39540
            </a>
          </div>
        </div>

        <div className="contact-row">
          <div className="label">
            <Mail size={16} />
          </div>

          <div className="value">
            <a href="mailto:vgassociates1995@gmail.com">
              vgassociates1995@gmail.com
            </a>
          </div>
        </div>

      </div>
    </div>

    <div className="contact-box">

      <div className="label">Office Location</div>

      <div
        style={{
          marginTop: "12px",
          overflow: "hidden",
          borderRadius: "8px",
          border: "1px solid rgba(255,255,255,.15)",
        }}
      >
        <iframe
          src="https://www.google.com/maps?q=16.069815,80.5520079&z=18&output=embed"
          width="100%"
          height="360"
          style={{ border: 0, display: "block" }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div style={{ marginTop: "18px" }}>
        <a
          className="btn gold"
          href="https://www.google.com/maps/dir/?api=1&destination=16.069815,80.5520079"
          target="_blank"
          rel="noopener noreferrer"
        >
          <MapPin size={16} />
          Get Directions
        </a>
      </div>

    </div>

  </div>
</section>

      <footer className="footer">
        <div className="container footer-inner">
          <div>
            © {new Date().getFullYear()} V G ASSOCIATES.
            All rights reserved.
          </div>

          <div className="disclaimer">
            This website is for general information and does not
            constitute legal advice. No advocate-client relationship
            is created solely by visiting or contacting this website.
          </div>
        </div>
      </footer>
    </>
  );
}

