import { Button } from "@/components/ui/button";
import { useRouter } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  Lock,
  MapPin,
  Shield,
  Train,
  Users,
} from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LandingPage() {
  const router = useRouter();
  const { identity } = useInternetIdentity();

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
      step: "01",
      title: "Create Your Profile",
      desc: "Enter your current posting, desired location, and designation.",
    },
    {
      step: "02",
      title: "Find Matches",
      desc: "Our system automatically finds employees who match your transfer requirements.",
    },
    {
      step: "03",
      title: "Connect & Coordinate",
      desc: "Reach out to your match and coordinate the mutual transfer process.",
    },
  ];

  const stats = [
    { value: "17", label: "Railway Zones" },
    { value: "68+", label: "Divisions" },
    { value: "100%", label: "Free to Use" },
    { value: "3 Steps", label: "Simple Process" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-primary-700 shadow-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2">
            {/* Logo — shrinks gracefully on mobile */}
            <div className="flex items-center gap-2 min-w-0 flex-shrink">
              <img
                src="/assets/uploads/file_0000000092387208b8901a7316cfe37e-4-1.png"
                alt="RailMutual Connect icon"
                className="h-9 w-9 object-contain flex-shrink-0 rounded-md bg-white p-0.5"
              />
              <div className="flex flex-col leading-none min-w-0">
                <span className="font-display font-extrabold text-white text-base sm:text-lg tracking-tight leading-none whitespace-nowrap">
                  RailMutual&nbsp;
                  <span style={{ color: "#FF6B00" }}>Connect</span>
                </span>
                <span className="text-white/55 text-[10px] font-medium tracking-wide mt-0.5 hidden sm:block">
                  Mutual Transfers Made Easy
                </span>
              </div>
            </div>

            {/* Header action buttons */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {identity ? (
                <Button
                  onClick={handleGetStarted}
                  size="sm"
                  className="bg-[#FF6B00] hover:bg-[#E05E00] text-white font-medium text-xs px-2.5 sm:px-3 border border-white/30"
                  data-ocid="landing.header_login_button"
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => router.navigate({ to: "/auth" })}
                    size="sm"
                    variant="outline"
                    className="text-white border-white/40 hover:bg-white/10 font-medium text-xs px-2.5 sm:px-3 bg-transparent"
                    data-ocid="landing.header_login_button"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => router.navigate({ to: "/auth" })}
                    size="sm"
                    className="bg-[#FF6B00] hover:bg-[#E05E00] text-white font-medium text-xs px-2.5 sm:px-3 border-0"
                    data-ocid="landing.header_create_profile_button"
                  >
                    Create Profile
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section — cinematic dark railway background */}
      <section
        className="relative overflow-hidden min-h-[85vh] flex items-center"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-railway-cinematic.dim_1920x1080.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Layer 1: primary dark navy gradient for readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, #0B2C4A 0%, rgba(11,44,74,0.88) 35%, rgba(11,44,74,0.65) 65%, rgba(11,44,74,0.45) 100%)",
          }}
        />
        {/* Layer 2: subtle orange glow from right side for cinematic depth */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to left, rgba(249,115,22,0.18) 0%, transparent 55%)",
          }}
        />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-3xl">
            {/* Hero logo — icon with stacked text */}
            <div className="flex items-center gap-4 mb-8">
              {/* Icon: fixed size, transparent bg */}
              <img
                src="/assets/uploads/file_0000000092387208b8901a7316cfe37e-4-1.png"
                alt="RailMutual Connect icon"
                className="flex-shrink-0 object-contain"
                style={{ width: "72px", height: "72px" }}
              />
              <div className="flex flex-col leading-tight">
                <span className="font-display font-extrabold text-white text-3xl sm:text-4xl tracking-tight leading-none block">
                  RailMutual
                </span>
                <span
                  className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight leading-none block"
                  style={{ color: "#F97316" }}
                >
                  Connect
                </span>
                <span className="text-white/60 text-xs sm:text-sm font-medium tracking-wide mt-1.5">
                  Mutual Transfers Made Easy
                </span>
              </div>
            </div>

            <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight mb-5 text-white">
              Find Your Perfect{" "}
              <span style={{ color: "#F97316" }}>Mutual Transfer</span> Partner
            </h1>

            <p className="text-white/75 text-base sm:text-lg leading-relaxed max-w-xl mb-8">
              A dedicated platform for Indian Railways employees to discover
              mutual transfer opportunities. Connect with colleagues who want to
              swap postings — fast, simple, and secure.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="rounded-full px-8 text-white font-semibold text-base gap-2 shadow-lg border-0"
                style={{ backgroundColor: "#F97316" }}
                data-ocid="landing.hero_cta_button"
              >
                {identity ? "Go to Dashboard" : "Create Profile"}
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.navigate({ to: "/auth" })}
                className="rounded-full px-8 font-medium text-base text-white border-white/40 bg-white/10 hover:bg-white/20"
                data-ocid="landing.header_login_button"
              >
                Login
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="flex items-center gap-1.5 text-xs text-white/75 rounded-full px-3 py-1 border border-white/25 bg-white/10 backdrop-blur-sm">
                <Lock className="w-3 h-3" style={{ color: "#F97316" }} />
                Secure
              </span>
              <span className="text-xs text-white/75 rounded-full px-3 py-1 border border-white/25 bg-white/10 backdrop-blur-sm">
                Free to Use
              </span>
              <span className="text-xs text-white/75 rounded-full px-3 py-1 border border-white/25 bg-white/10 backdrop-blur-sm">
                Indian Railways Only
              </span>
            </div>
          </div>
        </div>

        {/* Orange accent line at bottom of hero */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{
            background: "linear-gradient(to right, #F97316, #0B2C4A)",
          }}
        />
      </section>

      {/* Stats Bar */}
      <section
        className="bg-primary-600 py-6 border-b-2"
        style={{ borderColor: "#FF6B00" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map(({ value, label }, idx) => (
              <div
                key={label}
                className={`text-center py-2 ${idx < stats.length - 1 ? "sm:border-r sm:border-white/20" : ""}`}
              >
                <div
                  className="font-display font-bold text-2xl sm:text-3xl"
                  style={{ color: "#FF6B00" }}
                >
                  {value}
                </div>
                <div className="text-white/70 text-xs sm:text-sm mt-0.5">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-foreground text-2xl sm:text-3xl mb-3">
              Why Choose RailMutual Connect?
            </h2>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              Built specifically for Indian Railways employees, with features
              designed to make mutual transfers straightforward.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="card-top-accent bg-card rounded-xl p-6 shadow-card border border-border hover:shadow-card-hover hover:scale-[1.02] transition-all duration-200 relative overflow-hidden"
              >
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-display font-semibold text-foreground text-lg mb-2">
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

      {/* How It Works */}
      <section id="how-it-works" className="py-16 sm:py-20 how-it-works-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-foreground text-2xl sm:text-3xl mb-3">
              How It Works
            </h2>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              Three simple steps to find your mutual transfer partner.
            </p>
          </div>
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Connecting line on desktop */}
            <div
              className="hidden md:block absolute top-7 left-[calc(16.66%+1.75rem)] right-[calc(16.66%+1.75rem)] h-0.5 border-t-2 border-dashed border-primary-300 z-0"
              aria-hidden="true"
            />
            {steps.map(({ step, title, desc }) => (
              <div
                key={step}
                className="flex flex-col items-center text-center relative z-10"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-4 shadow-md ring-4 ring-orange-100"
                  style={{ backgroundColor: "#FF6B00" }}
                >
                  <span className="font-display font-bold text-white text-lg">
                    {step}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-foreground text-lg mb-2">
                  {title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-primary-700 hover:bg-primary-800 text-white border-0 font-semibold gap-2"
              data-ocid="landing.start_matches_button"
            >
              Start Finding Matches
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-10 bg-orange-50 border-y border-orange-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-l-4 pl-5" style={{ borderColor: "#FF6B00" }}>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2
                className="w-5 h-5 flex-shrink-0"
                style={{ color: "#FF6B00" }}
              />
              <h3 className="font-display font-semibold text-foreground text-lg">
                Important Notice
              </h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
              RailMutual Connect is an independent platform that{" "}
              <strong>only facilitates connections</strong> between Indian
              Railways employees seeking mutual transfers. This platform does
              not process, approve, or guarantee any official transfer. All
              official transfer procedures are governed by{" "}
              <strong>Indian Railways rules and regulations</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-800 text-white/60 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-col gap-2">
              {/* Footer logo — icon + coded text matching primary branding */}
              <div className="flex items-center gap-2.5">
                <img
                  src="/assets/generated/icon-transparent.dim_512x512.png"
                  alt="RailMutual Connect"
                  className="h-9 w-9 object-contain opacity-90"
                />
                <div className="flex flex-col leading-none">
                  <span className="font-display font-extrabold text-white text-base tracking-tight leading-none">
                    RailMutual&nbsp;
                    <span style={{ color: "#FF6B00" }}>Connect</span>
                  </span>
                  <span className="text-white/50 text-[10px] font-medium tracking-wide mt-0.5">
                    Mutual Transfers Made Easy
                  </span>
                </div>
              </div>
              <a
                href="mailto:railmutualconnect@gmail.com"
                className="text-white/50 hover:text-[#FF6B00] text-xs transition-colors block"
              >
                railmutualconnect@gmail.com
              </a>
            </div>
            <div className="text-center sm:text-right text-xs space-y-1">
              <p>
                This platform only facilitates connections between employees.
              </p>
              <p>
                Official transfers are governed by Indian Railways rules and
                regulations.
              </p>
              <p className="mt-2">
                © {new Date().getFullYear()} ·{" "}
                <span className="text-white/40">
                  For assistance:{" "}
                  <a
                    href="mailto:railmutualconnect@gmail.com"
                    className="transition-colors"
                    style={{ color: "#FF6B00" }}
                  >
                    railmutualconnect@gmail.com
                  </a>
                </span>
              </p>
              <p>
                Built with{" "}
                <Heart
                  className="inline w-3 h-3"
                  style={{ color: "#FF6B00" }}
                />{" "}
                using{" "}
                <a
                  href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || "railmutual-connect")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors"
                  style={{ color: "#FF6B00" }}
                >
                  caffeine.ai
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
