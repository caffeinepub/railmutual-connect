import { Button } from "@/components/ui/button";
import { useRouter } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ListChecks,
  Lock,
  Map as MapIcon,
  MapPin,
  Menu,
  Shield,
  Train,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LandingPage() {
  const router = useRouter();
  const { identity } = useInternetIdentity();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleGetStarted = () => {
    if (identity) {
      router.navigate({ to: "/dashboard" });
    } else {
      router.navigate({ to: "/auth" });
    }
  };

  const features = [
    {
      icon: Users,
      title: "Smart Mutual Matching",
      description:
        "Our algorithm finds employees where your desired location matches their current posting and vice versa.",
    },
    {
      icon: MapPin,
      title: "All India Coverage",
      description:
        "Search across all 17 Railway Zones and hundreds of divisions across the country.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Control your contact visibility. Share details only with employees you choose to connect with.",
    },
    {
      icon: Train,
      title: "Railway-Specific",
      description:
        "Built exclusively for Indian Railways employees across all 17 zones and 68+ divisions nationwide.",
    },
  ];

  const steps = [
    {
      step: "1",
      title: "Create Your Profile",
      desc: "Enter your current posting, desired location, and designation.",
    },
    {
      step: "2",
      title: "Enter Your Postings",
      desc: "Our system automatically finds employees who match your transfer requirements.",
    },
    {
      step: "3",
      title: "Connect with Your Match",
      desc: "Reach out to your match and coordinate the mutual transfer process.",
    },
  ];

  const stats = [
    { value: "17", label: "Railway Zones", icon: Train },
    { value: "68+", label: "Divisions", icon: MapIcon },
    { value: "100%", label: "Free to Use", icon: BadgeCheck },
    { value: "3 Steps", label: "Simple Process", icon: ListChecks },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ── STICKY HEADER ── */}
      <header
        className="sticky top-0 z-50 h-16 md:h-[72px] flex items-center px-5 shadow-nav"
        style={{
          background: "linear-gradient(135deg, #0B2C4A 0%, #12395F 100%)",
        }}
      >
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left: Logo block */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-[50px] h-[50px] rounded-lg bg-white flex items-center justify-center flex-shrink-0">
              <img
                src="/assets/uploads/file_0000000092387208b8901a7316cfe37e-4-1.png"
                alt="RailMutual Connect icon"
                className="w-[38px] h-[38px] object-contain"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-extrabold text-white text-base sm:text-lg tracking-tight leading-none">
                RailMutual <span style={{ color: "#F97316" }}>Connect</span>
              </span>
              <span className="text-white/50 text-[10px] sm:text-xs font-medium tracking-wide mt-0.5 hidden sm:block">
                Mutual Transfers Made Easy
              </span>
            </div>
          </div>

          {/* Right: Desktop buttons */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {identity ? (
              <Button
                onClick={handleGetStarted}
                className="text-white font-semibold text-sm px-5 py-2 rounded-lg shadow-md border-0"
                style={{ backgroundColor: "#F97316" }}
                data-ocid="landing.header_create_profile_button"
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => router.navigate({ to: "/auth" })}
                  variant="outline"
                  className="border border-white/60 text-white bg-transparent hover:bg-white/10 text-sm px-4 py-2 rounded-lg font-medium"
                  data-ocid="landing.header_login_button"
                >
                  Login
                </Button>
                <Button
                  onClick={() => router.navigate({ to: "/auth" })}
                  className="text-white text-sm px-5 py-2 rounded-lg font-semibold shadow-md border-0"
                  style={{ backgroundColor: "#F97316" }}
                  data-ocid="landing.header_create_profile_button"
                >
                  Create Profile
                </Button>
              </>
            )}
          </div>

          {/* Right: Mobile hamburger */}
          <button
            type="button"
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-white hover:bg-white/10 transition-colors flex-shrink-0"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            data-ocid="landing.mobile_menu_toggle"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div
            className="absolute top-full left-0 right-0 z-40 py-4 px-5 flex flex-col gap-3 shadow-nav md:hidden"
            style={{ backgroundColor: "#0B2C4A" }}
          >
            {identity ? (
              <Button
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.navigate({ to: "/dashboard" });
                }}
                className="w-full text-white font-semibold text-sm rounded-lg border-0"
                style={{ backgroundColor: "#F97316" }}
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.navigate({ to: "/auth" });
                  }}
                  variant="outline"
                  className="w-full border border-white/50 text-white bg-transparent hover:bg-white/10 text-sm rounded-lg font-medium"
                  data-ocid="landing.header_login_button"
                >
                  Login
                </Button>
                <Button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.navigate({ to: "/auth" });
                  }}
                  className="w-full text-white text-sm rounded-lg font-semibold border-0"
                  style={{ backgroundColor: "#F97316" }}
                  data-ocid="landing.header_create_profile_button"
                >
                  Create Profile
                </Button>
              </>
            )}
          </div>
        )}
      </header>

      {/* ── HERO SECTION ── */}
      <section
        className="relative overflow-hidden min-h-[90vh] flex items-center"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-railway-v2.dim_1920x1080.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Layer 1: deep navy gradient for readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, #0B2C4A 0%, rgba(11,44,74,0.92) 30%, rgba(11,44,74,0.75) 60%, rgba(11,44,74,0.50) 100%)",
          }}
        />
        {/* Layer 2: subtle orange right-side glow for depth */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to left, rgba(249,115,22,0.15) 0%, transparent 50%)",
          }}
        />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-3xl">
            {/* Hero logo block */}
            <div className="flex items-center gap-5 mb-10">
              <div className="w-[90px] h-[90px] rounded-2xl bg-white flex items-center justify-center shadow-xl flex-shrink-0">
                <img
                  src="/assets/uploads/file_0000000092387208b8901a7316cfe37e-4-1.png"
                  alt="RailMutual Connect icon"
                  className="w-[74px] h-[74px] object-contain"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display font-extrabold text-white text-4xl sm:text-5xl leading-none block">
                  RailMutual
                </span>
                <span
                  className="font-display font-extrabold text-4xl sm:text-5xl leading-none block mt-1"
                  style={{ color: "#F97316" }}
                >
                  Connect
                </span>
                <span className="text-white/60 text-sm sm:text-base font-medium mt-2 tracking-wide">
                  Mutual Transfers Made Easy
                </span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-[68px] leading-tight mb-6 text-white">
              Find Your Perfect{" "}
              <span style={{ color: "#F97316" }}>Mutual Transfer</span> Partner
            </h1>

            {/* Description */}
            <div className="bg-black/20 backdrop-blur-sm rounded-xl px-4 py-3 mb-8 max-w-2xl">
              <p className="text-white/80 text-base sm:text-lg leading-relaxed">
                A dedicated platform for Indian Railways employees to discover
                mutual transfer opportunities. Connect with colleagues who want
                to swap postings — fast, simple, and secure.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button
                onClick={handleGetStarted}
                className="rounded-full px-8 py-3.5 text-white font-semibold text-base gap-2 shadow-xl border-0 flex items-center justify-center"
                style={{ backgroundColor: "#F97316" }}
                data-ocid="landing.hero_cta_button"
              >
                {identity ? "Go to Dashboard" : "Create Profile"}
                <ArrowRight className="w-5 h-5" />
              </Button>
              {!identity && (
                <Button
                  variant="outline"
                  onClick={() => router.navigate({ to: "/auth" })}
                  className="rounded-full px-8 py-3.5 font-medium text-base text-white border border-white/40 bg-white/10 hover:bg-white/20 flex items-center justify-center"
                  data-ocid="landing.hero_login_button"
                >
                  Login
                </Button>
              )}
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/25 text-white/80 text-xs rounded-full px-3 py-1">
                <Lock className="w-3 h-3" style={{ color: "#F97316" }} />
                Secure
              </span>
              <span className="bg-white/10 backdrop-blur-sm border border-white/25 text-white/80 text-xs rounded-full px-3 py-1">
                Free to Use
              </span>
              <span className="bg-white/10 backdrop-blur-sm border border-white/25 text-white/80 text-xs rounded-full px-3 py-1">
                Indian Railways Only
              </span>
            </div>
          </div>
        </div>

        {/* Orange accent line at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{
            background: "linear-gradient(to right, #F97316, #0B2C4A)",
          }}
        />
      </section>

      {/* ── STATS BAR ── */}
      <section
        className="py-8 border-b-2"
        style={{ backgroundColor: "#0B2C4A", borderColor: "#F97316" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-0">
            {stats.map(({ value, label, icon: Icon }, idx) => (
              <div
                key={label}
                className={`flex flex-col items-center justify-center py-4 px-6 text-center${
                  idx < stats.length - 1 ? " border-r border-white/15" : ""
                }`}
              >
                <Icon className="w-5 h-5 mb-2" style={{ color: "#F97316" }} />
                <div className="font-display font-bold text-3xl sm:text-4xl text-white">
                  {value}
                </div>
                <div className="text-white/60 text-xs sm:text-sm mt-1 font-medium">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURE CARDS (WHY CHOOSE) ── */}
      <section className="py-20 sm:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-foreground text-3xl sm:text-4xl mb-4">
              Why Choose RailMutual Connect?
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Built specifically for Indian Railways employees, with features
              designed to make mutual transfers straightforward.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="card-top-accent bg-card rounded-2xl p-8 shadow-card border border-border hover:shadow-card-hover hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
              >
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mb-5">
                  <Icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="font-display font-bold text-foreground text-xl mb-3">
                  {title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-20 sm:py-24 how-it-works-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-foreground text-3xl sm:text-4xl mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
              Three simple steps to find your mutual transfer partner.
            </p>
          </div>

          {/* Steps row with arrows */}
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-center gap-0">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center max-w-xs mx-auto flex-1">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-5 shadow-lg ring-4 ring-orange-100 flex-shrink-0"
                style={{ backgroundColor: "#F97316" }}
              >
                <span className="font-display font-bold text-white text-xl">
                  1
                </span>
              </div>
              <h3 className="font-display font-semibold text-foreground text-xl mb-3">
                {steps[0].title}
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {steps[0].desc}
              </p>
            </div>
            <ArrowRight
              className="hidden md:block w-10 h-10 flex-shrink-0 mx-2 -mt-12"
              style={{ color: "#F97316" }}
            />
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center max-w-xs mx-auto flex-1">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-5 shadow-lg ring-4 ring-orange-100 flex-shrink-0"
                style={{ backgroundColor: "#F97316" }}
              >
                <span className="font-display font-bold text-white text-xl">
                  2
                </span>
              </div>
              <h3 className="font-display font-semibold text-foreground text-xl mb-3">
                {steps[1].title}
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {steps[1].desc}
              </p>
            </div>
            <ArrowRight
              className="hidden md:block w-10 h-10 flex-shrink-0 mx-2 -mt-12"
              style={{ color: "#F97316" }}
            />
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center max-w-xs mx-auto flex-1">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-5 shadow-lg ring-4 ring-orange-100 flex-shrink-0"
                style={{ backgroundColor: "#F97316" }}
              >
                <span className="font-display font-bold text-white text-xl">
                  3
                </span>
              </div>
              <h3 className="font-display font-semibold text-foreground text-xl mb-3">
                {steps[2].title}
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {steps[2].desc}
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-primary-700 hover:bg-primary-800 text-white border-0 font-semibold gap-2 rounded-full px-8"
              data-ocid="landing.start_matches_button"
            >
              Start Finding Matches
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* ── IMPORTANT NOTICE ── */}
      <section className="py-14" style={{ backgroundColor: "#FEF9F0" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 sm:p-10">
            <div className="border-l-4 pl-6" style={{ borderColor: "#F97316" }}>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2
                  className="w-6 h-6 flex-shrink-0"
                  style={{ color: "#F97316" }}
                />
                <h3 className="font-display font-bold text-foreground text-xl">
                  Important Notice
                </h3>
              </div>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                RailMutual Connect is an independent platform that{" "}
                <strong>only facilitates connections</strong> between Indian
                Railways employees seeking mutual transfers. This platform does
                not process, approve, or guarantee any official transfer. All
                official transfer procedures are governed by{" "}
                <strong>Indian Railways rules and regulations</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="py-12 text-white/60"
        style={{ backgroundColor: "#0B2C4A" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            {/* Left: logo + tagline + email */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="w-[40px] h-[40px] rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                  <img
                    src="/assets/uploads/file_0000000092387208b8901a7316cfe37e-4-1.png"
                    alt="RailMutual Connect"
                    className="w-[30px] h-[30px] object-contain"
                  />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-display font-extrabold text-white text-base tracking-tight leading-none">
                    RailMutual <span style={{ color: "#F97316" }}>Connect</span>
                  </span>
                </div>
              </div>
              <p className="text-white/50 text-sm mt-1">
                Mutual Transfers Made Easy
              </p>
              <a
                href="mailto:railmutualconnect@gmail.com"
                className="text-white/50 hover:text-[#F97316] text-sm transition-colors mt-0.5"
              >
                railmutualconnect@gmail.com
              </a>
            </div>

            {/* Right: legal text + copyright */}
            <div className="text-right text-white/50 text-xs space-y-1.5">
              <p>
                This platform only facilitates connections between employees.
              </p>
              <p>Official transfers are governed by Indian Railways rules.</p>
              <p className="mt-2 text-white/40">
                © {new Date().getFullYear()} RailMutual Connect ·{" "}
                railmutualconnect@gmail.com
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
