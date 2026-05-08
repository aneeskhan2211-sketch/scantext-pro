import { u as useNavigate, r as reactExports, j as jsxRuntimeExports } from "./index-CLbxCJ0J.js";
const SLIDES = [
  {
    id: 0,
    icon: "📸",
    gradient: "linear-gradient(135deg, oklch(0.35 0.18 265) 0%, oklch(0.22 0.12 260) 100%)",
    glowColor: "oklch(0.55 0.2 265 / 0.4)",
    title: "Scan Anything",
    accentWord: "Anything",
    subtitle: "Capture documents, receipts, business cards, and more with your camera or gallery."
  },
  {
    id: 1,
    icon: "✦",
    gradient: "linear-gradient(135deg, oklch(0.30 0.16 200) 0%, oklch(0.22 0.10 190) 100%)",
    glowColor: "oklch(0.62 0.18 170 / 0.4)",
    title: "Extract Text Instantly",
    accentWord: "Instantly",
    subtitle: "Our AI reads printed text, handwriting, and more in 7 languages with high accuracy."
  },
  {
    id: 2,
    icon: "🗂️",
    gradient: "linear-gradient(135deg, oklch(0.28 0.14 175) 0%, oklch(0.20 0.10 200) 100%)",
    glowColor: "oklch(0.55 0.16 175 / 0.4)",
    title: "Organize & Export",
    accentWord: "Export",
    subtitle: "Save, search, and export your scans as PDF, TXT, DOCX, or CSV — your data, your way."
  }
];
function highlightTitle(title, accent) {
  if (!title.includes(accent)) return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: title });
  const parts = title.split(accent);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    parts[0],
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        style: {
          background: "linear-gradient(90deg, oklch(0.72 0.18 200), oklch(0.62 0.18 170))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        },
        children: accent
      }
    ),
    parts[1]
  ] });
}
function OnboardingPage() {
  const navigate = useNavigate();
  const [current, setCurrent] = reactExports.useState(0);
  const [direction, setDirection] = reactExports.useState("forward");
  const [animating, setAnimating] = reactExports.useState(false);
  const slide = SLIDES[current];
  const isLast = current === SLIDES.length - 1;
  function goTo(next, dir) {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "onboarding.page",
      className: "fixed inset-0 flex flex-col overflow-hidden",
      style: {
        background: "radial-gradient(ellipse 110% 80% at 50% -10%, oklch(0.20 0.04 265) 0%, oklch(0.10 0.015 255) 60%, oklch(0.08 0.012 260) 100%)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end px-6 pt-14 pb-2 z-10", children: !isLast ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "data-ocid": "onboarding.skip_button",
            onClick: handleSkip,
            className: "text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 font-body px-3 py-1.5 rounded-lg hover:bg-white/5",
            children: "Skip"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex-1 flex flex-col items-center justify-center px-8 z-10",
            style: {
              opacity: animating ? 0 : 1,
              transform: animating ? direction === "forward" ? "translateX(-24px)" : "translateX(24px)" : "translateX(0)",
              transition: "opacity 0.28s ease, transform 0.28s ease"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "relative w-48 h-48 rounded-3xl flex items-center justify-center mb-10",
                  style: {
                    background: slide.gradient,
                    boxShadow: `0 0 60px ${slide.glowColor}, 0 16px 48px rgba(0,0,0,0.4)`
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        "aria-hidden": "true",
                        className: "absolute inset-0 rounded-3xl opacity-10",
                        style: {
                          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 19px, oklch(1 0 0 / 0.3) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, oklch(1 0 0 / 0.3) 20px)"
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-7xl select-none relative z-10",
                        role: "img",
                        "aria-label": slide.title,
                        children: slide.icon
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        "aria-hidden": "true",
                        className: "absolute top-3 right-3 w-4 h-4 rounded-full opacity-40",
                        style: { background: "white" }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        "aria-hidden": "true",
                        className: "absolute bottom-4 left-4 w-2.5 h-2.5 rounded-full opacity-25",
                        style: { background: "white" }
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold font-display text-foreground text-center mb-4 leading-tight", children: highlightTitle(slide.title, slide.accentWord) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base text-muted-foreground font-body text-center leading-relaxed max-w-xs", children: slide.subtitle })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 pb-14 z-10 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex items-center justify-center gap-2",
              "aria-label": `Slide ${current + 1} of ${SLIDES.length}`,
              children: SLIDES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": `onboarding.dot.${s.id + 1}`,
                  onClick: () => goTo(s.id, s.id > current ? "forward" : "back"),
                  "aria-label": `Go to slide ${s.id + 1}`,
                  className: "rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  style: {
                    width: current === s.id ? "24px" : "8px",
                    height: "8px",
                    background: current === s.id ? "linear-gradient(90deg, oklch(0.72 0.18 200), oklch(0.62 0.18 170))" : "oklch(0.30 0.01 250)",
                    boxShadow: current === s.id ? "0 0 10px oklch(0.72 0.18 200 / 0.5)" : "none"
                  }
                },
                s.id
              ))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            current > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "onboarding.prev_button",
                onClick: handlePrev,
                className: "flex-none w-14 h-14 rounded-2xl flex items-center justify-center transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                style: {
                  background: "oklch(0.20 0.012 250)",
                  border: "1px solid oklch(0.30 0.015 250)"
                },
                "aria-label": "Previous slide",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "svg",
                  {
                    width: "20",
                    height: "20",
                    viewBox: "0 0 20 20",
                    fill: "none",
                    "aria-hidden": "true",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "path",
                      {
                        d: "M12 4l-6 6 6 6",
                        stroke: "currentColor",
                        strokeWidth: "2",
                        strokeLinecap: "round",
                        strokeLinejoin: "round"
                      }
                    )
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": isLast ? "onboarding.get_started_button" : "onboarding.next_button",
                onClick: handleNext,
                className: "flex-1 h-14 rounded-2xl font-semibold font-display text-base transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98]",
                style: {
                  background: "linear-gradient(135deg, oklch(0.45 0.22 265) 0%, oklch(0.40 0.20 255) 50%, oklch(0.55 0.18 200) 100%)",
                  color: "white",
                  boxShadow: "0 4px 20px oklch(0.45 0.22 265 / 0.45), 0 2px 8px rgba(0,0,0,0.3)"
                },
                children: isLast ? "Get Started" : "Next"
              }
            )
          ] })
        ] })
      ]
    }
  );
}
export {
  OnboardingPage as default
};
