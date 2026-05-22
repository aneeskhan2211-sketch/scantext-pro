import { c as createLucideIcon, ax as useRouter, j as jsxRuntimeExports, e as cn } from "./index-BQ7M_1jd.js";
import { A as ArrowLeft } from "./arrow-left-DcoT0o12.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ]
];
const Shield = createLucideIcon("shield", __iconNode);
function PageHeader({
  title,
  showBack = false,
  onBack,
  action,
  className,
  transparent = false
}) {
  const router = useRouter();
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.history.back();
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "header",
    {
      className: cn(
        "sticky top-0 z-40 flex items-center justify-between h-14 px-4",
        transparent ? "bg-transparent" : "bg-card/90 border-b border-border/60",
        "backdrop-blur-sm",
        className
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10", children: showBack && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: handleBack,
            className: "flex items-center justify-center w-8 h-8 rounded-lg text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "aria-label": "Go back",
            "data-ocid": "page_header.back_button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-5 h-5" })
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-base font-display font-semibold text-foreground truncate", children: title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 flex justify-end", children: action })
      ]
    }
  );
}
export {
  PageHeader as P,
  Shield as S
};
