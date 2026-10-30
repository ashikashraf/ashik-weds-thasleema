import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  CalendarDays,
  ChevronDown,
  Clock3,
  Download,
  Heart,
  Loader2,
  MapPin,
  Menu,
  MessageCircle,
  Music2,
  Pause,
  Sparkles,
  X,
} from "lucide-react";
import Lenis from "lenis";

import coupleImage from "@/assets/wedding-couple.png";
import floralCorner from "@/assets/floral-corner.png";
import galleryFlowers from "@/assets/gallery-flowers.jpg";
import galleryRings from "@/assets/gallery-rings.jpg";
import galleryTextile from "@/assets/gallery-textile.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";

const receptionDate = new Date("2026-11-29T11:30:00+05:30");
const receptionMaps = "https://www.google.com/maps/search/?api=1&query=Zawaj+Capitol+Kallekad";

function Ornament({ label }: { label?: string }) {
  return (
    <div className="ornament" aria-hidden={label ? undefined : true}>
      <span />
      <Heart className="h-3.5 w-3.5 fill-current" />
      <span />
      {label && <span className="sr-only">{label}</span>}
    </div>
  );
}

function useCountdown() {
  const calculate = () => {
    const difference = Math.max(0, receptionDate.getTime() - Date.now());
    return {
      days: Math.floor(difference / 86_400_000),
      hours: Math.floor((difference / 3_600_000) % 24),
      minutes: Math.floor((difference / 60_000) % 60),
      seconds: Math.floor((difference / 1_000) % 60),
    };
  };
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    setTime(calculate());
    const timer = window.setInterval(() => setTime(calculate()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  return time;
}

function RollingDigit({ value }: { value: number }) {
  return (
    <span key={value} className="rolling-digit inline-block">
      {String(value).padStart(2, "0")}
    </span>
  );
}

function Countdown() {
  const time = useCountdown();
  return (
    <div className="countdown" aria-label="Countdown to the wedding reception">
      {Object.entries(time).map(([label, value]) => (
        <div key={label} className="countdown-item">
          <strong><RollingDigit value={value} /></strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function Opening({ onOpen, isOpening }: { onOpen: () => void; isOpening?: boolean }) {
  return (
    <div className={`opening ${isOpening ? "is-opening-out" : ""}`} role="dialog" aria-modal="true" aria-label="Wedding invitation">
      <img src={floralCorner} alt="" className="opening-floral" />
      <div className="envelope">
        <div className="envelope-flap" />
        <div className="invitation-card">
          <span className="eyebrow">29 · 11 · 2026</span>
          <Heart className="seal-heart" aria-hidden="true" />
          <h2>You Are Invited</h2>
          <p>Ashik &amp; Thasleema</p>
          <Button size="lg" onClick={onOpen} className="invitation-button">
            Open Invitation
          </Button>
        </div>
      </div>
    </div>
  );
}

function Navigation() {
  const [open, setOpen] = useState(false);
  const links: [string, string][] = [
    ["Home", "#home"],
    ["Details", "#details"],
    ["Nikah", "#nikah"],
    ["Reception", "#reception"],
    ["Location", "#location"],
    ["Wishes", "#wishes"],
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      setOpen(false);
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="floating-nav" aria-label="Wedding invitation navigation">
      <a href="#home" className="nav-monogram" aria-label="Ashik and Thasleema home" onClick={(e) => handleScroll(e, "#home")}>A <Heart /> T</a>
      <div className="desktop-links">
        {links.map(([name, href]) => <a key={href} href={href} onClick={(e) => handleScroll(e, href)}>{name}</a>)}
      </div>
      <Button variant="ghost" size="icon" className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle menu">
        {open ? <X /> : <Menu />}
      </Button>
      {open && (
        <div className="mobile-links">
          {links.map(([name, href]) => <a key={href} href={href} onClick={(e) => handleScroll(e, href)}>{name}</a>)}
        </div>
      )}
    </nav>
  );
}

function Particles() {
  const particles = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    duration: `${10 + Math.random() * 15}s`,
    delay: `-${Math.random() * 20}s`,
    size: `${8 + Math.random() * 10}px`,
    rotation: `${Math.random() * 360}deg`
  }));
  return (
    <div className="particles-container" aria-hidden="true">
      {particles.map(p => (
        <div key={p.id} className="particle" style={{ left: p.left, width: p.size, height: p.size, "--duration": p.duration, "--delay": p.delay, "--start-rot": p.rotation } as React.CSSProperties} />
      ))}
    </div>
  );
}

function Hero() {
  return (
    <header id="home" className="hero">
      <Particles />
      <img src={floralCorner} alt="" className="hero-floral hero-floral-left" />
      <img src={floralCorner} alt="" className="hero-floral hero-floral-right" />
      <div className="gold-arch" aria-hidden="true" />
      <div className="hero-copy">
        <p className="hero-quote">"Two souls, one heart, beginning a beautiful journey together."</p>
        <Ornament />
        <p className="eyebrow">You are invited</p>
        <h1><span>Ashik Ashraf</span><small>with</small><span>Thasleema M</span></h1>
        <p className="script-title">Reception</p>
        <p className="hero-date">Sunday · 29 November 2026</p>
        <Countdown />
        <Button asChild variant="outline" size="lg" className="view-button">
          <a href="#details">View Invitation <ChevronDown /></a>
        </Button>
      </div>
      <img src={coupleImage} width={896} height={1200} alt="Watercolor illustration of the bride and groom in sage and ivory wedding attire" className="couple-image" />
    </header>
  );
}

function SectionHeading({ eyebrow, children }: { eyebrow?: string; children: React.ReactNode }) {
  return (
    <div className="section-heading reveal">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="reveal-group">
        {typeof children === "string" ? (
          children.split(' ').map((word, i) => (
            <span key={i} className="inline-block overflow-hidden mr-[0.25em] align-bottom pb-2">
              <span className="split-word reveal-child">{word}</span>
            </span>
          ))
        ) : (
          children
        )}
      </h2>
      <Ornament />
    </div>
  );
}

function FamilyDetails() {
  return (
    <section id="details" className="section family-section">
      <img src={floralCorner} alt="" loading="lazy" className="section-floral section-floral-left" />
      <div className="section-inner">
        <SectionHeading eyebrow="Together with our families">With Joy in Our Hearts</SectionHeading>
        <div className="family-grid reveal-group">
          <article className="reveal-child">
            <h3>Ashik Ashraf</h3>
            <p className="relation">S/o Mr. Ashraf.S &amp; Mrs. Sara.V</p>
            <p>Aisha Manzil, Kanjiraparmbu,<br />Kavilpaad, Olavakkode</p>
          </article>
          <div className="and-mark reveal-child">and</div>
          <article className="reveal-child">
            <h3>Thasleema M</h3>
            <p className="relation">D/o Mr. Muhammad musthafa A &amp;<br />Mrs. Nazeerabanu R (Late)</p>
            <p>Puthan Kalam House,<br />Chithali</p>
          </article>
        </div>
      </div>
    </section>
  );
}

function InfoItem({ icon: Icon, title, children }: { icon: typeof CalendarDays; title: string; children: React.ReactNode }) {
  return (
    <div className="info-item">
      <Icon aria-hidden="true" />
      <div><span>{title}</span><p>{children}</p></div>
    </div>
  );
}

function Reception() {
  return (
    <section id="reception" className="section reception-section">
      <div className="section-inner reception-inner">
        <SectionHeading eyebrow="The celebration">Reception</SectionHeading>
        <div className="date-lockup reveal">
          <span>Sunday</span>
          <div><i>November</i><strong>29</strong><i>2026</i></div>
          <p>11:30 AM to 2:30 PM</p>
        </div>
        <div className="details-row reveal">
          <InfoItem icon={CalendarDays} title="Date">29 November 2026</InfoItem>
          <InfoItem icon={Clock3} title="Time">11:30 AM – 2:30 PM</InfoItem>
          <InfoItem icon={MapPin} title="Venue">Zawaj Capitol, Kallekad</InfoItem>
        </div>
        <Button asChild size="lg" className="gold-button"><a href={receptionMaps} target="_blank" rel="noreferrer"><MapPin /> Get Directions</a></Button>
      </div>
    </section>
  );
}

function Nikah() {
  return (
    <section id="nikah" className="section nikah-section">
      <img src={floralCorner} alt="" loading="lazy" className="section-floral section-floral-right" />
      <div className="section-inner nikah-inner reveal">
        <Sparkles className="nikah-icon" aria-hidden="true" />
        <p className="eyebrow">The sacred union</p>
        <h2>Nikah</h2>
        <Ornament />
        <h3>Crown Palace</h3>
        <p>Kuzhalmannam</p>
        <div className="nikah-date"><strong>28</strong><span>November 2026<br />11:30 AM – 12:00 PM</span></div>
      </div>
    </section>
  );
}

function Timeline() {
  return (
    <section className="section timeline-section">
      <div className="section-inner narrow">
        <SectionHeading eyebrow="Two cherished moments">Our Celebration</SectionHeading>
        <div className="timeline reveal-group">
          <article className="reveal-child"><span className="timeline-dot" /><time>28 November 2026</time><h3>Nikah</h3><p>11:30 AM – 12:00 PM</p><small>Crown Palace, Kuzhalmannam</small></article>
          <article className="reveal-child"><span className="timeline-dot" /><time>29 November 2026</time><h3>Wedding Reception</h3><p>11:30 AM – 2:30 PM</p><small>Zawaj Capitol, Kallekad</small></article>
        </div>
      </div>
    </section>
  );
}

function LocationRouteMap() {
  return (
    <section id="location" className="section venue-section">
      <div className="section-inner">
        <SectionHeading eyebrow="Directions & Route">Location Route Map</SectionHeading>
        <div className="venue-grid single-venue reveal-group">
          <article className="reveal-child">
            <iframe
              title="Route Map for Zawaj Capitol, Kallekad"
              loading="lazy"
              src="https://www.google.com/maps?q=Zawaj%20Capitol%20Kallekad&output=embed"
            />
            <div>
              <span>Reception Route</span>
              <h3>Zawaj Capitol</h3>
              <p>Kallekad</p>
              <a href={receptionMaps} target="_blank" rel="noreferrer">
                Get Directions <MapPin />
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function Quote() {
  return (
    <section className="quote-section section">
      <img src={floralCorner} alt="" loading="lazy" className="quote-floral" />
      <div className="reveal"><Ornament /><blockquote>“Together with our families, we invite you to share in the joy of our special day.”</blockquote><p>Ashik &amp; Thasleema</p></div>
    </section>
  );
}

const gallery = [
  { src: galleryFlowers, alt: "Ivory roses, jasmine, eucalyptus and gold wedding ribbon", width: 1024, height: 1280 },
  { src: galleryRings, alt: "Antique gold wedding rings with jasmine and eucalyptus", width: 1280, height: 1024 },
  { src: galleryTextile, alt: "Sage and ivory bridal fabrics with intricate gold embroidery", width: 1024, height: 1280 },
];

function TiltCard({ image, onClick }: { image: any; onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -8;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 8;
    ref.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };
  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };
  return (
    <button ref={ref} type="button" className="reveal-child tilt-card" onClick={onClick} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} aria-label={`Enlarge ${image.alt}`}>
      <img src={image.src} alt={image.alt} loading="lazy" width={image.width} height={image.height} />
    </button>
  );
}

function Gallery() {
  const [selected, setSelected] = useState<(typeof gallery)[number] | null>(null);
  return (
    <section className="section gallery-section">
      <div className="section-inner">
        <SectionHeading eyebrow="A glimpse of what awaits">Moments of Love</SectionHeading>
        <div className="gallery-grid reveal-group">
          {gallery.map((image) => <TiltCard key={image.src} image={image} onClick={() => setSelected(image)} />)}
        </div>
      </div>
      {selected && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Enlarged gallery image" onClick={() => setSelected(null)}><Button variant="ghost" size="icon" onClick={() => setSelected(null)} aria-label="Close gallery"><X /></Button><img src={selected.src} alt={selected.alt} /></div>}
    </section>
  );
}

function loadCanvasImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function generateWishCardImage(data: {
  name: string;
  wish: string;
}): Promise<string> {
  const canvas = document.createElement("canvas");
  const width = 1000;
  const height = 1420;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // 1. Preload moments assets
  const [ringsImg, floralImg] = await Promise.all([
    loadCanvasImage(galleryRings),
    loadCanvasImage(floralCorner),
  ]);

  // 2. Background: Moments of Love (Rings & Jasmine) with royal emerald overlay
  if (ringsImg) {
    const scale = Math.max(width / ringsImg.width, height / ringsImg.height);
    const sw = width / scale;
    const sh = height / scale;
    const sx = (ringsImg.width - sw) / 2;
    const sy = (ringsImg.height - sh) / 2;
    ctx.drawImage(ringsImg, sx, sy, sw, sh, 0, 0, width, height);

    // Opulent deep emerald overlay allowing the gold rings & jasmine texture to shine softly
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, "rgba(18, 38, 30, 0.88)");
    bgGrad.addColorStop(0.3, "rgba(10, 24, 18, 0.90)");
    bgGrad.addColorStop(0.65, "rgba(7, 16, 12, 0.94)");
    bgGrad.addColorStop(1, "rgba(4, 10, 8, 0.97)");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);
  } else {
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, "#132820");
    bgGrad.addColorStop(0.5, "#0b1a14");
    bgGrad.addColorStop(1, "#060f0c");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);
  }

  // Soft golden radial starlight glow in center
  const glow = ctx.createRadialGradient(
    width / 2,
    height * 0.45,
    60,
    width / 2,
    height * 0.45,
    550
  );
  glow.addColorStop(0, "rgba(212, 175, 55, 0.15)");
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  // 3. Delicate Floral Corners (using moments floralCorner)
  if (floralImg) {
    ctx.save();
    ctx.globalAlpha = 0.45;
    ctx.drawImage(floralImg, 32, 32, 190, 190);
    ctx.translate(width - 32, 32);
    ctx.scale(-1, 1);
    ctx.drawImage(floralImg, 0, 0, 190, 190);
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.translate(32, height - 32);
    ctx.scale(1, -1);
    ctx.drawImage(floralImg, 0, 0, 170, 170);
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.translate(width - 32, height - 32);
    ctx.scale(-1, -1);
    ctx.drawImage(floralImg, 0, 0, 170, 170);
    ctx.restore();
  }

  // 4. Double Golden Border
  ctx.strokeStyle = "rgba(212, 175, 55, 0.6)";
  ctx.lineWidth = 3;
  ctx.strokeRect(36, 36, width - 72, height - 72);

  ctx.strokeStyle = "rgba(212, 175, 55, 0.35)";
  ctx.lineWidth = 1;
  ctx.strokeRect(48, 48, width - 96, height - 96);

  // Corner Diamond Accents
  const corners: [number, number][] = [
    [48, 48],
    [width - 48, 48],
    [48, height - 48],
    [width - 48, height - 48],
  ];
  ctx.fillStyle = "#d4af37";
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  // 5. Header: Wedding Monogram & Title
  ctx.textAlign = "center";
  ctx.fillStyle = "#d4af37";
  ctx.font = "600 15px 'Montserrat', sans-serif";
  ctx.fillText("WEDDING CELEBRATION", width / 2, 98);

  // Couple Names
  ctx.fillStyle = "#ffffff";
  ctx.font = "italic 48px 'Playfair Display', Georgia, serif";
  ctx.fillText("Ashik & Thasleema", width / 2, 155);

  // 6. Featured Moments Cameo Medallion (Rings & Jasmine)
  const cameoY = 245;
  const cameoR = 60;
  if (ringsImg) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(width / 2, cameoY, cameoR, 0, Math.PI * 2);
    ctx.clip();

    const cScale = Math.max((cameoR * 2) / ringsImg.width, (cameoR * 2) / ringsImg.height);
    const cW = ringsImg.width * cScale;
    const cH = ringsImg.height * cScale;
    ctx.drawImage(ringsImg, width / 2 - cW / 2, cameoY - cH / 2, cW, cH);
    ctx.restore();

    ctx.strokeStyle = "#d4af37";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(width / 2, cameoY, cameoR + 2, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(255, 235, 175, 0.6)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(width / 2, cameoY, cameoR + 6, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "#d4af37";
    ctx.font = "14px 'Montserrat', sans-serif";
    ctx.fillText("✦", width / 2 - cameoR - 22, cameoY + 5);
    ctx.fillText("✦", width / 2 + cameoR + 22, cameoY + 5);
  }

  // Section Subtitle
  ctx.fillStyle = "rgba(243, 229, 171, 0.9)";
  ctx.font = "500 18px 'Montserrat', sans-serif";
  ctx.fillText("HEARTFELT BLESSINGS & WISHES", width / 2, 345);

  // 7. Frosted Glass Wish Card Container
  const boxX = 85;
  const boxY = 380;
  const boxW = width - 170;
  const boxH = 750;
  const radius = 24;

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxW, boxH, radius);
  ctx.fillStyle = "rgba(255, 255, 255, 0.055)";
  ctx.fill();
  ctx.strokeStyle = "rgba(212, 175, 55, 0.45)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  // Quotation Marks
  ctx.fillStyle = "rgba(212, 175, 55, 0.28)";
  ctx.font = "italic 110px 'Playfair Display', Georgia, serif";
  ctx.fillText("“", boxX + 60, boxY + 95);

  // 8. Draw Word-Wrapped Wish Content
  const wishText = data.wish.trim();
  let fontSize = 32;
  let lineHeight = 48;
  if (wishText.length > 250) {
    fontSize = 24;
    lineHeight = 36;
  } else if (wishText.length > 140) {
    fontSize = 28;
    lineHeight = 42;
  }

  ctx.fillStyle = "#fffbf2";
  ctx.font = `italic ${fontSize}px 'Playfair Display', Georgia, serif`;

  const maxTextWidth = boxW - 140;
  const words = wishText.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxTextWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);

  const maxAllowedLines = 9;
  const displayLines = lines.slice(0, maxAllowedLines);
  if (lines.length > maxAllowedLines) {
    displayLines[maxAllowedLines - 1] += "...";
  }

  const textBlockHeight = displayLines.length * lineHeight;
  const textStartY = boxY + 130 + Math.max(0, (350 - textBlockHeight) / 2);

  displayLines.forEach((line, idx) => {
    ctx.fillText(line, width / 2, textStartY + idx * lineHeight);
  });

  ctx.fillStyle = "rgba(212, 175, 55, 0.28)";
  ctx.font = "italic 110px 'Playfair Display', Georgia, serif";
  ctx.fillText("”", width - boxX - 60, boxY + 490);

  // Inner Divider
  ctx.strokeStyle = "rgba(212, 175, 55, 0.3)";
  ctx.beginPath();
  ctx.moveTo(width / 2 - 130, boxY + boxH - 180);
  ctx.lineTo(width / 2 + 130, boxY + boxH - 180);
  ctx.stroke();

  // Guest Name Badge
  ctx.fillStyle = "rgba(212, 175, 55, 0.8)";
  ctx.font = "500 16px 'Montserrat', sans-serif";
  ctx.fillText("WITH LOVE & PRAYERS FROM", width / 2, boxY + boxH - 130);

  ctx.fillStyle = "#f5d378";
  ctx.font = "600 38px 'Playfair Display', Georgia, serif";
  ctx.fillText(data.name.trim(), width / 2, boxY + boxH - 75);

  // 9. Footer (Date & Location watermark)
  ctx.fillStyle = "rgba(212, 175, 55, 0.85)";
  ctx.font = "600 17px 'Montserrat', sans-serif";
  ctx.fillText("SUNDAY · 29 NOVEMBER 2026", width / 2, height - 130);

  ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
  ctx.font = "16px 'Montserrat', sans-serif";
  ctx.fillText("Zawaj Capitol, Kallekad, Palakkad", width / 2, height - 95);

  ctx.fillStyle = "rgba(212, 175, 55, 0.4)";
  ctx.font = "13px 'Montserrat', sans-serif";
  ctx.fillText("ashik-weds-thasleema", width / 2, height - 65);

  return canvas.toDataURL("image/png");
}

