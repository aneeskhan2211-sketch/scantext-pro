import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

interface Slide {
  id: number;
  icon: string;
  gradient: string;
  glowColor: string;
  title: string;
  subtitle: string;
  accentWord: string;
}

const SLIDES: Slide[] = [
  {
    id: 0,
    icon: "📸",
    gradient:
      "linear-gradient(135deg, oklch(0.35 0.18 265) 0%, oklch(0.22 0.12 260) 100%)",
    glowColor: "oklch(0.55 0.2 265 / 0.4)",
    title: "Scan Anything",
    accentWord: "Anything",
    subtitle:
      "Capture documents, receipts, business cards, and more with your camera or gallery.",
  },
  {
    id: 1,
    icon: "✦",
    gradient:
      "linear-gradient(135deg, oklch(0.30 0.16 200) 0%, oklch(0.22 0.10 190) 100%)",
    glowColor: "oklch(0.62 0.18 170 / 0.4)",
    title: "Extract Text Instantly",
    accentWord: "Instantly",
    subtitle:
      "Our AI reads printed text, handwriting, and more in 7 languages with high accuracy.",
  },
  {
    id: 2,
    icon: "🗂️",
    gradient:
      "linear-gradient(135deg, oklch(0.28 0.14 175) 0%, oklch(0.20 0.10 200) 100%)",
    glowColor: "oklch(0.55 0.16 175 / 0.4)",
    title: "Organize & Export",
    accentWord: "Export",
    subtitle:
      "Save, search, and export your scans as PDF, TXT, DOCX, or CSV — your data, your way.",
  },
];

function highlightTitle(title: string, accent: string) {
  if (!title.includes(accent)) return <>{title}</>;
  const parts = title.split(accent);
  return (
    <>
      {parts[0]}
      <span
        style={{
          background:
            "linear-gradient(90deg, oklch(0.72 0.18 200), oklch(0.62 0.18 170))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {accent}
      </span>
      {parts[1]}
    </>
  );
}

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [animating, setAnimating] = useState(false);
  const slide = SLIDES[current];
  const isLast = current === SLIDES.length - 1;

  function goTo(next: number, dir: "forward" | "back") {
    if (animating) return;
    setAnimating(true);
    setDirection(dir);
    setTimeout(() => {
      setCurrent(next);
      setAnimating(false);
    }, 280);
  }

  function handleNext() {
    if (isLast) {
      localStorage.setItem("onboarded", "true");
      navigate({ to: "/auth" });
    } else {
      goTo(current + 1, "forward");
    }
  }

  function handlePrev() {
    if (current > 0) goTo(current - 1, "back");
  }

  function handleSkip() {
    localStorage.setItem("onboarded", "true");
    navigate({ to: "/auth" });
  }

  return (
    <div
      data-ocid="onboarding.page"
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 110% 80% at 50% -10%, oklch(0.20 0.04 265) 0%, oklch(0.10 0.015 255) 60%, oklch(0.08 0.012 260) 100%)",
      }}
    >
      {/* Skip button */}
      <div className="flex justify-end px-6 pt-14 pb-2 z-10">
        {!isLast ? (
          <button
            type="button"
            data-ocid="onboarding.skip_button"
            onClick={handleSkip}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 font-body px-3 py-1.5 rounded-lg hover:bg-white/5"
          >
            Skip
          </button>
        ) : (
          <div className="h-8" />
        )}
      </div>

      {/* Slide content */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-8 z-10"
        style={{
          opacity: animating ? 0 : 1,
          transform: animating
            ? direction === "forward"
              ? "translateX(-24px)"
              : "translateX(24px)"
            : "translateX(0)",
          transition: "opacity 0.28s ease, transform 0.28s ease",
        }}
      >
        {/* Icon card */}
        <div
          className="relative w-48 h-48 rounded-3xl flex items-center justify-center mb-10"
          style={{
            background: slide.gradient,
            boxShadow: `0 0 60px ${slide.glowColor}, 0 16px 48px rgba(0,0,0,0.4)`,
          }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-3xl opacity-10"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 19px, oklch(1 0 0 / 0.3) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, oklch(1 0 0 / 0.3) 20px)",
            }}
          />
          <span
            className="text-7xl select-none relative z-10"
            role="img"
            aria-label={slide.title}
          >
            {slide.icon}
          </span>
          <div
            aria-hidden="true"
            className="absolute top-3 right-3 w-4 h-4 rounded-full opacity-40"
            style={{ background: "white" }}
          />
          <div
            aria-hidden="true"
            className="absolute bottom-4 left-4 w-2.5 h-2.5 rounded-full opacity-25"
            style={{ background: "white" }}
          />
        </div>

        <h2 className="text-3xl font-bold font-display text-foreground text-center mb-4 leading-tight">
          {highlightTitle(slide.title, slide.accentWord)}
        </h2>
        <p className="text-base text-muted-foreground font-body text-center leading-relaxed max-w-xs">
          {slide.subtitle}
        </p>
      </div>

      {/* Dots + Navigation */}
      <div className="px-6 pb-14 z-10 space-y-6">
        <div
          className="flex items-center justify-center gap-2"
          aria-label={`Slide ${current + 1} of ${SLIDES.length}`}
        >
          {SLIDES.map((s) => (
            <button
              key={s.id}
              type="button"
              data-ocid={`onboarding.dot.${s.id + 1}`}
              onClick={() => goTo(s.id, s.id > current ? "forward" : "back")}
              aria-label={`Go to slide ${s.id + 1}`}
              className="rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              style={{
                width: current === s.id ? "24px" : "8px",
                height: "8px",
                background:
                  current === s.id
                    ? "linear-gradient(90deg, oklch(0.72 0.18 200), oklch(0.62 0.18 170))"
                    : "oklch(0.30 0.01 250)",
                boxShadow:
                  current === s.id
                    ? "0 0 10px oklch(0.72 0.18 200 / 0.5)"
                    : "none",
              }}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          {current > 0 && (
            <button
              type="button"
              data-ocid="onboarding.prev_button"
              onClick={handlePrev}
              className="flex-none w-14 h-14 rounded-2xl flex items-center justify-center transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              style={{
                background: "oklch(0.20 0.012 250)",
                border: "1px solid oklch(0.30 0.015 250)",
              }}
              aria-label="Previous slide"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M12 4l-6 6 6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

          <button
            type="button"
            data-ocid={
              isLast
                ? "onboarding.get_started_button"
                : "onboarding.next_button"
            }
            onClick={handleNext}
            className="flex-1 h-14 rounded-2xl font-semibold font-display text-base transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98]"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.45 0.22 265) 0%, oklch(0.40 0.20 255) 50%, oklch(0.55 0.18 200) 100%)",
              color: "white",
              boxShadow:
                "0 4px 20px oklch(0.45 0.22 265 / 0.45), 0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            {isLast ? "Get Started" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
