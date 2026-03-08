import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@tanstack/react-router";
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
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              {/* Icon only */}
              <img
                src="/assets/generated/logo-icon-only.dim_200x200.png"
                alt="RailMutual Connect icon"
                className="h-9 w-9 object-contain"
              />
              {/* Text built in code — same layout as primary branding logo */}
              <div className="flex flex-col leading-none">
                <span className="font-display font-extrabold text-white text-lg tracking-tight leading-none">
                  RailMutual&nbsp;
                  <span className="text-[#FF941C]">Connect</span>
                </span>
                <span className="text-white/55 text-[10px] font-medium tracking-wide mt-0.5 hidden sm:block">
                  Mutual Transfers Made Easy
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/admin-login"
                data-ocid="landing.admin_login_link"
                className="flex items-center gap-1 text-xs text-white/60 hover:text-white transition-colors px-2 py-1 border border-white/20 rounded-md"
              >
                <Shield className="w-3 h-3" />
                Admin
              </Link>
              <Button
                onClick={handleGetStarted}
                className="bg-orange-500 hover:bg-orange-600 text-white border-0 font-medium"
                size="sm"
                data-ocid="landing.header_login_button"
              >
                {identity ? "Go to Dashboard" : "Login / Register"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-banner.dim_1440x400.png')",
          }}
        />
        <div className="absolute inset-0 hero-overlay" />

        {/* Animated Train */}
        <div
          className="absolute bottom-6 left-0 w-full pointer-events-none z-10 animate-train-slide"
          aria-hidden="true"
          style={{ willChange: "transform" }}
        >
          <div className="flex items-center gap-1 opacity-20">
            <Train className="w-8 h-8 text-orange-300" />
            <div className="h-0.5 w-16 bg-orange-300/60 rounded" />
            <div className="h-0.5 w-8 bg-orange-300/40 rounded" />
            <div className="h-0.5 w-12 bg-orange-300/20 rounded" />
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-36">
          <div className="max-w-2xl">
            {/* Hero logo — icon + stacked text matching brand sample */}
            <div className="flex items-center gap-4 mb-8">
              <img
                src="/assets/generated/logo-icon-only.dim_200x200.png"
                alt="RailMutual Connect icon"
                className="h-20 sm:h-24 w-auto object-contain drop-shadow-lg"
                style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))" }}
              />
              <div className="flex flex-col leading-tight">
                <span className="font-display font-extrabold text-white text-4xl sm:text-5xl tracking-tight leading-none">
                  RailMutual
                </span>
                <span className="font-display font-extrabold text-[#FF941C] text-4xl sm:text-5xl tracking-tight leading-none">
                  Connect
                </span>
                <span className="text-white/65 text-sm sm:text-base font-medium tracking-wide mt-2">
                  Mutual Transfers Made Easy
                </span>
              </div>
            </div>

            <h1 className="font-display font-bold text-white text-3xl sm:text-4xl lg:text-5xl leading-tight mb-4">
              Find Your Perfect{" "}
              <span className="text-orange-400">Mutual Transfer</span> Partner
            </h1>
            <p className="text-white/80 text-base sm:text-lg mb-8 leading-relaxed">
              A dedicated platform for Indian Railways employees to discover
              mutual transfer opportunities. Connect with colleagues who want to
              swap postings — fast, simple, and secure.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="btn-shimmer animate-shimmer text-white border-0 font-semibold text-base px-8 gap-2 animate-pulse-soft shadow-lg"
                data-ocid="landing.hero_cta_button"
              >
                {identity ? "Go to Dashboard" : "Get Started Free"}
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="border-white/40 text-white hover:bg-white/10 hover:text-white font-medium text-base"
                data-ocid="landing.how_it_works_button"
              >
                How It Works
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="flex items-center gap-1.5 text-white/70 text-xs bg-white/10 rounded-full px-3 py-1">
                <Lock className="w-3 h-3 text-orange-300" />
                Secure
              </span>
              <span className="text-white/30 text-xs hidden sm:inline">•</span>
              <span className="text-white/70 text-xs bg-white/10 rounded-full px-3 py-1">
                Free to Use
              </span>
              <span className="text-white/30 text-xs hidden sm:inline">•</span>
              <span className="text-white/70 text-xs bg-white/10 rounded-full px-3 py-1">
                Indian Railways Only
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-primary-600 py-6 border-b-2 border-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map(({ value, label }, idx) => (
              <div
                key={label}
                className={`text-center py-2 ${idx < stats.length - 1 ? "sm:border-r sm:border-white/20" : ""}`}
              >
                <div className="font-display font-bold text-orange-400 text-2xl sm:text-3xl">
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
                <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center mb-4 shadow-md ring-4 ring-orange-100">
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
          <div className="border-l-4 border-orange-500 pl-5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0" />
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
                  src="/assets/generated/logo-icon-only.dim_200x200.png"
                  alt="RailMutual Connect"
                  className="h-9 w-9 object-contain opacity-90"
                />
                <div className="flex flex-col leading-none">
                  <span className="font-display font-extrabold text-white text-base tracking-tight leading-none">
                    RailMutual&nbsp;
                    <span className="text-[#FF941C]">Connect</span>
                  </span>
                  <span className="text-white/50 text-[10px] font-medium tracking-wide mt-0.5">
                    Mutual Transfers Made Easy
                  </span>
                </div>
              </div>
              <a
                href="mailto:railmutualconnect@gmail.com"
                className="text-white/50 hover:text-orange-400 text-xs transition-colors block"
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
                    className="text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    railmutualconnect@gmail.com
                  </a>
                </span>{" "}
                ·{" "}
                <Link
                  to="/admin-login"
                  data-ocid="landing.footer_admin_link"
                  className="text-white/30 hover:text-white/60 transition-colors"
                >
                  Admin
                </Link>
              </p>
              <p>
                Built with <Heart className="inline w-3 h-3 text-orange-400" />{" "}
                using{" "}
                <a
                  href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || "railmutual-connect")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 transition-colors"
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
