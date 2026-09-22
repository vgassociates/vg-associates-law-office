import Image from "next/image";
import { ArrowRight, Scale, ShieldCheck, MapPin, Phone, Mail } from "lucide-react";

const practices = [
  ["Civil Litigation","Representation and legal assistance in civil disputes, property matters and related proceedings."],
  ["Criminal Law","Legal representation and assistance in criminal matters, subject to the facts and applicable law."],
  ["Property & Land","Guidance and representation concerning property, land, documentation and disputes."],
  ["Family & Matrimonial","Legal assistance in family and matrimonial matters and related proceedings."],
  ["Consumer Matters","Assistance with consumer disputes, complaints and related legal proceedings."],
  ["Commercial Matters","Legal assistance for businesses, contracts, disputes and commercial documentation."]
];

export default function Home(){
  return <>
    <nav className="nav"><div className="container nav-inner">
      <a className="brand" href="#"><Image src="/logo.svg" alt="VG Associates logo" width={44} height={44}/><span>V G ASSOCIATES</span></a>
      <div className="links"><a href="#about">About</a><a href="#practice">Practice Areas</a><a href="#contact">Contact</a><a href="/admin">Admin</a></div>
    </div></nav>

    <header className="hero"><div className="container">
      <div className="eyebrow">Advocates & Legal Services · Ponnur</div>
      <h1>Law with clarity.<br/>Representation with purpose.</h1>
      <p>V G ASSOCIATES provides legal assistance across Andhra Pradesh, with a main presence in Guntur District.</p>
      <div className="actions"><a className="btn gold" href="#contact">Request a Consultation <ArrowRight size={16}/></a><a className="btn ghost" href="tel:+919491139540">Call 94911 39540</a></div>
    </div></header>

    <section id="about" className="section"><div className="container about">
      <div><div className="eyebrow">The Office</div><h2>V G ASSOCIATES</h2><p className="section-intro">Led by <b>M P R V PRASAD</b>, the office is based in Sai Nagar, Ponnur, Guntur District, Andhra Pradesh, and handles legal matters across the State.</p><p className="quote">“Every matter deserves careful attention, clear communication and responsible legal representation.”</p></div>
      <div className="card"><Scale size={32} color="#c8a45b"/><h3>Statewide Reach</h3><p>Based in Ponnur with a stated practice reach across Andhra Pradesh, particularly Guntur District.</p><ShieldCheck size={32} color="#c8a45b"/><h3>Client Focus</h3><p>Designed around accessible communication, organized case information and appointment management.</p></div>
    </div></section>

    <section id="practice" className="section cream"><div className="container">
      <div className="section-head"><div><div className="eyebrow">Practice Areas</div><h2>Legal Services</h2></div><p className="section-intro">The office can customize this list to reflect the advocate’s actual practice and current areas of work.</p></div>
      <div className="grid">{practices.map(([t,d])=><article className="card" key={t}><h3>{t}</h3><p>{d}</p></article>)}</div>
    </div></section>

    <section id="contact" className="section"><div className="container contact">
      <div><div className="eyebrow">Contact</div><h2>Start a conversation</h2><p className="section-intro">For legal assistance, please contact the office and provide a brief description of your matter. An appointment can then be arranged.</p>
      <div className="actions"><a className="btn gold" href="tel:+919491139540"><Phone size={16}/> Call Office</a><a className="btn" href="https://wa.me/919491139540">WhatsApp</a></div></div>
      <div className="contact-box"><div className="contact-row"><div className="label">Advocate</div><div className="value">M P R V PRASAD</div></div><div className="contact-row"><div className="label">Office</div><div className="value">Sai Nagar, Ponnur, Guntur District, A.P. 522124</div></div><div className="contact-row"><div className="label">Phone</div><div className="value">94911 39540</div></div><div className="contact-row"><div className="label">Email</div><div className="value">To be added</div></div></div>
    </div></section>

    <footer className="footer"><div className="container footer-inner"><div>© {new Date().getFullYear()} V G ASSOCIATES. All rights reserved.</div><div className="disclaimer">This website is for general information and does not constitute legal advice. No advocate-client relationship is created solely by visiting or contacting this website.</div></div></footer>
  </>
}