import { createFileRoute, Link } from "@tanstack/react-router";
import { BrandLockup } from "@/components/BrandLockup";
import { Shield, HandHeart, FileText, TrendingUp, Sparkles, Quote, ArrowRight, MapPin, Users } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About ClaimForSure — Sidheswar Enterprises Initiative" },
      { name: "description", content: "ClaimForSure is a Sidheswar Enterprises initiative helping Indian policyholders recover rejected and delayed insurance claims with transparent fees and expert support." },
      { name: "keywords", content: "about ClaimForSure, Sidheswar Enterprises, insurance claim company India, claim settlement experts" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { property: "og:title", content: "About ClaimForSure — Sidheswar Enterprises Initiative" },
      { property: "og:description", content: "Who we are, what we stand for, and how we help Indian policyholders win insurance claims." },
      { property: "og:url", content: "https://www.claimforsure.in/about" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://www.claimforsure.in/favicon.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://www.claimforsure.in/favicon.png" },
    ],
    links: [{ rel: "canonical", href: "https://www.claimforsure.in/about" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          url: "https://www.claimforsure.in/about",
          mainEntity: { "@id": "https://www.claimforsure.in/#organization" },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.claimforsure.in/" },
            { "@type": "ListItem", position: 2, name: "About Us", item: "https://www.claimforsure.in/about" },
          ],
        }),
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader />
      <AboutHero />
      <FoundersSection />
      <MissionVision />
      <QuoteBlock />
      <ReachUs />
    </div>
  );
}

