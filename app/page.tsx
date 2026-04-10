import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="bg-surface text-on-surface overflow-x-hidden">
      {/* TopNav */}
      <nav className="flex justify-between items-center px-8 w-full sticky top-0 z-50 h-16 bg-surface-container-low shadow-sm">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Image src="/cadmus-logo.jpg" alt="CADMUS" width={28} height={28} className="rounded-lg object-contain" />
            <span className="text-xl font-bold tracking-tighter text-on-surface">CADMUS</span>
          </div>
          <div className="hidden md:flex gap-6 items-center">
            <Link href="/dashboard" className="text-primary border-b-2 border-primary pb-1 text-sm font-medium">
              Dashboard
            </Link>
            <Link href="/templates" className="text-on-surface-variant hover:text-primary transition-colors text-sm font-medium">
              Templates
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/auth"
            className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/auth"
            className="sculpted-pill text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg hover:translate-y-[-1px] transition-transform active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section className="relative pt-24 pb-32 px-8 overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-6 z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-pale text-secondary text-xs font-bold tracking-widest uppercase mb-6">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                New Engine V2.4
              </div>
              <h1 className="text-6xl lg:text-7xl font-extrabold tracking-tight text-on-surface leading-[1.05] mb-8">
                Your Idea Is <br />
                <span className="text-primary italic">Not a Spec.</span>
              </h1>
              <p className="text-lg text-on-surface-variant leading-relaxed mb-10 max-w-lg">
                CADMUS turns vague product ideas into structured, build-ready specifications through
                guided system design, live critique, and export-ready outputs.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/auth"
                  className="sculpted-pill text-white px-8 py-4 rounded-full font-bold shadow-lg hover:translate-y-[-2px] transition-transform active:scale-95"
                >
                  Start Sculpting
                </Link>
                <Link
                  href="/templates"
                  className="bg-surface-high text-primary px-8 py-4 rounded-full font-bold hover:bg-surface-container-low transition-colors active:scale-95"
                >
                  View Templates
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="relative w-full aspect-square flex items-center justify-center">
                <div className="absolute w-[120%] h-[120%] bg-surface-container-low rounded-full blur-3xl opacity-50 -z-10" />
                <div className="relative grid grid-cols-2 gap-6 w-full">
                  <div className="clay-inset p-8 rounded-lg rotate-[-3deg] flex flex-col gap-4 border border-white/20">
                    <div className="h-4 w-3/4 bg-on-surface-variant/10 rounded-full" />
                    <div className="h-4 w-1/2 bg-on-surface-variant/10 rounded-full" />
                    <div className="h-32 w-full bg-on-surface-variant/5 rounded-xl border-2 border-dashed border-on-surface-variant/20 flex items-center justify-center text-on-surface-variant/30 italic text-sm">
                      &ldquo;Make it like Uber for X...&rdquo;
                    </div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 clay-card px-6 py-4 rounded-full flex items-center gap-3 border border-white/40 shadow-xl">
                    <span className="material-symbols-outlined text-tertiary">auto_awesome</span>
                    <span className="font-bold text-on-surface">Clarity: 98%</span>
                  </div>
                  <div className="clay-card p-6 rounded-lg rotate-[2deg] translate-y-8 border border-white/60">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary material-symbols-outlined">
                        data_object
                      </span>
                      <div className="h-3 w-20 bg-primary/20 rounded-full" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 w-full bg-on-surface-variant/10 rounded-full" />
                      <div className="h-2 w-full bg-on-surface-variant/10 rounded-full" />
                      <div className="h-2 w-4/5 bg-on-surface-variant/10 rounded-full" />
                    </div>
                  </div>
                  <div className="clay-card p-6 rounded-lg rotate-[-1deg] translate-x-4 border border-white/60">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary material-symbols-outlined">
                        account_tree
                      </span>
                      <div className="h-3 w-16 bg-tertiary/20 rounded-full" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 w-full bg-on-surface-variant/10 rounded-full" />
                      <div className="h-2 w-2/3 bg-on-surface-variant/10 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 bg-surface-container-low px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-20 text-center max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold tracking-tight mb-6">Most Teams Are Not Building From Truth</h2>
              <p className="text-on-surface-variant">
                Vague Jira tickets and loose Figma mocks are recipes for technical debt. CADMUS creates
                the single source of truth before a single line of code is written.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: 'edit_note',
                  step: '01',
                  title: 'Describe Your Idea',
                  desc: 'Dump your raw thoughts. No structure needed. CADMUS extracts what matters.',
                },
                {
                  icon: 'psychology',
                  step: '02',
                  title: 'Answer Guided Questions',
                  desc: 'Walk through 10 spec sections with AI-guided prompts that surface gaps in real time.',
                },
                {
                  icon: 'file_export',
                  step: '03',
                  title: 'Export Build-Ready Docs',
                  desc: 'PRDs, engineering handoffs, AI build prompts — all generated from your sculpted spec.',
                },
              ].map((item) => (
                <div key={item.step} className="clay-card p-8 rounded-lg border border-white/60">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary material-symbols-outlined mb-4">
                    {item.icon}
                  </div>
                  <p className="text-xs font-bold text-on-surface-variant/50 uppercase tracking-widest mb-2">
                    Step {item.step}
                  </p>
                  <h3 className="text-xl font-bold text-on-surface mb-3">{item.title}</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Export Cards */}
        <section className="py-24 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 text-center max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold tracking-tight mb-6">Every Output Your Team Needs</h2>
              <p className="text-on-surface-variant">
                From PRDs to engineering handoffs to AI build prompts — CADMUS generates everything from
                your single sculpted spec.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: 'description', label: 'Full Spec Doc' },
                { icon: 'article', label: 'PRD' },
                { icon: 'engineering', label: 'Eng Handoff' },
                { icon: 'smart_toy', label: 'AI Build Prompt' },
                { icon: 'view_timeline', label: 'Phase Plan' },
                { icon: 'bug_report', label: 'Test Cases' },
                { icon: 'checklist', label: 'Edge Case List' },
                { icon: 'slideshow', label: 'Deck Outline' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="clay-inset p-6 rounded-lg flex flex-col items-center gap-3 text-center"
                >
                  <span className="material-symbols-outlined text-primary text-3xl">{item.icon}</span>
                  <span className="text-sm font-semibold text-on-surface">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-8 bg-primary">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold tracking-tight text-white mb-6">
              Stop Building From Guesses
            </h2>
            <p className="text-white/70 mb-10 text-lg">
              Start sculpting your spec today. It&apos;s free, fast, and your engineers will thank you.
            </p>
            <Link
              href="/auth"
              className="inline-flex bg-white text-primary px-10 py-4 rounded-full font-bold shadow-lg hover:translate-y-[-2px] transition-transform active:scale-95"
            >
              Start Sculpting Free
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-high bg-[#f0ede8] py-8 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image src="/cadmus-logo.jpg" alt="CADMUS" width={28} height={28} className="rounded-lg object-contain" />
            <span className="font-bold text-on-surface text-sm">CADMUS</span>
            <span className="text-on-surface-variant/40 text-sm">—</span>
            <span className="text-on-surface-variant text-sm">Your idea is not a spec.</span>
          </div>
          <div className="flex items-center gap-2">
            <a href="https://jourdanlabs.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
              <Image src="/jourdanlabs-logo.jpg" alt="JourdanLabs" width={20} height={20} className="rounded object-contain opacity-60 group-hover:opacity-100 transition-opacity" />
              <span className="text-xs text-on-surface-variant group-hover:text-on-surface transition-colors font-medium">JourdanLabs</span>
            </a>
            <span className="text-on-surface-variant/30 text-xs">·</span>
            <span className="text-xs text-on-surface-variant/60">Powered by COSMIC</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
