import { Header } from "@/componente/navigations/Header";
import { Footer } from "@/componente/navigations/Footer";
import { Background } from "@/componente/globalcomponents/Background";
import Link from "next/link";

const features = [
  {
    icon: "⚡",
    title: "Real-time Feedback",
    description: "Watch your WPM, accuracy, and errors update instantly as you type. See exactly where you need to improve.",
  },
  {
    icon: "📊",
    title: "Detailed Analytics",
    description: "Track your progress over time with performance graphs, consistency scores, and detailed session history.",
  },
  {
    icon: "🎯",
    title: "Multiple Modes",
    description: "Choose between timed tests or word count challenges. Perfect for both quick warmups and endurance training.",
  },
  {
    icon: "🏆",
    title: "Competitive Leaderboards",
    description: "Compare your scores with typists worldwide. Daily, weekly, and all-time leaderboards keep you motivated.",
  },
  {
    icon: "🎨",
    title: "Clean Interface",
    description: "Distraction-free design with a beautiful dark theme. Focus entirely on what matters - your typing.",
  },
  {
    icon: "📱",
    title: "Fully Responsive",
    description: "Practice anywhere, anytime. Works perfectly on desktop, tablet, and mobile devices.",
  },
];

const stats = [
  { label: "Tests Completed", value: "1.2M+" },
  { label: "Active Typists", value: "50K+" },
  { label: "Words Typed", value: "89M+" },
  { label: "Avg WPM", value: "72" },
];

export function AboutPage() {
  return (
    <main className="min-h-screen bg-background bg-mesh relative overflow-hidden">
      <Background />
      
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-8 min-h-screen flex flex-col">
        <Header />
        
        <div className="flex-1">
          {/* Hero Section */}
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight mb-4">
              About{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                TypingArena
              </span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A modern typing test platform built for typists who care about precision, 
              performance, and the details that make practice perfect.
            </p>
          </div>

          {/* Stats */}
          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-16 sm:mb-20">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border bg-surface p-4 sm:p-6 text-center hover:border-primary/30 transition-colors"
              >
                <div className="font-mono text-2xl sm:text-3xl md:text-4xl font-bold text-gradient mb-1 sm:mb-2">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
            ))}
          </div> */}

          {/* Features Grid */}
          <div className="mb-16 sm:mb-20">
            <h3 className="text-center font-display font-bold text-2xl sm:text-3xl tracking-tight mb-8 sm:mb-12">
              Why TypingArena?
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-xl border border-border bg-surface p-5 sm:p-6 hover:border-primary/30 hover:bg-surface/80 transition-all duration-300"
                >
                  <div className="text-2xl sm:text-3xl mb-3">{feature.icon}</div>
                  <h4 className="font-semibold text-sm sm:text-base text-foreground mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-16 sm:mb-20">
            <h3 className="text-center font-display font-bold text-2xl sm:text-3xl tracking-tight mb-8 sm:mb-12">
              How It Works
            </h3>
            <div className="grid sm:grid-cols-3 gap-4 sm:gap-8">
              {[
                {
                  step: "01",
                  title: "Choose Your Mode",
                  description: "Select timed or word count mode. Pick your duration or word goal.",
                },
                {
                  step: "02",
                  title: "Start Typing",
                  description: "Type the displayed words as quickly and accurately as you can.",
                },
                {
                  step: "03",
                  title: "Review & Improve",
                  description: "Analyze your performance with detailed stats and track progress over time.",
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <span className="font-mono text-lg sm:text-xl font-bold text-primary">{item.step}</span>
                  </div>
                  <h4 className="font-semibold text-sm sm:text-base text-foreground mb-2">{item.title}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Philosophy */}
          <div className="mb-16 sm:mb-20">
            <div className="rounded-2xl border border-border bg-surface/50 backdrop-blur-sm p-6 sm:p-10 text-center">
              <h3 className="font-display font-bold text-xl sm:text-2xl tracking-tight mb-4">
                Our Philosophy
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                We believe typing is a fundamental skill that deserves better tools. 
                TypingArena combines modern design with powerful analytics to create 
                a practice experience that's both beautiful and effective. No ads, 
                no distractions — just pure typing improvement.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center pb-8">
            <h3 className="font-display font-bold text-xl sm:text-2xl tracking-tight mb-4">
              Ready to improve your typing?
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Join thousands of typists already practicing on TypingArena.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/"
                className="px-6 sm:px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold tracking-wide hover:pulse-glow transition-all text-sm sm:text-base"
                style={{ boxShadow: "var(--shadow-glow)" }}
              >
                Start Typing
              </Link>
              {/* <Link
                href="/register"
                className="px-6 sm:px-8 py-3 rounded-lg border border-border text-foreground font-semibold tracking-wide hover:border-primary/50 hover:text-primary transition-all text-sm sm:text-base"
              >
                Create Account
              </Link> */}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}