'use client';

import { useEffect, useState } from 'react';

const areas: Record<string, string[]> = {
  Visakhapatnam: ['MVP Colony', 'Madhurawada', 'Gajuwaka', 'Siripuram', 'Seethammadhara', 'Beach Road'],
  Vizianagaram: ['Vizianagaram Town', 'Gajula Rega', 'Kothapeta', 'Phool Bagh'],
  Srikakulam: ['Srikakulam Town', 'Tekkali', 'Palasa', 'Narasannapeta'],
  Parvathipuram: ['Parvathipuram Town', 'Salur', 'Bobbili', 'Kurupam'],
  Kakinada: ['Kakinada Town', 'Jagannaickpur', 'Sarpavaram', 'Samalkot'],
  Rajahmundry: ['Danavaipeta', 'Alcot Gardens', 'Morampudi', 'Rajanagaram'],
};

export default function Home() {
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [sent, setSent] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('.program-card, .journey-card, .impact .stat, .cities-copy, .location-card');
    if (!('IntersectionObserver' in window)) {
      elements.forEach(element => element.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    elements.forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return <>
    <header className="topbar"><a className="brand" href="#home" aria-label="Instrctr home"><span><span className="brand-i">i</span>nstrctr<span className="brand-dot">.</span></span></a>
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">☰</button>
      <nav className={menuOpen ? 'nav open' : 'nav'}><a href="#services" onClick={() => setMenuOpen(false)}>Our services</a><a href="#journey" onClick={() => setMenuOpen(false)}>Learning path</a><a href="#impact" onClick={() => setMenuOpen(false)}>Our impact</a><a href="#cities" onClick={() => setMenuOpen(false)}>Where we are</a><a className="nav-cta" href="#join" onClick={() => setMenuOpen(false)}>Teach with us <span>↗</span></a></nav>
    </header>
    <main id="home">
      <section className="hero">
        <div className="hero-copy"><div className="eyebrow"><span className="pulse"/> DRIVING CLASSES, MADE HUMAN</div>
          <h1>Your road.<br/><span>Your rules.</span></h1>
          <p className="hero-text">Learn to drive with patient, trusted instructors who meet you where you are. A calmer way to get behind the wheel is on its way.</p>
          <div className="hero-actions"><a className="button primary" href="#services">Explore our services <span>↗</span></a><a className="text-link" href="#join">Are you a trainer? <span>→</span></a></div>
          <div className="proof"><span className="avatars"><i>✦</i><i>✦</i><i>✦</i></span><span>Building confident drivers, one lesson at a time</span></div>
        </div>
        <div className="hero-photo"><img src="/images/hero-driving-lesson.png" alt="A learner driver practicing with a supportive instructor"/><div className="hero-photo-shade"/><div className="hero-quote"><span className="quote-mark">“</span><div><b>Confidence grows one calm lesson at a time.</b><small>OUR PROMISE AT INSTRCTR</small></div></div><span className="hero-photo-kicker">LEARN AT YOUR PACE <i>✳</i></span></div>
        <div className="hero-bottom"><span>01 / 04</span><div className="hero-progress"><i/></div><span>GET MOVING</span></div>
      </section>
      <section id="services" className="section services"><div className="section-heading"><div><div className="eyebrow">THE RIGHT START, YOUR WAY</div><h2>Tailored programs<br/>for your road.</h2></div><p>From your first nervous turn to confident city driving, find the kind of guidance that feels right for you.</p></div>
        <div className="program-grid">
          <article className="program-card"><div className="program-image"><img src="/images/scooter-lesson.png" alt="A learner and instructor practicing on a scooter by the coast"/><span className="program-badge">TWO WHEELS</span></div><div className="program-content"><span className="program-label blue-label">● SCOOTER &amp; BIKE</span><h3>Women-first scooter training</h3><p>Patient, step-by-step balance coaching to help you feel at home on two wheels.</p></div></article>
          <article className="program-card"><div className="program-image"><img src="/images/car-lesson.png" alt="A learner practicing in a car with an instructor beside her"/><span className="program-badge">FOUR WHEELS</span></div><div className="program-content"><span className="program-label cyan-label">● CAR LESSONS</span><h3>Supportive car driving</h3><p>Learn the controls, build road awareness, and practice with an instructor beside you.</p></div></article>
          <article className="program-card"><div className="program-image"><img src="/images/program-pace.png" alt="An instructor calmly talking through a driving lesson with a learner"/><span className="program-badge">LEARN AT YOUR PACE</span></div><div className="program-content"><span className="program-label cyan-label">● FLEXIBLE LEARNING</span><h3>Lessons at your pace</h3><p>Take the time you need, focus on the skills that matter, and grow your confidence gradually.</p></div></article>
          <article className="program-card"><div className="program-image"><img src="/images/program-trust.png" alt="An instructor helping a learner prepare their helmet before a scooter lesson"/><span className="program-badge">SAFETY FIRST</span></div><div className="program-content"><span className="program-label blue-label">● CONFIDENCE &amp; CARE</span><h3>Guidance you can trust</h3><p>Clear instruction and calm encouragement make every new skill easier to practice.</p></div></article>
        </div>
      </section>
      <section className="journey section" id="journey"><div className="journey-heading"><div><div className="eyebrow">THE INSTRCTR WAY</div><h2>Your 4-stage pathway<br/>to confident driving.</h2></div><p>Simple milestones help turn first-day nerves into steady skills for the road ahead.</p></div><div className="journey-grid">
        <article className="journey-card"><div className="journey-top"><span className="journey-number">01</span><span className="journey-tag">START HERE</span></div><h3>Match &amp; get comfortable</h3><p>Share your goals and start with the vehicle and learning style that suit you.</p><div className="journey-foot">A calm first step <span>↗</span></div></article>
        <article className="journey-card"><div className="journey-top"><span className="journey-number">02</span><span className="journey-tag">BUILD BASICS</span></div><h3>Learn the fundamentals</h3><p>Practice balance, controls, observation, and the habits that keep you safe.</p><div className="journey-foot">Skills before speed <span>↗</span></div></article>
        <article className="journey-card"><div className="journey-top"><span className="journey-number">03</span><span className="journey-tag">REAL ROADS</span></div><h3>Grow into city driving</h3><p>Bring your skills together on everyday roads, at a pace that feels right.</p><div className="journey-foot">Practice with support <span>↗</span></div></article>
        <article className="journey-card"><div className="journey-top"><span className="journey-number">04</span><span className="journey-tag">DRIVE CONFIDENTLY</span></div><h3>Ready for what’s next</h3><p>Keep building independence and take your next driving steps with confidence.</p><div className="journey-foot">Your road, from here <span>↗</span></div></article>
      </div></section>
      <section className="impact" id="impact"><div className="impact-inner"><div className="impact-title"><div className="eyebrow light">A LITTLE PROOF GOES A LONG WAY</div><h2>Good driving<br/>changes everything.</h2><p>And it starts with the people who teach it. We’re building a community that helps more people move through life with confidence.</p><a href="#join" className="button light-button">Be part of it <span>↗</span></a></div><div className="stats"><div className="stat"><span className="stat-icon">✳</span><strong>36<span>+</span></strong><b>driving experts</b><small>Ready to guide your journey</small></div><div className="stat"><span className="stat-icon">↗</span><strong>2.4<span>k</span></strong><b>learners empowered</b><small>And many more to come</small></div><div className="stat"><span className="stat-icon">⌖</span><strong>8</strong><b>cities and growing</b><small>Local expertise, near you</small></div></div></div><div className="impact-note">THE ROAD IS BETTER WHEN WE TAKE IT TOGETHER <span>✳</span></div></section>
      <section id="cities" className="cities section"><div className="cities-copy"><div className="eyebrow">LOCAL KNOW-HOW, RIGHT AROUND THE CORNER</div><h2>Driving lessons,<br/>closer to home.</h2><p>Find Instrctr across the north Andhra coast and nearby districts.</p><div className="availability-note"><span className="live-dot"/> SIX LOCATIONS AND GROWING</div></div><div className="coverage-panel"><div className="coverage-heading"><div><span className="coverage-kicker">CURRENTLY AVAILABLE</span><h3>Our locations</h3></div><span className="coverage-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg></span></div><div className="location-grid"><div className="location-card"><span className="location-pin">01</span><b>Visakhapatnam</b><small>Coastal hub</small><span className="location-arrow">↗</span></div><div className="location-card"><span className="location-pin">02</span><b>Vizianagaram</b><small>Local instructors</small><span className="location-arrow">↗</span></div><div className="location-card"><span className="location-pin">03</span><b>Srikakulam</b><small>Local instructors</small><span className="location-arrow">↗</span></div><div className="location-card"><span className="location-pin">04</span><b>Parvathipuram</b><small>Local instructors</small><span className="location-arrow">↗</span></div><div className="location-card"><span className="location-pin">05</span><b>Kakinada</b><small>Local instructors</small><span className="location-arrow">↗</span></div><div className="location-card"><span className="location-pin">06</span><b>Rajahmundry</b><small>Local instructors</small><span className="location-arrow">↗</span></div></div><div className="coverage-footer"><span>✳</span> Building a stronger driving community across Andhra Pradesh</div></div></section>
      <section className="join" id="join"><div className="join-inner"><div className="join-copy"><div className="eyebrow light">FOR THE PEOPLE WHO MAKE IT POSSIBLE</div><h2>Good at teaching?<br/><span>Let’s get moving.</span></h2><p>Bring your experience to a community that puts learners first. Tell us a little about yourself and we’ll be in touch.</p><div className="join-points"><div><span>01</span>Flexible teaching opportunities</div><div><span>02</span>Meet learners in your area</div><div><span>03</span>Grow with a driving-first community</div></div><div className="join-decoration">i<span>n</span>.</div></div>
        <div className="form-card"><div className="form-heading"><span>INSTRUCTOR APPLICATION</span><b>Let’s start with you.</b><small>Fields marked * are required.</small></div>{sent ? <div className="success"><span>✓</span><h3>Thanks for raising your hand!</h3><p>Your details are ready. Our team will be in touch soon.</p><button onClick={() => setSent(false)}>Submit another response</button></div> : <form onSubmit={submitForm}><div className="form-row"><label>Full name *<input name="name" placeholder="e.g. Alex Kumar" required /></label><label>Phone number *<input name="phone" type="tel" placeholder="+91 98765 43210" required /></label></div><label>Email address *<input name="email" type="email" placeholder="you@example.com" required /></label><div className="form-row"><label>City *<select required value={city} onChange={e => { setCity(e.target.value); setArea(''); }}><option value="" disabled>Select your city</option>{Object.keys(areas).map(name => <option key={name}>{name}</option>)}</select></label><label>Area / neighbourhood *<select required disabled={!city} value={area} onChange={e => setArea(e.target.value)}><option value="" disabled>{city ? 'Select your area' : 'Choose a city first'}</option>{(areas[city] || []).map(areaName => <option key={areaName} value={areaName.trim()}>{areaName.trim()}</option>)}</select></label></div><fieldset><legend>What would you like to teach? *</legend><div className="choices"><label><input type="checkbox" name="vehicle" value="car"/> <span>🚘</span> Car</label><label><input type="checkbox" name="vehicle" value="two-wheeler"/> <span>🛵</span> Two-wheeler</label></div></fieldset><label>Driving licence number *<input name="licence" placeholder="Enter your licence number" required /></label><label className="upload-label">Upload your driving licence *<div className="upload"><span className="upload-icon">↑</span><span><b>Choose a file</b> or drag it here<small>JPG, PNG or PDF · Max 10 MB</small></span><input type="file" required accept="image/*,.pdf" onChange={e => setFiles(Array.from(e.target.files || []).map(f => f.name))}/></div>{files.length > 0 && <small className="file-name">✓ {files.join(', ')}</small>}</label><label className="checkline"><input type="checkbox" required/> I agree to be contacted about instructor opportunities.</label><button className="button submit" type="submit">Send my application <span>↗</span></button><p className="privacy">Your information stays with us. We’ll only use it to follow up on your application.</p></form>}</div>
      </div></section>
      <section className="app-banner"><div className="app-spark">✳</div><div><div className="eyebrow">YOUR NEXT MOVE IS ALMOST HERE</div><h2>The Instrctr app is coming soon.</h2><p>Driving classes, local experts, and your learning journey — all in one place.</p></div><div className="store-buttons"><span className="store-badge"><span className="store-icon">▶</span><span><small>COMING SOON TO</small><b>Google Play</b></span></span><span className="store-badge"><span className="apple-icon">●</span><span><small>COMING SOON TO</small><b>App Store</b></span></span></div></section>
    </main>
    <footer><div className="footer-main"><div className="footer-brand"><a className="brand" href="#home"><span><span className="brand-i">i</span>nstrctr<span className="brand-dot">.</span></span></a><p>Learn with confidence.<br/>Drive with freedom.</p></div><div><b>EXPLORE</b><a href="#services">Our services</a><a href="#journey">Learning path</a><a href="#impact">Our impact</a><a href="#cities">Cities</a></div><div><b>JOIN US</b><a href="#join">Become an instructor</a><a href="#join">Partner with Instrctr</a></div><div className="footer-app"><b>COMING SOON</b><p>Your next journey, in your pocket.</p><div className="footer-stores"><span>▶ Google Play</span><span>● App Store</span></div></div></div><div className="footer-bottom"><span>© 2026 Instrctr. All roads lead somewhere.</span><span>MADE FOR THE ROAD <b>✳</b></span></div></footer>
  </>;
}
