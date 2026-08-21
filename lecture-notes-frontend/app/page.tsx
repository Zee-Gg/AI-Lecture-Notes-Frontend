"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";
import { supabase } from "./lib/supabaseClient";

const FEATURES = [
  {
    icon: "🎙️",
    title: "Upload Any Lecture",
    description:
      "Drop in an audio recording and get an accurate transcript, automatically, in minutes.",
    accentClass: "bg-accent-soft text-accent",
  },
  {
    icon: "💡",
    title: "AI-Generated Notes",
    description:
      "Key concepts, definitions, and formulas are pulled out and organized for you.",
    accentClass: "bg-status-done-bg text-status-done-text",
  },
  {
    icon: "⭐",
    title: "Catches What Matters",
    description:
      "Surfaces the points your professor emphasized, so you never miss the important stuff.",
    accentClass: "bg-status-failed-bg text-status-failed-text",
  },
  {
    icon: "💬",
    title: "Ask Your Lectures",
    description:
      "Chat across an entire course and get answers backed by citations to the source transcript.",
    accentClass: "bg-accent-2-soft text-accent-2",
  },
  {
    icon: "📚",
    title: "Organized by Course",
    description:
      "Every lecture lives in its course, so revising for an exam means opening one place.",
    accentClass: "bg-status-pending-bg text-status-pending-text",
  },
  {
    icon: "✏️",
    title: "Fully Editable",
    description:
      "Rename courses and lectures inline, anytime — your workspace, your words.",
    accentClass: "bg-accent-soft text-accent",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Upload",
    description: "Add a recording to any course in a couple of clicks.",
  },
  {
    number: "02",
    title: "Process",
    description:
      "We transcribe the audio and extract concepts, definitions, and formulas.",
  },
  {
    number: "03",
    title: "Review & Ask",
    description:
      "Read your notes, browse the transcript, or ask questions and get cited answers.",
  },
];

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-surface-alt text-text-primary">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-border bg-surface-alt/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white text-sm font-bold">
              AI
            </span>
            <span className="font-semibold tracking-tight">
              Lecture Notes Assistant
            </span>
          </div>

          <nav className="flex items-center gap-3">
            {!loading && user ? (
              <>
                <button
                  onClick={handleLogout}
                  className="text-text-secondary hover:text-text-primary font-medium px-4 py-2 rounded-xl transition-colors"
                >
                  Log Out
                </button>
                <Link
                  href="/dashboard"
                  className="bg-accent hover:bg-accent-hover text-white font-medium px-5 py-2 rounded-xl shadow-sm transition-colors"
                >
                  Go to Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-text-secondary hover:text-text-primary font-medium px-4 py-2 rounded-xl transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="bg-accent hover:bg-accent-hover text-white font-medium px-5 py-2 rounded-xl shadow-sm hover:shadow-md transition-all"
                >
                  Sign Up Free
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-[-10%] w-[36rem] h-[36rem] rounded-full bg-accent-soft blur-3xl opacity-70"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-40 left-[-10%] w-[28rem] h-[28rem] rounded-full bg-accent-2-soft blur-3xl opacity-60"
        />

        <div className="relative max-w-6xl mx-auto px-6 sm:px-12 pt-16 pb-24 grid lg:grid-cols-2 gap-14 items-center">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 bg-accent-soft text-accent text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              ✨ AI-powered study companion
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1]">
              Turn every lecture into notes you&apos;ll actually use.
            </h1>
            <p className="text-text-secondary text-lg mt-5 leading-relaxed max-w-lg">
              Upload a recording and let AI transcribe it, extract the key
              concepts and definitions, and highlight what your professor
              emphasized most — all organized by course.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-8">
              {!loading && user ? (
                <Link
                  href="/dashboard"
                  className="bg-accent hover:bg-accent-hover text-white font-medium px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all"
                >
                  Go to Dashboard →
                </Link>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="bg-accent hover:bg-accent-hover text-white font-medium px-6 py-3 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    href="/login"
                    className="border border-border bg-surface hover:bg-surface-alt text-text-primary font-medium px-6 py-3 rounded-xl transition-colors"
                  >
                    Log In
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Decorative preview card */}
          <div className="relative animate-fade-up" style={{ animationDelay: "150ms" }}>
            <div className="animate-float bg-surface border border-border rounded-2xl shadow-xl p-6 max-w-md mx-auto">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-text-primary">
                  Intro to Databases — Lecture 4
                </h3>
                <span className="bg-status-done-bg text-status-done-text text-xs font-medium px-2.5 py-1 rounded-full">
                  Done
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-md bg-accent-soft text-accent flex items-center justify-center text-xs">
                      💡
                    </span>
                    <span className="text-sm font-medium text-text-primary">
                      Key Concepts
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 pl-8">
                    {["Normalization", "ACID", "Indexing"].map((c) => (
                      <span
                        key={c}
                        className="bg-surface-alt border border-border text-text-secondary text-xs px-2.5 py-1 rounded-full"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-md bg-status-failed-bg text-status-failed-text flex items-center justify-center text-xs">
                      ⭐
                    </span>
                    <span className="text-sm font-medium text-text-primary">
                      Teacher Emphasized
                    </span>
                  </div>
                  <p className="text-text-secondary text-sm pl-8 leading-relaxed">
                    &ldquo;This will definitely be on the exam&rdquo; — normal
                    forms up to 3NF.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 sm:px-12 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl font-bold tracking-tight">
            Everything your notes should have been doing all along
          </h2>
          <p className="text-text-secondary mt-3">
            Built for the way students actually study.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-surface border border-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 text-lg ${f.accentClass}`}
              >
                {f.icon}
              </div>
              <h3 className="font-semibold text-text-primary">{f.title}</h3>
              <p className="text-text-secondary text-sm mt-1.5 leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-surface border-y border-border">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 py-20">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-bold tracking-tight">
              From recording to revision in three steps
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <div key={s.number} className="relative">
                <span className="text-5xl font-bold text-accent-soft select-none">
                  {s.number}
                </span>
                <h3 className="font-semibold text-text-primary text-lg mt-2">
                  {s.title}
                </h3>
                <p className="text-text-secondary text-sm mt-1.5 leading-relaxed">
                  {s.description}
                </p>
                {i < STEPS.length - 1 && (
                  <span
                    aria-hidden
                    className="hidden sm:block absolute top-6 -right-4 text-text-muted"
                  >
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 sm:px-12 py-20">
        <div className="relative overflow-hidden bg-accent rounded-3xl px-8 py-14 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/10"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10"
          />
          <h2 className="relative text-3xl font-bold text-white tracking-tight">
            Stop rewriting lecture notes from scratch.
          </h2>
          <p className="relative text-white/90 mt-3 max-w-lg mx-auto">
            Create your account and upload your first lecture in under a
            minute.
          </p>
          {!loading && user ? (
            <Link
              href="/dashboard"
              className="relative inline-block mt-7 bg-white text-accent font-semibold px-7 py-3 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              href="/signup"
              className="relative inline-block mt-7 bg-white text-accent font-semibold px-7 py-3 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              Get Started Free
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-accent flex items-center justify-center text-white text-xs font-bold">
              AI
            </span>
            <span className="text-sm text-text-secondary">
              Lecture Notes Assistant
            </span>
          </div>
          <p className="text-text-muted text-sm">
            © {new Date().getFullYear()} Lecture Notes Assistant. All rights
            reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