/* ---------------- Hero ---------------- */
function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-[#F6F9FF]">
      <style>{`
        @keyframes ab-mesh { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(3%,-2%,0) scale(1.08); } }
        @keyframes ab-mesh-2 { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(-4%,3%,0) scale(1.1); } }
        @keyframes ab-rise { from { opacity:0; transform: translateY(24px); } to { opacity:1; transform: translateY(0); } }
        @keyframes ab-particle { 0% { transform: translateY(0) translateX(0); opacity: 0; } 15% { opacity:.7; } 100% { transform: translateY(-280px) translateX(var(--dx,20px)); opacity: 0; } }
        @keyframes ab-line { 0% { stroke-dashoffset: 400; opacity: 0; } 20% { opacity: 1; } 100% { stroke-dashoffset: 0; opacity: 1; } }
        @keyframes ab-glow-pulse { 0%,100% { opacity: .35; transform: scale(1); } 50% { opacity: .7; transform: scale(1.06); } }
        @keyframes ab-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes ab-spin-slow { to { transform: rotate(360deg); } }
        .ab-mesh-1 { animation: ab-mesh 16s ease-in-out infinite; }
        .ab-mesh-2 { animation: ab-mesh-2 20s ease-in-out infinite; }
        .ab-rise { animation: ab-rise .9s cubic-bezier(.2,.7,.2,1) both; }
        .ab-particle { position:absolute; width:6px; height:6px; border-radius:9999px; background: radial-gradient(circle,#93c5fd,transparent 70%); filter: blur(1px); animation: ab-particle 10s linear infinite; }
        .ab-line path { stroke-dasharray: 400; stroke-dashoffset: 400; animation: ab-line 2.4s ease-out .3s forwards; }
        .ab-glow { animation: ab-glow-pulse 3.5s ease-in-out infinite; }
        .ab-float { animation: ab-float 4s ease-in-out infinite; }
        .ab-card { transition: transform .5s cubic-bezier(.2,.7,.2,1), box-shadow .5s ease; }
        .ab-card:hover { transform: translateY(-6px); box-shadow: 0 30px 60px -25px rgba(11,61,145,.35); }
        .ab-avatar-ring { position:absolute; inset:-6px; border-radius: 9999px; padding:2px; background: conic-gradient(from 0deg,#3B82F6,#22D3EE,#16A34A,#3B82F6); -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; animation: ab-spin-slow 10s linear infinite; }
      `}</style>

      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#EAF3FF] to-[#F6F9FF]" />
        <div className="ab-mesh-1 absolute -left-32 -top-24 h-[520px] w-[520px] rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(59,130,246,.3), transparent 65%)" }} />
        <div className="ab-mesh-2 absolute -right-40 top-40 h-[560px] w-[560px] rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(16,185,129,.22), transparent 65%)" }} />
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "linear-gradient(rgba(11,61,145,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(11,61,145,.5) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="ab-particle"
            style={{
              left: `${(i * 79) % 100}%`,
              bottom: `${(i * 23) % 40}%`,
              animationDelay: `${(i * 0.8) % 10}s`,
              // @ts-expect-error CSS var
              "--dx": `${(i % 2 === 0 ? 1 : -1) * ((i * 11) % 40)}px`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
        <div className="ab-rise">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#3B82F6]/25 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0B3D91] shadow-sm backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Where Trust Meets Guidance
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-[#0B3D91] md:text-6xl">
            Claim For Sure{" "}
            <span className="bg-gradient-to-r from-[#0B3D91] via-[#3B82F6] to-[#16A34A] bg-clip-text text-transparent">
              by Sidheswar Enterprises
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
            Every meaningful journey begins with a challenge — and with people determined to solve it.
            We help customers compare suitable insurance policies, understand policy features,
            organize documentation, and receive guidance throughout their insurance journey.
          </p>
        </div>

        {/* Animated icons row */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 ab-rise" style={{ animationDelay: ".15s" }}>
          {[
            { Icon: Shield, label: "Trust", tone: "from-[#0B3D91] to-[#3B82F6]" },
            { Icon: HandHeart, label: "Guidance", tone: "from-[#3B82F6] to-[#22D3EE]" },
            { Icon: FileText, label: "Clarity", tone: "from-[#6366F1] to-[#8B5CF6]" },
            { Icon: TrendingUp, label: "Growth", tone: "from-[#10B981] to-[#16A34A]" },
          ].map(({ Icon, label, tone }, i) => (
            <div key={label} className="ab-float flex flex-col items-center gap-2" style={{ animationDelay: `${i * .4}s` }}>
              <div className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${tone} text-white shadow-lg shadow-[#0B3D91]/25`}>
                <Icon className="h-6 w-6" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#0B3D91]/80">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Founders ---------------- */
function FoundersSection() {
  return (
    <section className="relative overflow-hidden bg-white py-24 md:py-28">
      <div className="pointer-events-none absolute inset-0 -z-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(11,61,145,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(11,61,145,.5) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />

      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center ab-rise">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#0B3D91]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0B3D91]">
            <Users className="h-3.5 w-3.5" /> The Founders
          </span>
          <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-[#0B3D91] md:text-4xl">
            Built on one belief. Rooted in trust.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            <strong className="text-[#0B3D91]">Biswajit</strong>, who grew up in a small village in Odisha,
            witnessed how difficult and confusing insurance policies and the claims process could be for
            ordinary families. He set out to build a platform that would simplify the insurance experience
            through honest guidance and transparent support.
          </p>
        </div>

        <div className="relative mt-16">
          <div className="relative mx-auto max-w-xl">
            <FounderCard name="Biswajit" role="Founder" initials="B" tone="from-[#0B3D91] to-[#3B82F6]" bio="Grew up in a small village in Odisha. Set out to build a platform that simplifies the insurance experience through honest guidance and transparent support — with integrity, professionalism, and care." />
          </div>
        </div>
      </div>
    </section>
  );
}

function FounderCard({ name, role, initials, tone, bio, delay = "0s" }: { name: string; role: string; initials: string; tone: string; bio: string; delay?: string }) {
  return (
    <article className="ab-card ab-rise relative overflow-hidden rounded-3xl border border-white/70 bg-white/70 p-8 shadow-xl shadow-[#0B3D91]/10 backdrop-blur-xl" style={{ animationDelay: delay }}>
      <span aria-hidden="true" className="ab-glow pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(59,130,246,.35), transparent 65%)" }} />
      <div className="relative flex items-center gap-5">
        <div className="relative">
          <span className="ab-avatar-ring" />
          <div className={`grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br ${tone} font-display text-3xl font-extrabold text-white shadow-xl shadow-[#0B3D91]/25`}>
            {initials}
          </div>
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-2xl font-extrabold tracking-tight text-[#0B3D91]">{name}</h3>
          <p className="mt-1 inline-flex items-center gap-2 rounded-full bg-[#0B3D91]/5 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-widest text-[#0B3D91]">
            <MapPin className="h-3 w-3" /> {role}
          </p>
        </div>
      </div>
      <p className="relative mt-6 text-sm leading-relaxed text-slate-600 md:text-[15px]">{bio}</p>
    </article>
  );
}

/* ---------------- Mission / Vision ---------------- */
function MissionVision() {
  return (
    <section className="relative overflow-hidden bg-[#F6F9FF] py-24">
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#EAF3FF] to-[#F6F9FF]" />
      </div>
      <div className="relative mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-2">
        <MvCard
          eyebrow="Our Mission"
          title="Simple, transparent, accessible insurance."
          body="To make insurance simple, transparent, and accessible by providing reliable guidance and long-term customer support."
          Icon={HandHeart}
          tone="from-[#3B82F6] to-[#22D3EE]"
        />
        <MvCard
          eyebrow="Our Vision"
          title="India's most trusted guidance platform."
          body="To become India's most trusted insurance guidance platform, empowering every policyholder with knowledge, confidence, and clarity."
          Icon={TrendingUp}
          tone="from-[#10B981] to-[#16A34A]"
          delay=".1s"
        />
      </div>
    </section>
  );
}

function MvCard({ eyebrow, title, body, Icon, tone, delay = "0s" }: { eyebrow: string; title: string; body: string; Icon: React.ComponentType<{ className?: string }>; tone: string; delay?: string }) {
  return (
    <article className="ab-card ab-rise relative overflow-hidden rounded-3xl border border-white/70 bg-white/70 p-8 shadow-xl shadow-[#0B3D91]/10 backdrop-blur-xl" style={{ animationDelay: delay }}>
      <div className={`inline-grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${tone} text-white shadow-lg shadow-[#0B3D91]/20`}>
        <Icon className="h-6 w-6" />
      </div>
      <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0B3D91]/70">{eyebrow}</p>
      <h3 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-[#0B3D91] md:text-[26px]">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-[15px]">{body}</p>
    </article>
  );
}

/* ---------------- Quote ---------------- */
function QuoteBlock() {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="mx-auto max-w-4xl px-6">
        <figure className="ab-rise relative overflow-hidden rounded-[28px] border border-white/60 bg-gradient-to-br from-[#0B3D91] via-[#1E40AF] to-[#0EA5E9] p-10 text-center shadow-2xl shadow-[#0B3D91]/30 md:p-14">
          <span aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(600px circle at 50% 0%, rgba(255,255,255,.18), transparent 60%)" }} />
          <Quote className="mx-auto h-10 w-10 text-white/80" />
          <blockquote className="relative mt-6 font-display text-xl font-semibold leading-snug text-white md:text-3xl">
            "Insurance isn't just about buying a policy — it's about having trusted guidance when you need it the most."
          </blockquote>
          <figcaption className="relative mt-8 text-sm text-white/85">
            <span className="block font-bold text-white">— Biswajit</span>
            <span className="block text-white/70">Founder, Claim For Sure by Sidheswar Enterprises</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ---------------- Reach us ---------------- */
function ReachUs() {
  return (
    <section className="relative overflow-hidden bg-[#F6F9FF] py-20">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="font-display text-2xl font-extrabold text-[#0B3D91] md:text-3xl">Talk to our team</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600">
          WhatsApp / Call:{" "}
          <a href="tel:+919439151934" className="font-semibold text-[#0B3D91] hover:underline">+91 94391 51934</a>{" "}
          or{" "}
          <a href="tel:+918144503650" className="font-semibold text-[#0B3D91] hover:underline">+91 81445 03650</a>.
          We operate only through phone, WhatsApp, and email — please verify any other channel claiming our name.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/policies" className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#0B3D91] via-[#3B82F6] to-[#16A34A] px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-[#0B3D91]/25 transition hover:-translate-y-0.5">
            Explore Insurance <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/claim-help" className="inline-flex items-center gap-2 rounded-2xl border border-[#0B3D91]/15 bg-white/70 px-7 py-3.5 text-sm font-semibold text-[#0B3D91] backdrop-blur transition hover:bg-white">
            Get Claim Help
          </Link>
        </div>
      </div>
    </section>
  );
}

function PageHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center" aria-label="Claim For Sure — by Sidheshwar Enterprises">
          <BrandLockup size="sm" layout="inline" />
        </Link>
        <nav className="hidden gap-6 text-sm text-muted-foreground md:flex">
          <Link to="/claim-help" className="hover:text-foreground">Claim Help</Link>
          <Link to="/how-it-works" className="hover:text-foreground">How It Works</Link>
          <Link to="/faq" className="hover:text-foreground">FAQ</Link>
        </nav>
      </div>
    </header>
  );
}