function Wishes() {
  const [guestName, setGuestName] = useState("");
  const [guestWish, setGuestWish] = useState("");
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    wish: string;
    cardImageUrl?: string;
    whatsappUrl: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSendAnotherWish = () => {
    setSubmittedData(null);
    setLoading(false);
    setErrorMessage(null);
    setGuestName("");
    setGuestWish("");
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = guestName.trim();
    const wish = guestWish.trim();

    if (!name || !wish) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      // 1. Save to Supabase 'wishes' table
      const { error } = await supabase.from("wishes").insert([{ name, wish }]);

      if (error) {
        console.error("Supabase insert error:", error);
        if (error.code === "PGRST205") {
          console.warn(
            "Supabase table 'wishes' does not exist yet. Please create it in your Supabase SQL editor."
          );
        }
      }

      // 2. LocalStorage backup / offline cache
      try {
        const existing = JSON.parse(
          window.localStorage.getItem("ashik-thasleema-wishes") || "[]"
        );
        const updated = [
          { name, wish, timestamp: new Date().toISOString() },
          ...existing,
        ];
        window.localStorage.setItem(
          "ashik-thasleema-wishes",
          JSON.stringify(updated)
        );
      } catch {
        /* Local storage fallback */
      }

      // 3. Generate beautiful visual wish card with Moments assets
      const cardImageUrl = await generateWishCardImage({ name, wish });

      // 4. WhatsApp share URL to +91 9633596679
      const targetNumber = "919633596679";
      const formattedMessage = [
        `💍 *Wedding Wishes for Ashik & Thasleema* 💍`,
        ``,
        `👤 *From:* ${name}`,
        `💌 *Wish:* "${wish}"`,
        ``,
        `✨ *Wedding Reception: 29 November 2026 · Zawaj Capitol, Kallekad* ✨`,
      ].join("\n");

      const whatsappUrl = `https://api.whatsapp.com/send?phone=${targetNumber}&text=${encodeURIComponent(formattedMessage)}`;

      setSubmittedData({
        name,
        wish,
        cardImageUrl,
        whatsappUrl,
      });
    } catch (err: any) {
      console.error("Error submitting wish:", err);
      setErrorMessage(
        "Could not send your wish. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="wishes" className="section rsvp-section wishes-section">
      <img src={floralCorner} alt="" loading="lazy" className="section-floral section-floral-left" />
      <img src={floralCorner} alt="" loading="lazy" className="section-floral section-floral-right" />
      <div className="section-inner narrow">
        <div className="wishes-moments-pill reveal">
          <img src={galleryRings} alt="Wedding Rings" />
          <span>Moments of Love &amp; Blessings</span>
        </div>
        <SectionHeading eyebrow="Send Your Blessings">Wishes &amp; Blessings</SectionHeading>
        <p className="rsvp-intro">Your warm wishes, prayers, and heartfelt blessings mean the world to us.</p>
        {submittedData ? (
          <div className="rsvp-success animate-scale-in" role="status">
            <Heart className="fill-current text-gold mx-auto" />
            <h3>Thank You, {submittedData.name}!</h3>
            <p>Your heartfelt blessings have been received with deep love &amp; gratitude.</p>

            {submittedData.cardImageUrl && (
              <div className="wish-card-container">
                <img
                  src={submittedData.cardImageUrl}
                  alt={`Wedding wish card from ${submittedData.name}`}
                />
              </div>
            )}

            <div className="wish-actions-group">
              <a
                href={submittedData.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-action-btn"
              >
                <MessageCircle /> Send to WhatsApp (+91 96335 96679)
              </a>

              {submittedData.cardImageUrl && (
                <a
                  href={submittedData.cardImageUrl}
                  download={`wedding-wish-${submittedData.name.replace(/\s+/g, "-")}.png`}
                  className="download-action-btn"
                >
                  <Download /> Download Wish Card
                </a>
              )}
            </div>

            <div className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleSendAnotherWish}
              >
                Send Another Wish
              </Button>
            </div>
          </div>
        ) : (
          <form className="rsvp-form" onSubmit={submit}>
            {errorMessage && (
              <div
                className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md"
                role="alert"
              >
                {errorMessage}
              </div>
            )}
            <label>
              Guest Name
              <Input
                name="name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
                maxLength={100}
                placeholder="Your full name"
                disabled={loading}
              />
            </label>
            <label>
              Your Wish
              <Textarea
                name="wish"
                value={guestWish}
                onChange={(e) => setGuestWish(e.target.value)}
                required
                maxLength={500}
                rows={4}
                placeholder="Share your heartfelt wishes or prayers for the couple..."
                disabled={loading}
              />
            </label>
            <Button
              type="submit"
              size="lg"
              className="gold-button flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Sending Wishes...
                </>
              ) : (
                <>
                  Send Wishes <Heart />
                </>
              )}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}

function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<{ context: AudioContext; oscillators: OscillatorNode[] } | null>(null);
  const toggle = () => {
    if (audioRef.current) {
      audioRef.current.oscillators.forEach((oscillator) => oscillator.stop());
      void audioRef.current.context.close();
      audioRef.current = null; setPlaying(false); return;
    }
    const AudioContextClass = window.AudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const gain = context.createGain();
    gain.gain.value = 0.018; gain.connect(context.destination);
    const oscillators = [261.63, 329.63, 392].map((frequency) => {
      const oscillator = context.createOscillator(); oscillator.type = "sine"; oscillator.frequency.value = frequency; oscillator.connect(gain); oscillator.start(); return oscillator;
    });
    audioRef.current = { context, oscillators }; setPlaying(true);
  };
  useEffect(() => () => { audioRef.current?.oscillators.forEach((oscillator) => oscillator.stop()); void audioRef.current?.context.close(); }, []);
  return <Button size="icon" onClick={toggle} className={`music-button ${playing ? "playing" : ""}`} aria-label={playing ? "Pause ambient music" : "Play ambient music"}>{playing ? <Pause /> : <Music2 />}</Button>;
}

function Footer() {
  return <footer><Ornament /><p>With love,</p><h2>Ashik &amp; Thasleema</h2><time>29 November 2026</time></footer>;
}

function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    let animationFrame: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("button") || target.closest("a") || target.closest("input") || target.closest("textarea")) {
        cursorRef.current?.classList.add("cursor-hover");
      } else {
        cursorRef.current?.classList.remove("cursor-hover");
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);

    const render = () => {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      if (cursorRef.current && dotRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
      animationFrame = requestAnimationFrame(render);
    };
    animationFrame = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="custom-cursor-dot" aria-hidden="true" />
    </>
  );
}

