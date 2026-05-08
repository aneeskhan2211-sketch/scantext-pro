import { u as useNavigate, r as reactExports, j as jsxRuntimeExports } from "./index-CLbxCJ0J.js";
import { u as useAuth } from "./useAuth-CzVdnJq4.js";
import "./backend-C1iwlURu.js";
import "./useActor-MzWlzUvO.js";
const BENEFITS = [
  "Your scans synced across devices",
  "10 free scans per day",
  "Secure & private — only you can see your data"
];
const ORBS = [
  { cx: 15, cy: 10, r: 40, hue: 265, chroma: 0.18, duration: 9, delay: 0 },
  { cx: 85, cy: 25, r: 32, hue: 200, chroma: 0.15, duration: 11, delay: 2 },
  { cx: 50, cy: 85, r: 50, hue: 170, chroma: 0.14, duration: 13, delay: 1 },
  { cx: 75, cy: 70, r: 28, hue: 240, chroma: 0.12, duration: 8, delay: 3 },
  { cx: 20, cy: 65, r: 22, hue: 215, chroma: 0.1, duration: 10, delay: 4 }
];
function CheckIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: "16",
      height: "16",
      viewBox: "0 0 16 16",
      fill: "none",
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: "8",
            cy: "8",
            r: "7.5",
            stroke: "currentColor",
            strokeWidth: "1",
            opacity: "0.3"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: "M4.5 8l2.5 2.5 4-5",
            stroke: "currentColor",
            strokeWidth: "1.5",
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      ]
    }
  );
}
function IILogo() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "1.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "4", fill: "currentColor", opacity: "0.7" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: "M12 2v4M12 18v4M2 12h4M18 12h4",
            stroke: "currentColor",
            strokeWidth: "1.5",
            strokeLinecap: "round"
          }
        )
      ]
    }
  );
}
function Spinner() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      className: "animate-spin",
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: "12",
            cy: "12",
            r: "10",
            stroke: "white",
            strokeWidth: "2.5",
            strokeOpacity: "0.25"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: "M12 2a10 10 0 0 1 10 10",
            stroke: "white",
            strokeWidth: "2.5",
            strokeLinecap: "round"
          }
        )
      ]
    }
  );
}
function AuthPage() {
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated } = useAuth();
  const [entered, setEntered] = reactExports.useState(false);
  const [loadingLocal, setLoadingLocal] = reactExports.useState(false);
  const navigatedRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    const t = setTimeout(() => setEntered(true), 80);
    return () => clearTimeout(t);
  }, []);
  reactExports.useEffect(() => {
    if (isAuthenticated && !navigatedRef.current) {
      navigatedRef.current = true;
      navigate({ to: "/home" });
    }
  }, [isAuthenticated, navigate]);
  async function handleLogin() {
    setLoadingLocal(true);
    try {
      await login();
    } finally {
      setLoadingLocal(false);
    }
  }
  const isBusy = isLoading || loadingLocal;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "auth.page",
      className: "fixed inset-0 flex flex-col items-center justify-center overflow-hidden",
      style: {
        background: "radial-gradient(ellipse 120% 90% at 50% 0%, oklch(0.18 0.04 265) 0%, oklch(0.10 0.015 255) 50%, oklch(0.08 0.012 260) 100%)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "aria-hidden": "true",
            className: "pointer-events-none absolute inset-0 overflow-hidden",
            children: [
              ORBS.map((orb, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute rounded-full",
                  style: {
                    left: `${orb.cx}%`,
                    top: `${orb.cy}%`,
                    width: `${orb.r * 2}px`,
                    height: `${orb.r * 2}px`,
                    transform: "translate(-50%, -50%)",
                    background: `radial-gradient(circle, oklch(0.50 ${orb.chroma} ${orb.hue} / 0.25) 0%, transparent 70%)`,
                    animation: `orb-float-${i % 2 === 0 ? "a" : "b"} ${orb.duration}s ease-in-out ${orb.delay}s infinite`,
                    filter: "blur(8px)"
                  }
                },
                i
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute inset-0 opacity-[0.035]",
                  style: {
                    backgroundImage: "linear-gradient(oklch(0.9 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(0.9 0 0) 1px, transparent 1px)",
                    backgroundSize: "48px 48px"
                  }
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "relative z-10 w-full max-w-[360px] mx-auto px-6 flex flex-col items-center",
            style: {
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(28px)",
              transition: "opacity 0.5s cubic-bezier(0.4,0,0.2,1), transform 0.5s cubic-bezier(0.4,0,0.2,1)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-8", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0",
                    style: {
                      background: "linear-gradient(135deg, oklch(0.45 0.22 265) 0%, oklch(0.35 0.18 255) 100%)",
                      boxShadow: "0 0 20px oklch(0.45 0.22 265 / 0.4), 0 4px 12px rgba(0,0,0,0.3)"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "svg",
                      {
                        width: "24",
                        height: "24",
                        viewBox: "0 0 72 72",
                        fill: "none",
                        "aria-hidden": "true",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "path",
                            {
                              d: "M8 22V8h14",
                              stroke: "white",
                              strokeWidth: "4",
                              strokeLinecap: "round",
                              strokeLinejoin: "round"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "path",
                            {
                              d: "M64 22V8H50",
                              stroke: "white",
                              strokeWidth: "4",
                              strokeLinecap: "round",
                              strokeLinejoin: "round"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "path",
                            {
                              d: "M8 50v14h14",
                              stroke: "white",
                              strokeWidth: "4",
                              strokeLinecap: "round",
                              strokeLinejoin: "round"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "path",
                            {
                              d: "M64 50v14H50",
                              stroke: "white",
                              strokeWidth: "4",
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
                              stroke: "white",
                              strokeWidth: "3",
                              strokeLinecap: "round"
                            }
                          )
                        ]
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-2xl font-bold font-display tracking-tight text-foreground", children: [
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
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold font-display text-foreground mb-2", children: "Welcome back" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-sm", children: "Sign in to access your scans" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "auth.sign_in_button",
                  onClick: handleLogin,
                  disabled: isBusy,
                  className: "w-full h-14 rounded-2xl flex items-center justify-center gap-3 font-semibold font-display text-base mb-8 transition-smooth active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-70",
                  style: {
                    background: isBusy ? "oklch(0.30 0.10 265)" : "linear-gradient(135deg, oklch(0.48 0.22 265) 0%, oklch(0.42 0.20 255) 50%, oklch(0.55 0.18 200) 100%)",
                    color: "white",
                    boxShadow: isBusy ? "none" : "0 4px 20px oklch(0.45 0.22 265 / 0.45), 0 2px 8px rgba(0,0,0,0.3)"
                  },
                  children: isBusy ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, {}),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Connecting..." })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(IILogo, {}),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Sign in with Internet Identity" })
                  ] })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-full rounded-2xl p-5 mb-6 space-y-3",
                  style: {
                    background: "oklch(0.15 0.012 250)",
                    border: "1px solid oklch(0.24 0.015 250)"
                  },
                  children: BENEFITS.map((benefit, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex items-start gap-3",
                      style: {
                        opacity: entered ? 1 : 0,
                        transform: entered ? "translateX(0)" : "translateX(-12px)",
                        transition: `opacity 0.4s ease ${0.3 + i * 0.1}s, transform 0.4s ease ${0.3 + i * 0.1}s`
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "flex-shrink-0 mt-0.5",
                            style: { color: "oklch(0.72 0.18 170)" },
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(CheckIcon, {})
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-body text-foreground/80 leading-snug", children: benefit })
                      ]
                    },
                    i
                  ))
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-body text-center leading-relaxed px-2", children: [
                "By signing in, you agree to our",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "auth.privacy_policy_link",
                    className: "underline underline-offset-2 hover:text-foreground transition-colors duration-200",
                    children: "Privacy Policy"
                  }
                ),
                ". Your data is encrypted and never sold."
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @keyframes orb-float-a {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px) translateX(0px); }
          33% { transform: translate(-50%, -50%) translateY(-20px) translateX(12px); }
          66% { transform: translate(-50%, -50%) translateY(15px) translateX(-8px); }
        }
        @keyframes orb-float-b {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px) translateX(0px); }
          40% { transform: translate(-50%, -50%) translateY(18px) translateX(-15px); }
          70% { transform: translate(-50%, -50%) translateY(-12px) translateX(10px); }
        }
      ` })
      ]
    }
  );
}
export {
  AuthPage as default
};
