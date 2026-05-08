import { j as jsxRuntimeExports, d as cn } from "./index-CLbxCJ0J.js";
import { B as Button } from "./button-BO8a7v6H.js";
function EmptyState({
  icon: Icon,
  title,
  description,
  ctaLabel,
  onCta,
  className,
  "data-ocid": dataOcid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": dataOcid,
      className: cn(
        "flex flex-col items-center justify-center text-center py-16 px-6 gap-4",
        className
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-8 h-8 text-muted-foreground", strokeWidth: 1.5 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-display font-semibold text-foreground", children: title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed max-w-[240px]", children: description })
        ] }),
        ctaLabel && onCta && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: onCta,
            className: "mt-2",
            "data-ocid": dataOcid ? `${dataOcid}_cta` : void 0,
            children: ctaLabel
          }
        )
      ]
    }
  );
}
export {
  EmptyState as E
};