export function WeddingInvitation() {
  const [opened, setOpened] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    setIsOpening(true);
    setTimeout(() => {
      setOpened(true);
    }, 1300); // 1.3 seconds matches the new animation timing
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          const children = Array.from(entry.target.querySelectorAll(".reveal-child"));
          children.forEach((child, index) => {
            (child as HTMLElement).style.transitionDelay = `${index * 120}ms`;
            child.classList.add("revealed");
          });
        } else {
          entry.target.classList.remove("revealed");
          const children = Array.from(entry.target.querySelectorAll(".reveal-child"));
          children.forEach((child) => {
            (child as HTMLElement).style.transitionDelay = "0ms";
            child.classList.remove("revealed");
          });
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    const nodes = document.querySelectorAll(".reveal, .reveal-group, .reveal-scale");
    nodes.forEach((node) => observer.observe(node));

    const lenis = new Lenis({ autoRaf: true });

    lenis.on("scroll", (e: any) => {
      const scrollY = e.animatedScroll;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      document.documentElement.style.setProperty("--scroll-y", `${scrollY}px`);
      document.documentElement.style.setProperty("--scroll-progress", `${progress}%`);
    });
    
    return () => {
      observer.disconnect();
      lenis.destroy();
    };
  }, [opened]);
  const opening = useMemo(() => !opened && <Opening onOpen={handleOpen} isOpening={isOpening} />, [opened, isOpening]);
  return (
    <main className={opened ? "invitation-open" : "invitation-closed"}>
      <Cursor />
      {opening}
      <Navigation />
      <Hero />
      <FamilyDetails />
      <Nikah />
      <Reception />
      <Timeline />
      <LocationRouteMap />
      <Quote />
      <Gallery />
      <Wishes />
      <Footer />
      <MusicPlayer />
    </main>
  );
}