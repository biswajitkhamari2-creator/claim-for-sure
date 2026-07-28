import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Shield, CheckCircle2, Lock, Scale, Phone, FileCheck, Clock, Award, ArrowRight, Star, Gift, Sparkles, FileText, ShieldCheck, Eye, HeartHandshake } from "lucide-react";
import WhyBuyThroughUsSection from "@/components/home/WhyBuyThroughUsSection";
import { BrandLockup } from "@/components/BrandLockup";
import { LeadForm } from "@/components/leads/LeadForm";

function TypeEraseText({ text, className = "" }: { text: string; className?: string }) {
  const [shown, setShown] = useState("");
  const stateRef = useRef({ i: 0, dir: 1 as 1 | -1, pause: 0 });

  useEffect(() => {
    const id = setInterval(() => {
      const s = stateRef.current;
      if (s.pause > 0) { s.pause -= 1; return; }
      s.i += s.dir;
      if (s.i >= text.length) { s.i = text.length; s.dir = -1; s.pause = 22; }
      else if (s.i <= 0) { s.i = 0; s.dir = 1; s.pause = 6; }
      setShown(text.slice(0, s.i));
    }, 80);
    return () => clearInterval(id);
  }, [text]);

  const palette = ["#e11d48", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899"];

  return (
    <span className={className} aria-label={text}>
      <span className="font-serif italic font-bold normal-case tracking-normal">
        {shown.split("").map((ch, idx) =>
          ch === " " ? (
            <span key={idx}>&nbsp;</span>
          ) : (
            <span key={idx} style={{ color: palette[idx % palette.length] }}>{ch}</span>
          )
        )}
      </span>
      <span
        className="ml-0.5 inline-block w-[1px] animate-pulse align-middle"
        style={{ height: "0.9em", background: palette[shown.length % palette.length] }}
        aria-hidden="true"
      />
    </span>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Insurance Claim Help & Policy Buying in India | ClaimForSure" },
      { name: "description", content: "File, track, and recover rejected or delayed insurance claims in India. Expert help across health, motor, life, and property. Transparent fees." },
      { property: "og:title", content: "Insurance Claim Help & Policy Buying in India | ClaimForSure" },
      { property: "og:description", content: "Expert insurance claim recovery and policy buying in India — transparent fees, end-to-end support." },
      { property: "og:url", content: "https://www.claimforsure.in/" },
      { property: "og:image", content: "https://www.claimforsure.in/favicon.png" },
      { name: "twitter:image", content: "https://www.claimforsure.in/favicon.png" },
      { name: "keywords", content: "insurance claim help, rejected claim, health insurance claim, motor insurance claim, life insurance claim, claim settlement India, IRDAI claim assistance" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
    ],
    links: [{ rel: "canonical", href: "https://www.claimforsure.in/" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        serviceType: "Insurance Claim Assistance",
        provider: { "@id": "https://www.claimforsure.in/#organization" },
        areaServed: { "@type": "Country", name: "India" },
        description: "End-to-end help filing, tracking, and recovering rejected or delayed insurance claims across health, motor, life, and property categories.",
        url: "https://www.claimforsure.in/",
      }),
    }],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <UdyamRibbon />
        <TrustBadges />
        <TrustBar />
        <Services />
        <Process />
        <WhyTrust />
        <WhyBuyThroughUsSection />
        <Testimonials />
        <FAQ />
        <AppreciationSection />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center" aria-label="Claim For Sure — by Sidheswar Enterprises">
          <BrandLockup size="sm" layout="inline" />
        </a>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <Link to="/claim-help" className="hover:text-foreground">Claim Help</Link>
          <Link to="/policies" className="font-semibold text-primary hover:text-foreground">Buy Insurance</Link>
          <Link to="/how-it-works" className="hover:text-foreground">How it works</Link>
          <Link to="/faq" className="hover:text-foreground">FAQ</Link>
          <Link to="/about" className="hover:text-foreground">About</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/policies" className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-xs sm:text-sm font-semibold text-primary-foreground hover:opacity-90">Buy Insurance</Link>
          <a href="/auth/login" className="hidden sm:inline-flex items-center rounded-md border border-border px-3 py-2 text-xs sm:text-sm font-medium text-foreground hover:bg-muted">Login</a>
          <a href="/auth/signup" className="hidden sm:inline-flex items-center rounded-md bg-foreground/90 px-3 py-2 text-xs sm:text-sm font-medium text-background hover:bg-foreground">Sign up</a>
          <a href="tel:+919439151934" className="hidden md:inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-muted">
            <Phone className="h-4 w-4" /> Call
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#F8FAFC]">
      <style>{`
        @keyframes cfs-mesh { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(3%, -2%, 0) scale(1.06); } }
        @keyframes cfs-mesh-2 { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(-4%, 3%, 0) scale(1.08); } }
        @keyframes cfs-streak { 0% { transform: translateX(-30%) skewX(-18deg); opacity: 0; } 30% { opacity: 0.55; } 100% { transform: translateX(130%) skewX(-18deg); opacity: 0; } }
        @keyframes cfs-float-a { 0%,100% { transform: translateY(0) rotate(-6deg); } 50% { transform: translateY(-14px) rotate(-4deg); } }
        @keyframes cfs-float-b { 0%,100% { transform: translateY(0) rotate(4deg); } 50% { transform: translateY(-10px) rotate(6deg); } }
        @keyframes cfs-float-c { 0%,100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-18px) rotate(0deg); } }
        @keyframes cfs-pulse-ring { 0% { transform: scale(0.8); opacity: 0.55; } 100% { transform: scale(1.9); opacity: 0; } }
        @keyframes cfs-dash { to { stroke-dashoffset: -60; } }
        @keyframes cfs-check { 0% { stroke-dashoffset: 40; opacity: 0; } 40% { opacity: 1; } 100% { stroke-dashoffset: 0; opacity: 1; } }
        @keyframes cfs-particle { 0% { transform: translateY(0) translateX(0); opacity: 0; } 15% { opacity: 0.75; } 100% { transform: translateY(-260px) translateX(var(--dx, 20px)); opacity: 0; } }
        @keyframes cfs-rise { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes cfs-glow { 0%,100% { box-shadow: 0 0 0 rgba(59,130,246,0); } 50% { box-shadow: 0 0 40px rgba(59,130,246,0.55); } }
        @keyframes cfs-border-spin { to { transform: rotate(360deg); } }
        .cfs-rise { animation: cfs-rise 0.9s cubic-bezier(.2,.7,.2,1) both; }
        .cfs-mesh-1 { animation: cfs-mesh 14s ease-in-out infinite; }
        .cfs-mesh-2 { animation: cfs-mesh-2 18s ease-in-out infinite; }
        .cfs-streak { animation: cfs-streak 7s ease-in-out infinite; }
        .cfs-file-a { animation: cfs-float-a 6s ease-in-out infinite; }
        .cfs-file-b { animation: cfs-float-b 7.5s ease-in-out infinite; }
        .cfs-file-c { animation: cfs-float-c 8s ease-in-out infinite; }
        .cfs-ring { animation: cfs-pulse-ring 2.6s ease-out infinite; }
        .cfs-dash { stroke-dasharray: 6 8; animation: cfs-dash 3.5s linear infinite; }
        .cfs-check path { stroke-dasharray: 40; stroke-dashoffset: 40; animation: cfs-check 1.4s ease-out 0.4s forwards; }
        .cfs-particle { position: absolute; width: 6px; height: 6px; border-radius: 9999px; background: radial-gradient(circle,#93c5fd,transparent 70%); filter: blur(1px); animation: cfs-particle 9s linear infinite; }
        .cfs-btn-primary { position: relative; overflow: hidden; }
        .cfs-btn-primary::after { content:""; position:absolute; inset:0; background: linear-gradient(120deg, transparent 20%, rgba(255,255,255,0.35) 50%, transparent 80%); transform: translateX(-100%); transition: transform .8s ease; }
        .cfs-btn-primary:hover::after { transform: translateX(100%); }
        .cfs-btn-primary:hover { animation: cfs-glow 1.6s ease-in-out infinite; transform: translateY(-2px); }
        .cfs-btn-secondary { position: relative; }
        .cfs-btn-secondary::before { content:""; position:absolute; inset:-2px; border-radius: 14px; padding: 2px; background: conic-gradient(from 0deg, #3B82F6, #0B3D91, #16A34A, #3B82F6); -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; animation: cfs-border-spin 6s linear infinite; opacity: 0; transition: opacity .3s ease; }
        .cfs-btn-secondary:hover::before { opacity: 1; }
        .cfs-card-hover { transition: transform .5s cubic-bezier(.2,.7,.2,1), box-shadow .5s ease; }
        .cfs-card-hover:hover { transform: translateY(-6px) rotate(0deg) scale(1.02); box-shadow: 0 24px 60px -20px rgba(11,61,145,0.35); }
      `}</style>

      {/* Animated gradient mesh background */}
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-[#EAF6FF] to-white" />
        <div className="cfs-mesh-1 absolute -left-32 -top-32 h-[560px] w-[560px] rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(74,144,226,0.35), transparent 65%)" }} />
        <div className="cfs-mesh-2 absolute -right-40 top-20 h-[620px] w-[620px] rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(11,61,145,0.28), transparent 65%)" }} />
        <div className="cfs-mesh-1 absolute bottom-[-160px] left-1/3 h-[500px] w-[500px] rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(22,163,74,0.18), transparent 65%)", animationDelay: "-6s" }} />
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "linear-gradient(rgba(11,61,145,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(11,61,145,0.5) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="cfs-streak absolute top-1/4 left-0 h-24 w-1/2" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.65), transparent)", filter: "blur(20px)" }} />
        {/* particles */}
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className="cfs-particle"
            style={{
              left: `${(i * 73) % 100}%`,
              bottom: `${(i * 31) % 40}%`,
              animationDelay: `${(i * 0.7) % 9}s`,
              // @ts-expect-error CSS var
              "--dx": `${(i % 2 === 0 ? 1 : -1) * ((i * 11) % 40)}px`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-[1.1fr_1fr] md:py-32">
        {/* Copy */}
        <div className="cfs-rise">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#3B82F6]/25 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#0B3D91] shadow-sm backdrop-blur">
            <ShieldCheck className="h-3.5 w-3.5" /> Trusted claim assistance
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-[#0B3D91] md:text-6xl">
            Your Insurance Claim,{" "}
            <span className="relative inline-block bg-gradient-to-r from-[#0B3D91] via-[#3B82F6] to-[#16A34A] bg-clip-text text-transparent">
              Handled with Certainty.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
            We simplify insurance claim assistance by helping you organize documents, understand the
            process, and prepare strong claim submissions. Fast, transparent, and user-focused
            support — every step of the way.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 cfs-rise" style={{ animationDelay: "0.15s" }}>
            <Link
              to="/auth/signup"
              className="cfs-btn-primary inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0B3D91] to-[#3B82F6] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#0B3D91]/25 transition"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/dashboard/claims"
              className="cfs-btn-secondary inline-flex items-center gap-2 rounded-xl border border-[#0B3D91]/15 bg-white/60 px-7 py-3.5 text-sm font-semibold text-[#0B3D91] backdrop-blur-xl transition hover:bg-white"
            >
              <FileCheck className="h-4 w-4" /> Track Your Claim
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500 cfs-rise" style={{ animationDelay: "0.3s" }}>
            <span className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-[#16A34A]" /> 256-bit encrypted intake</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A]" /> Transparent process</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-[#16A34A]" /> Data-privacy first</span>
          </div>
        </div>

        {/* Cinematic scene */}
        <HeroForm />
      </div>
    </section>
  );
}

function HeroForm() {
  return (
    <div className="relative mx-auto w-full max-w-[480px] cfs-rise" style={{ animationDelay: "0.2s" }}>
      <div className="relative overflow-hidden rounded-3xl bg-white p-6 md:p-8 shadow-2xl shadow-[#0B3D91]/25 ring-1 ring-[#0B3D91]/10">
        <h2 className="text-xl md:text-2xl font-bold text-[#0B3D91] mb-2">Request Free Callback</h2>
        <p className="text-sm text-slate-500 mb-6">Our experts will call you shortly to assess your case for free.</p>
        <LeadForm />
      </div>
    </div>
  );
}

function FloatingDoc({
  className = "",
  title,
  tone,
  checked,
  stampApproved,
  style,
}: {
  className?: string;
  title: string;
  tone: "blue" | "amber" | "green";
  checked?: boolean;
  stampApproved?: boolean;
  style?: React.CSSProperties;
}) {
  const toneMap = {
    blue: { bar: "bg-[#3B82F6]", icon: "text-[#3B82F6]" },
    amber: { bar: "bg-amber-400", icon: "text-amber-500" },
    green: { bar: "bg-[#16A34A]", icon: "text-[#16A34A]" },
  }[tone];
  return (
    <div
      className={`relative rounded-2xl border border-white/60 bg-white/70 p-3 shadow-xl shadow-[#0B3D91]/10 backdrop-blur-xl ${className}`}
      style={style}
    >
      <div className="flex items-center gap-2">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm ${toneMap.icon}`}>
          <FileText className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[11px] font-semibold text-slate-800">{title}</div>
          <div className={`mt-1 h-1 w-full rounded ${toneMap.bar}/30`}>
            <div className={`h-1 w-2/3 rounded ${toneMap.bar}`} />
          </div>
        </div>
        {checked && (
          <svg viewBox="0 0 24 24" className="cfs-check h-5 w-5 text-[#16A34A]" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12 l5 5 L20 6" />
          </svg>
        )}
      </div>
      <div className="mt-2 space-y-1">
        <div className="h-1 w-full rounded bg-slate-200/70" />
        <div className="h-1 w-4/5 rounded bg-slate-200/70" />
        <div className="h-1 w-3/5 rounded bg-slate-200/70" />
      </div>
      {stampApproved && (
        <span className="absolute -right-2 -top-2 rotate-[8deg] rounded-md border border-[#16A34A] bg-white px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#16A34A] shadow">
          Approved
        </span>
      )}
    </div>
  );
}

function TrustBadges() {
  return <TrustBadgesInner />;
}

function UdyamRibbon() {
  return (
    <section aria-label="Government registration" className="relative overflow-hidden border-y border-emerald-200 bg-gradient-to-r from-orange-50 via-white to-emerald-50">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-4 text-center sm:flex-row sm:text-left">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 via-white to-emerald-600 ring-2 ring-white shadow">
            <ShieldCheck className="h-5 w-5 text-[#0B3D91]" />
          </span>
          <div className="leading-tight">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">Government of India · MSME Registered</p>
            <p className="text-sm font-bold text-slate-800">
              Sidheswar Enterprises · Udyam Reg. No. <span className="text-[#0B3D91]">UDYAM-OD-29-0025578</span>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/10 px-3 py-1 text-emerald-700 ring-1 ring-emerald-600/20">
            <CheckCircle2 className="h-3.5 w-3.5" /> Verified Business
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 px-3 py-1 text-orange-700 ring-1 ring-orange-500/20">
            <Award className="h-3.5 w-3.5" /> MSME · Udyam
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-600/10 px-3 py-1 text-blue-700 ring-1 ring-blue-600/20">
            <Scale className="h-3.5 w-3.5" /> Compliant with Indian Law
          </span>
        </div>
      </div>
    </section>
  );
}

function TrustBadgesInner() {
  const items = [
    { icon: Lock, label: "Secure Document Handling" },
    { icon: Eye, label: "Transparent Process" },
    { icon: HeartHandshake, label: "Guided Claim Assistance" },
    { icon: ShieldCheck, label: "Data Privacy Focused" },
  ];
  return (
    <section className="relative border-y border-slate-200/70 bg-white/70 backdrop-blur">
      <div className="mx-auto grid max-w-6xl gap-4 px-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, label }, i) => (
          <div
            key={label}
            className="cfs-card-hover flex items-center gap-3 rounded-xl border border-slate-200/70 bg-white/80 px-4 py-3 shadow-sm backdrop-blur"
            style={{ animation: `cfs-rise 0.7s ${i * 0.08}s both` }}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#EAF6FF] to-white text-[#0B3D91] ring-1 ring-[#3B82F6]/20">
              <Icon className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold text-slate-700">{label}</span>
            <CheckCircle2 className="ml-auto h-4 w-4 text-[#16A34A]" />
          </div>
        ))}
      </div>
    </section>
  );
}

function TrustBar() {
  const stats = [
    { value: "IRDAI", label: "Licensed POSP" },
    { value: "RenewBuy", label: "Authorised partner" },
    { value: "PAN India", label: "Service coverage" },
    { value: "24×7", label: "WhatsApp support" },
  ];
  return (
    <section className="border-y border-border bg-secondary">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-10 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="font-display text-2xl font-bold text-primary md:text-3xl">{s.value}</div>
            <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Services() {
  const items = [
    { icon: Shield, title: "Health Insurance Claims", body: "Cashless or reimbursement — we navigate TPAs, documentation, and rejections." },
    { icon: Scale, title: "Motor & Accident Claims", body: "Own-damage, third-party, and total-loss claims handled end-to-end." },
    { icon: FileCheck, title: "Life & Mediclaim Settlements", body: "Death, disability, and critical illness claims pursued with diligence." },
    { icon: Award, title: "Property & Fire Claims", body: "Surveyor coordination and loss assessment for home and business policies." },
    { icon: Clock, title: "Delayed & Rejected Claims", body: "Specialist team revives stuck claims and escalates through proper channels." },
    { icon: Phone, title: "Ombudsman Representation", body: "Formal grievance filing and representation before insurance ombudsman." },
  ];
  return (
    <section id="services" className="mx-auto max-w-6xl px-6 py-24">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-glow">What we do</p>
        <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">Every claim, every category — handled.</h2>
        <p className="mt-4 text-muted-foreground">From the first form to the final settlement, our advisors act as your single point of accountability.</p>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map(({ icon: Icon, title, body }) => (
          <div key={title} className="group rounded-xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-primary/40" style={{ boxShadow: "var(--shadow-soft)" }}>
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-display text-lg font-bold text-foreground">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    { n: "01", title: "Share your case", body: "Tell us about the claim in a 15-minute call. Free, no commitment." },
    { n: "02", title: "We build the file", body: "Documentation, medical records, surveyor reports — we assemble everything." },
    { n: "03", title: "Filing & follow-up", body: "We file with the insurer and pursue your claim daily until resolution." },
    { n: "04", title: "Settlement in hand", body: "You receive the settlement directly into your account. We're paid only on success." },
  ];
  return (
    <section id="process" className="border-y border-border" style={{ background: "var(--gradient-trust)" }}>
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-glow">How it works</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">Four steps. Total clarity.</h2>
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="relative rounded-xl border border-border bg-card p-6">
              <div className="font-display text-3xl font-bold text-accent">{s.n}</div>
              <h3 className="mt-3 font-display text-lg font-bold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyTrust() {
  const points = [
    { icon: Lock, title: "Bank-grade security", body: "Your documents are encrypted in transit and at rest. We never sell or share your data." },
    { icon: Scale, title: "Regulated process", body: "Our workflow aligns with IRDAI guidelines and insurance ombudsman procedures." },
    { icon: Award, title: "No win, no fee", body: "You pay only when we recover your claim. Transparent, percentage-based pricing." },
    { icon: CheckCircle2, title: "Real human advisors", body: "Every case is assigned to a named claims advisor — not a chatbot, not a queue." },
  ];
  return (
    <section id="trust" className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] md:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-glow">Why ClaimForSure</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">Built on trust, proven by outcomes.</h2>
          <p className="mt-4 text-muted-foreground">Insurers process thousands of claims a day. You deserve an advocate who knows the playbook — and uses it for you.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {points.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-xl border border-border bg-card p-5">
              <Icon className="h-5 w-5 text-primary" />
              <h3 className="mt-3 font-display text-base font-bold text-foreground">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const scenarios = [
    {
      title: "Health / Mediclaim",
      body: "We help policyholders understand rejection reasons, organise medical records, and prepare a well-documented representation to the insurer or ombudsman.",
    },
    {
      title: "Motor claims",
      body: "We guide you through surveyor coordination, repair estimates, and the paperwork required for own-damage or third-party claim submissions.",
    },
    {
      title: "Life & term claims",
      body: "We assist nominees with document checklists, forms, and communication with the insurer so the process feels less overwhelming.",
    },
  ];
  return (
    <section className="border-y border-border bg-secondary">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-glow">How we help</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">The kind of guidance we provide.</h2>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">
            Sample scenarios that describe our assistance and guidance. Claim decisions are made solely by the respective insurance company or competent authority — outcomes are never guaranteed.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {scenarios.map((s) => (
            <article key={s.title} className="flex flex-col rounded-xl border border-border bg-card p-6">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </article>
          ))}
        </div>
        <p className="mt-8 text-xs text-muted-foreground">
          Note: We do not display individual customer reviews on this site. We provide assistance and guidance — we do not guarantee claim approval or settlement.
        </p>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs: { q: string; a: string; link?: { to: string; label: string } }[] = [
    { q: "How much does ClaimForSure charge?", a: "Our fee structure is disclosed upfront in the Service Agreement: a non-refundable processing fee of ₹1,770 (incl. GST) once your claim is taken up for active processing, and a success fee of 20% + GST on any amount sanctioned or paid by the insurer." },
    { q: "Will you take cases that were already rejected?", a: "Yes. Rejected and delayed claims are our specialty. We review the rejection reason and build a fresh case where merit exists.", link: { to: "/insurance-claim-rejected", label: "Read our full guide on rejected insurance claims →" } },
    { q: "How long does a claim take to settle?", a: "Most health claims resolve in 4–8 weeks. Complex motor, property, and life claims may take longer, but we share weekly updates throughout." },
    { q: "Is my data safe with you?", a: "All documents are stored encrypted, accessible only to your assigned advisor. We never share data with third parties without your written consent." },
  ];
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-24">
      <p className="text-xs font-semibold uppercase tracking-wider text-primary-glow">Questions</p>
      <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">Answers, straight up.</h2>
      <div className="mt-10 divide-y divide-border border-y border-border">
        {faqs.map((f) => (
          <details key={f.q} className="group py-5">
            <summary className="flex cursor-pointer items-center justify-between font-display text-base font-semibold text-foreground">
              {f.q}
              <span className="ml-4 text-primary transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            {f.link ? (
              <Link to={f.link.to} className="mt-2 inline-block text-sm font-medium text-primary hover:underline">{f.link.label}</Link>
            ) : null}
          </details>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="contact" className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      <div className="mx-auto max-w-5xl px-6 py-20 text-center text-primary-foreground">
        <Shield className="mx-auto h-10 w-10 text-[oklch(0.82_0.14_80)]" />
        <h2 className="mt-5 font-display text-3xl font-bold leading-tight md:text-5xl">
          Stop chasing your insurer. <br className="hidden md:block" />Let us do it.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-white/80">Free 15-minute claim review. No paperwork to start, no obligation to continue.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href="tel:+919439151934" className="inline-flex items-center gap-2 rounded-md bg-[oklch(0.82_0.14_80)] px-6 py-3 text-sm font-semibold text-[oklch(0.2_0.05_265)] shadow-lg">
            <Phone className="h-4 w-4" /> Call +91 94391 51934
          </a>
          <a href="mailto:support@claimforsure.in" className="inline-flex items-center gap-2 rounded-md border border-white/30 px-6 py-3 text-sm font-medium text-white hover:bg-white/10">
            support@claimforsure.in
          </a>
        </div>
        <div className="mx-auto mt-10 grid max-w-3xl gap-4 text-left text-sm text-white/85 md:grid-cols-3">
          <div className="rounded-xl border border-white/15 bg-white/5 p-4">
            <p className="font-semibold text-white">Phone</p>
            <a href="tel:+919439151934" className="mt-1 block hover:text-white">+91 94391 51934</a>
            <a href="tel:+918144503650" className="block hover:text-white">+91 81445 03650</a>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/5 p-4">
            <p className="font-semibold text-white">Email</p>
            <a href="mailto:support@claimforsure.in" className="mt-1 block hover:text-white">support@claimforsure.in</a>
            <p className="mt-1 text-white/70">We reply within 24 hours</p>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/5 p-4">
            <p className="font-semibold text-white">Office</p>
            <p className="mt-1"><span className="font-semibold text-white">Head Office:</span><br />AT - 21/C, Near Government Primary School,<br />Sankarakhole, Dist. Kandhamal,<br />Odisha - 762019</p>
            <p className="mt-3"><span className="font-semibold text-white">Branch Office:</span><br />B1/G8, Ground Floor, Rose IT Solutions,<br />Mohan Cooperative Industrial Estate, New Delhi 110044</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-start">
            <BrandLockup size="sm" layout="stacked" />
          </div>
          <p className="mt-3 text-sm italic text-muted-foreground">"We don't promise, we deliver."</p>
          <p className="mt-3 text-xs text-muted-foreground"><span className="font-semibold text-foreground">Head Office:</span><br />AT - 21/C, Near Government Primary School, Sankarakhole, Dist. Kandhamal, Odisha - 762019</p>
          <p className="mt-2 text-xs text-muted-foreground"><span className="font-semibold text-foreground">Branch Office:</span><br />B1/G8, Ground Floor, Rose IT Solutions, Mohan Cooperative Industrial Estate, New Delhi 110044</p>
          <p className="mt-2 text-xs text-muted-foreground">
            <a href="tel:+919439151934" className="hover:text-primary">+91 94391 51934</a> · <a href="tel:+918144503650" className="hover:text-primary">+91 81445 03650</a>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            <a href="mailto:support@claimforsure.in" className="hover:text-primary">support@claimforsure.in</a>
          </p>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Udyam Reg. No.: <strong>UDYAM-OD-29-0025578</strong>
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Sole Proprietorship · Founded 2026 · IRDAI-licensed POSP (RenewBuy authorised partner)
          </p>
        </div>
        <FooterCol title="Services" links={[
          { label: "Claim Help", href: "/claim-help" },
          { label: "Rejected Claim Assistance", href: "/insurance-claim-rejected" },
          { label: "Buy Insurance Policies", href: "/policies" },
          { label: "Free Claim Assessment", href: "/free-claim-assessment" },
        ]} />
        <FooterCol title="Company" links={[
          { label: "About ClaimForSure", href: "/about" },
          { label: "How It Works", href: "/how-it-works" },
          { label: "FAQ", href: "/faq" },
          { label: "Customer Appreciation", href: "/appreciation" },
        ]} />
        <FooterCol title="Legal" links={[
          { label: "Privacy Policy", href: "/privacy" },
          { label: "Terms & Conditions", href: "/terms" },
          { label: "Refund Policy", href: "/refund" },
          { label: "Disclaimer", href: "/disclaimer" },
          { label: "Service Agreement", href: "/service-agreement" },
        ]} />
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} ClaimForSure. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <a href="/privacy" className="hover:text-foreground">Privacy</a>
            <a href="/terms" className="hover:text-foreground">Terms</a>
            <a href="/refund" className="hover:text-foreground">Refund</a>
            <a href="/disclaimer" className="hover:text-foreground">Disclaimer</a>
            <a href="/service-agreement" className="hover:text-foreground">Service Agreement</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {links.map((l) => <li key={l.label}><a href={l.href} className="hover:text-foreground">{l.label}</a></li>)}
      </ul>
    </div>
  );
}

function AppreciationSection() {
  const [enabled, setEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.rpc("get_appreciation_enabled" as any);
      setEnabled(Boolean(data));
    })();
  }, []);

  if (enabled === false || enabled === null) return null;

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, oklch(0.22 0.05 265) 0%, oklch(0.34 0.07 265) 55%, oklch(0.96 0.025 80) 100%)" }}
    >
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle at 15% 25%, white 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-2 md:items-center md:py-28">
        {/* Copy */}
        <div className="text-white animate-fade-in">
          <span className="inline-flex items-center gap-2 rounded-full border border-[oklch(0.82_0.14_80)]/40 bg-[oklch(0.82_0.14_80)]/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[oklch(0.92_0.1_80)]">
            <Sparkles className="h-3.5 w-3.5" /> Surprise Gift
          </span>
          <h2 className="mt-5 font-display text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
            Customer Appreciation Program
          </h2>
          <p className="mt-5 max-w-xl text-white/85 md:text-lg">
            At <strong>ClaimForSure</strong>, we value every customer. From time to time, eligible customers may receive
            exclusive appreciation gifts or surprise rewards as a token of gratitude. Eligibility, selection criteria, and
            availability are determined solely by ClaimForSure and are subject to our Terms &amp; Conditions.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/appreciation" className="inline-flex items-center gap-2 rounded-md bg-[oklch(0.82_0.14_80)] px-5 py-2.5 text-sm font-semibold text-[oklch(0.2_0.05_265)] shadow-lg transition hover:scale-[1.02]">
              <Gift className="h-4 w-4" /> Learn More
            </Link>
            <Link to="/dashboard/rewards" className="inline-flex items-center gap-2 rounded-md border border-white/25 bg-white/5 px-5 py-2.5 text-sm font-medium text-white backdrop-blur hover:bg-white/10">
              View My Status <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-8 max-w-xl text-[11px] leading-relaxed text-white/65">
            <strong className="text-white/85">Disclaimer:</strong> Any appreciation gift is entirely discretionary, subject to
            eligibility, availability, applicable laws, and our Terms &amp; Conditions. It is not guaranteed with the purchase
            of any insurance product.
          </p>
        </div>

        {/* Glass gift card */}
        <div className="relative animate-fade-in" style={{ animationDelay: "0.15s" }}>
          <div
            className="group relative mx-auto max-w-sm rounded-3xl border border-white/25 bg-white/10 p-8 text-center text-white backdrop-blur-xl transition hover:-translate-y-1"
            style={{ boxShadow: "0 30px 80px -20px oklch(0.15 0.05 265 / 0.6), inset 0 1px 0 rgba(255,255,255,0.2)" }}
          >
            <GiftBoxArt />
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[oklch(0.92_0.1_80)]">By Invitation</p>
            <p className="mt-3 font-display text-xl font-semibold leading-snug">
              A small thank-you, hand-picked by us
            </p>
            <p className="mt-2 text-sm text-white/75">
              No application. No queue. Just gratitude — if and when it's your turn.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function GiftBoxArt() {
  return (
    <div className="relative mx-auto h-32 w-32">
      <style>{`
        @keyframes cfs-lid { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-6px) rotate(-3deg); } }
        @keyframes cfs-shimmer { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }
        @keyframes cfs-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .cfs-gift { animation: cfs-float 4s ease-in-out infinite; }
        .cfs-gift .lid { transform-origin: center bottom; animation: cfs-lid 5s ease-in-out infinite; }
        .cfs-gift .ribbon { animation: cfs-shimmer 2.6s ease-in-out infinite; }
      `}</style>
      <svg viewBox="0 0 128 128" className="cfs-gift h-full w-full drop-shadow-2xl" fill="none">
        {/* box body */}
        <rect x="20" y="56" width="88" height="58" rx="6" fill="oklch(0.82 0.14 80)" />
        <rect x="58" y="56" width="12" height="58" fill="oklch(0.7 0.16 60)" />
        {/* lid */}
        <g className="lid">
          <rect x="14" y="44" width="100" height="20" rx="4" fill="oklch(0.88 0.14 82)" />
          <rect x="58" y="44" width="12" height="20" fill="oklch(0.7 0.16 60)" />
        </g>
        {/* bow */}
        <g className="ribbon" transform="translate(64 44)">
          <ellipse cx="-10" cy="0" rx="10" ry="7" fill="oklch(0.7 0.16 60)" />
          <ellipse cx="10" cy="0" rx="10" ry="7" fill="oklch(0.7 0.16 60)" />
          <circle cx="0" cy="0" r="4.5" fill="oklch(0.6 0.18 55)" />
        </g>
        {/* sparkles */}
        <g className="ribbon" fill="white">
          <circle cx="22" cy="34" r="1.6" />
          <circle cx="104" cy="30" r="2" />
          <circle cx="110" cy="70" r="1.4" />
          <circle cx="18" cy="84" r="1.4" />
        </g>
      </svg>
    </div>
  );
}
