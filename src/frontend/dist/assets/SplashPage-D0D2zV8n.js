import { u as useNavigate, r as reactExports, j as jsxRuntimeExports } from "./index-CLbxCJ0J.js";
import { u as useAuth } from "./useAuth-CzVdnJq4.js";
import "./backend-C1iwlURu.js";
import "./useActor-MzWlzUvO.js";
const DOTS = [0, 1, 2];
function ScanIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: "72",
      height: "72",
      viewBox: "0 0 72 72",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: "M8 22V8h14",
            stroke: "currentColor",
            strokeWidth: "3.5",
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: "M64 22V8H50",
            stroke: "currentColor",
            strokeWidth: "3.5",
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: "M8 50v14h14",
            stroke: "currentColor",
            strokeWidth: "3.5",
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: "M64 50v14H50",
            stroke: "currentColor",
            strokeWidth: "3.5",
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: "14",
            y1: "36",
            x2: "58",
            y2: "36",
            stroke: "currentColor",
            strokeWidth: "2.5",
            strokeLinecap: "round"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "rect",
          {
            x: "22",
            y: "22",
            width: "28",
            height: "28",
            rx: "3",
            stroke: "currentColor",
            strokeWidth: "2",
            opacity: "0.5"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: "27",
            y1: "30",
            x2: "45",
            y2: "30",
            stroke: "currentColor",
            strokeWidth: "1.5",
            strokeLinecap: "round",
            opacity: "0.5"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: "27",
            y1: "36",
            x2: "40",
            y2: "36",
            stroke: "currentColor",
            strokeWidth: "1.5",
            strokeLinecap: "round",
            opacity: "0.5"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: "27",
            y1: "42",
            x2: "43",
            y2: "42",
            stroke: "currentColor",
            strokeWidth: "1.5",
            strokeLinecap: "round",
            opacity: "0.5"
          }
        )
      ]
    }
  );
}
function SplashPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [logoVisible, setLogoVisible] = reactExports.useState(false);
  const [taglineVisible, setTaglineVisible] = reactExports.useState(false);
  const [dotsVisible, setDotsVisible] = reactExports.useState(false);
  const [activeDot, setActiveDot] = reactExports.useState(0);
  const timerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const t1 = setTimeout(() => setLogoVisible(true), 100);
    const t2 = setTimeout(() => setTaglineVisible(true), 700);
    const t3 = setTimeout(() => setDotsVisible(true), 1e3);
    let dotIndex = 0;
    const dotInterval = setInterval(() => {
      dotIndex = (dotIndex + 1) % 3;
      setActiveDot(dotIndex);
    }, 350);
    timerRef.current = setTimeout(() => {
      clearInterval(dotInterval);
      const onboarded = localStorage.getItem("onboarded");
      if (isAuthenticated) {
        navigate({ to: "/home" });
      } else if (onboarded) {
        navigate({ to: "/auth" });
      } else {
        navigate({ to: "/onboarding" });
      }
    }, 2500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearInterval(dotInterval);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isAuthenticated, navigate]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "splash.page",
      className: "fixed inset-0 flex flex-col items-center justify-center overflow-hidden",
      style: {
        background: "radial-gradient(ellipse 120% 80% at 50% 0%, oklch(0.22 0.06 270) 0%, oklch(0.12 0.01 250) 55%, oklch(0.09 0.015 260) 100%)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "aria-hidden": "true",
            className: "pointer-events-none absolute inset-0 overflow-hidden",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute -top-24 -left-24 w-80 h-80 rounded-full opacity-20",
                  style: {
                    background: "radial-gradient(circle, oklch(0.55 0.2 270) 0%, transparent 70%)",
                    animation: "float-orb-1 8s ease-in-out infinite"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute -bottom-24 -right-16 w-72 h-72 rounded-full opacity-15",
                  style: {
                    background: "radial-gradient(circle, oklch(0.62 0.18 170) 0%, transparent 70%)",
                    animation: "float-orb-2 10s ease-in-out infinite"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute top-1/3 left-1/4 w-48 h-48 rounded-full opacity-10",
                  style: {
                    background: "radial-gradient(circle, oklch(0.5 0.15 220) 0%, transparent 70%)",
                    animation: "float-orb-1 12s ease-in-out infinite reverse"
                  }
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center gap-5 z-10",
            style: {
              opacity: logoVisible ? 1 : 0,
              transform: logoVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.6s cubic-bezier(0.4,0,0.2,1), transform 0.6s cubic-bezier(0.4,0,0.2,1)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "relative flex items-center justify-center w-24 h-24 rounded-2xl",
                  style: {
                    background: "linear-gradient(135deg, oklch(0.45 0.22 265) 0%, oklch(0.35 0.18 255) 100%)",
                    boxShadow: "0 0 40px oklch(0.45 0.22 265 / 0.5), 0 8px 24px rgba(0,0,0,0.4)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScanIcon, {}) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        "aria-hidden": "true",
                        className: "absolute top-2 left-3 w-6 h-1.5 rounded-full opacity-40",
                        style: { background: "white" }
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "h1",
                {
                  className: "text-4xl font-bold tracking-tight text-foreground font-display",
                  style: { letterSpacing: "-0.02em" },
                  children: [
                    "ScanText",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        style: {
                          background: "linear-gradient(90deg, oklch(0.72 0.18 200), oklch(0.62 0.18 170))",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text"
                        },
                        children: "Pro"
                      }
                    )
                  ]
                }
              ) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "p",
          {
            className: "mt-4 text-base text-muted-foreground font-body z-10 text-center px-8",
            style: {
              opacity: taglineVisible ? 1 : 0,
              transform: taglineVisible ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.5s cubic-bezier(0.4,0,0.2,1) 0.1s, transform 0.5s cubic-bezier(0.4,0,0.2,1) 0.1s"
            },
            children: [
              "Extract text from anything.",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: {
                    background: "linear-gradient(90deg, oklch(0.72 0.18 200), oklch(0.62 0.18 170))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                  },
                  children: "Instantly."
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute bottom-16 flex items-center gap-2 z-10",
            role: "progressbar",
            "aria-label": "Loading",
            "aria-valuenow": 0,
            "aria-valuemin": 0,
            "aria-valuemax": 100,
            tabIndex: 0,
            style: {
              opacity: dotsVisible ? 1 : 0,
              transition: "opacity 0.4s ease"
            },
            children: DOTS.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "rounded-full transition-all duration-300",
                style: {
                  width: activeDot === i ? "20px" : "8px",
                  height: "8px",
                  background: activeDot === i ? "linear-gradient(90deg, oklch(0.72 0.18 200), oklch(0.62 0.18 170))" : "oklch(0.35 0.01 250)",
                  boxShadow: activeDot === i ? "0 0 12px oklch(0.72 0.18 200 / 0.6)" : "none"
                }
              },
              i
            ))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @keyframes float-orb-1 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-30px) translateX(15px); }
          66% { transform: translateY(20px) translateX(-10px); }
        }
        @keyframes float-orb-2 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          40% { transform: translateY(25px) translateX(-20px); }
          70% { transform: translateY(-15px) translateX(10px); }
        }
      ` })
      ]
    }
  );
}
export {
  SplashPage as default
};
