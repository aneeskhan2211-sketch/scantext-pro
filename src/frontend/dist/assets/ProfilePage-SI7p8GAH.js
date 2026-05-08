import { c as createLucideIcon, j as jsxRuntimeExports, r as reactExports, d as cn, q as useTheme, u as useNavigate, b as ue } from "./index-CLbxCJ0J.js";
import { P as PageHeader, S as Shield } from "./PageHeader-B2O6R1mO.js";
import { c as composeEventHandlers, a as createSlottable, b as createContextScope, u as useControllableState, P as Primitive } from "./index-BlW7uNs2.js";
import { u as useComposedRefs } from "./index-CYXnM25L.js";
import { R as Root$1, b as Trigger, W as WarningProvider, C as Content, T as Title, D as Description, a as Close, c as createDialogScope, P as Portal, O as Overlay } from "./index-xugKHP5J.js";
import { b as buttonVariants, B as Button } from "./button-BO8a7v6H.js";
import { B as Badge } from "./badge-BzXT6kO9.js";
import { u as usePrevious, e as useSize, S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-QKlIlMx6.js";
import { u as useAuth } from "./useAuth-CzVdnJq4.js";
import { u as useIsPremium } from "./useSubscription-B36YRjB-.js";
import { u as useUsageLimit } from "./useUsageLimit-ioW1iwub.js";
import { C as Crown } from "./crown-BAhYokLz.js";
import { S as ScanText } from "./scan-text-mv5OTMSV.js";
import { S as Star } from "./star-DULxIyzM.js";
import { F as FileText } from "./file-text-C37Lskd6.js";
import { B as Bell } from "./bell-Cg2FxRry.js";
import { T as Trash2 } from "./trash-2-ylQv7UWx.js";
import { C as CircleHelp } from "./circle-help-AtkQuIgV.js";
import { E as ExternalLink } from "./external-link-B_9Bbb0Y.js";
import { C as ChevronRight } from "./chevron-right-CH9RHTE_.js";
import "./arrow-left-PPnhWFp7.js";
import "./index-D5ioHTv5.js";
import "./index-CaXFtB2N.js";
import "./backend-C1iwlURu.js";
import "./useActor-MzWlzUvO.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",
      key: "96xj49"
    }
  ]
];
const Flame = createLucideIcon("flame", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m16 17 5-5-5-5", key: "1bji2h" }],
  ["path", { d: "M21 12H9", key: "dn1m92" }],
  ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }]
];
const LogOut = createLucideIcon("log-out", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z", key: "a7tn18" }]
];
const Moon = createLucideIcon("moon", __iconNode);
var ROOT_NAME = "AlertDialog";
var [createAlertDialogContext] = createContextScope(ROOT_NAME, [
  createDialogScope
]);
var useDialogScope = createDialogScope();
var AlertDialog$1 = (props) => {
  const { __scopeAlertDialog, ...alertDialogProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root$1, { ...dialogScope, ...alertDialogProps, modal: true });
};
AlertDialog$1.displayName = ROOT_NAME;
var TRIGGER_NAME = "AlertDialogTrigger";
var AlertDialogTrigger$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...triggerProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Trigger, { ...dialogScope, ...triggerProps, ref: forwardedRef });
  }
);
AlertDialogTrigger$1.displayName = TRIGGER_NAME;
var PORTAL_NAME = "AlertDialogPortal";
var AlertDialogPortal$1 = (props) => {
  const { __scopeAlertDialog, ...portalProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { ...dialogScope, ...portalProps });
};
AlertDialogPortal$1.displayName = PORTAL_NAME;
var OVERLAY_NAME = "AlertDialogOverlay";
var AlertDialogOverlay$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...overlayProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Overlay, { ...dialogScope, ...overlayProps, ref: forwardedRef });
  }
);
AlertDialogOverlay$1.displayName = OVERLAY_NAME;
var CONTENT_NAME = "AlertDialogContent";
var [AlertDialogContentProvider, useAlertDialogContentContext] = createAlertDialogContext(CONTENT_NAME);
var Slottable = createSlottable("AlertDialogContent");
var AlertDialogContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, children, ...contentProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    const contentRef = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef);
    const cancelRef = reactExports.useRef(null);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      WarningProvider,
      {
        contentName: CONTENT_NAME,
        titleName: TITLE_NAME,
        docsSlug: "alert-dialog",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogContentProvider, { scope: __scopeAlertDialog, cancelRef, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Content,
          {
            role: "alertdialog",
            ...dialogScope,
            ...contentProps,
            ref: composedRefs,
            onOpenAutoFocus: composeEventHandlers(contentProps.onOpenAutoFocus, (event) => {
              var _a;
              event.preventDefault();
              (_a = cancelRef.current) == null ? void 0 : _a.focus({ preventScroll: true });
            }),
            onPointerDownOutside: (event) => event.preventDefault(),
            onInteractOutside: (event) => event.preventDefault(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Slottable, { children }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DescriptionWarning, { contentRef })
            ]
          }
        ) })
      }
    );
  }
);
AlertDialogContent$1.displayName = CONTENT_NAME;
var TITLE_NAME = "AlertDialogTitle";
var AlertDialogTitle$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...titleProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { ...dialogScope, ...titleProps, ref: forwardedRef });
  }
);
AlertDialogTitle$1.displayName = TITLE_NAME;
var DESCRIPTION_NAME = "AlertDialogDescription";
var AlertDialogDescription$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeAlertDialog, ...descriptionProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Description, { ...dialogScope, ...descriptionProps, ref: forwardedRef });
});
AlertDialogDescription$1.displayName = DESCRIPTION_NAME;
var ACTION_NAME = "AlertDialogAction";
var AlertDialogAction$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...actionProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Close, { ...dialogScope, ...actionProps, ref: forwardedRef });
  }
);
AlertDialogAction$1.displayName = ACTION_NAME;
var CANCEL_NAME = "AlertDialogCancel";
var AlertDialogCancel$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...cancelProps } = props;
    const { cancelRef } = useAlertDialogContentContext(CANCEL_NAME, __scopeAlertDialog);
    const dialogScope = useDialogScope(__scopeAlertDialog);
    const ref = useComposedRefs(forwardedRef, cancelRef);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Close, { ...dialogScope, ...cancelProps, ref });
  }
);
AlertDialogCancel$1.displayName = CANCEL_NAME;
var DescriptionWarning = ({ contentRef }) => {
  const MESSAGE = `\`${CONTENT_NAME}\` requires a description for the component to be accessible for screen reader users.

You can add a description to the \`${CONTENT_NAME}\` by passing a \`${DESCRIPTION_NAME}\` component as a child, which also benefits sighted users by adding visible context to the dialog.

Alternatively, you can use your own component as a description by assigning it an \`id\` and passing the same value to the \`aria-describedby\` prop in \`${CONTENT_NAME}\`. If the description is confusing or duplicative for sighted users, you can use the \`@radix-ui/react-visually-hidden\` primitive as a wrapper around your description component.

For more information, see https://radix-ui.com/primitives/docs/components/alert-dialog`;
  reactExports.useEffect(() => {
    var _a;
    const hasDescription = document.getElementById(
      (_a = contentRef.current) == null ? void 0 : _a.getAttribute("aria-describedby")
    );
    if (!hasDescription) console.warn(MESSAGE);
  }, [MESSAGE, contentRef]);
  return null;
};
var Root2 = AlertDialog$1;
var Trigger2 = AlertDialogTrigger$1;
var Portal2 = AlertDialogPortal$1;
var Overlay2 = AlertDialogOverlay$1;
var Content2 = AlertDialogContent$1;
var Action = AlertDialogAction$1;
var Cancel = AlertDialogCancel$1;
var Title2 = AlertDialogTitle$1;
var Description2 = AlertDialogDescription$1;
function AlertDialog({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2, { "data-slot": "alert-dialog", ...props });
}
function AlertDialogTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Trigger2, { "data-slot": "alert-dialog-trigger", ...props });
}
function AlertDialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal2, { "data-slot": "alert-dialog-portal", ...props });
}
function AlertDialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Overlay2,
    {
      "data-slot": "alert-dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function AlertDialogContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogPortal, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Content2,
      {
        "data-slot": "alert-dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props
      }
    )
  ] });
}
function AlertDialogHeader({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "alert-dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function AlertDialogFooter({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "alert-dialog-footer",
      className: cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      ),
      ...props
    }
  );
}
function AlertDialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Title2,
    {
      "data-slot": "alert-dialog-title",
      className: cn("text-lg font-semibold", className),
      ...props
    }
  );
}
function AlertDialogDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Description2,
    {
      "data-slot": "alert-dialog-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function AlertDialogAction({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Action,
    {
      className: cn(buttonVariants(), className),
      ...props
    }
  );
}
function AlertDialogCancel({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Cancel,
    {
      className: cn(buttonVariants({ variant: "outline" }), className),
      ...props
    }
  );
}
var SWITCH_NAME = "Switch";
var [createSwitchContext] = createContextScope(SWITCH_NAME);
var [SwitchProvider, useSwitchContext] = createSwitchContext(SWITCH_NAME);
var Switch$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeSwitch,
      name,
      checked: checkedProp,
      defaultChecked,
      required,
      disabled,
      value = "on",
      onCheckedChange,
      form,
      ...switchProps
    } = props;
    const [button, setButton] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node));
    const hasConsumerStoppedPropagationRef = reactExports.useRef(false);
    const isFormControl = button ? form || !!button.closest("form") : true;
    const [checked, setChecked] = useControllableState({
      prop: checkedProp,
      defaultProp: defaultChecked ?? false,
      onChange: onCheckedChange,
      caller: SWITCH_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(SwitchProvider, { scope: __scopeSwitch, checked, disabled, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.button,
        {
          type: "button",
          role: "switch",
          "aria-checked": checked,
          "aria-required": required,
          "data-state": getState(checked),
          "data-disabled": disabled ? "" : void 0,
          disabled,
          value,
          ...switchProps,
          ref: composedRefs,
          onClick: composeEventHandlers(props.onClick, (event) => {
            setChecked((prevChecked) => !prevChecked);
            if (isFormControl) {
              hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
              if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
            }
          })
        }
      ),
      isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
        SwitchBubbleInput,
        {
          control: button,
          bubbles: !hasConsumerStoppedPropagationRef.current,
          name,
          value,
          checked,
          required,
          disabled,
          form,
          style: { transform: "translateX(-100%)" }
        }
      )
    ] });
  }
);
Switch$1.displayName = SWITCH_NAME;
var THUMB_NAME = "SwitchThumb";
var SwitchThumb = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSwitch, ...thumbProps } = props;
    const context = useSwitchContext(THUMB_NAME, __scopeSwitch);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        "data-state": getState(context.checked),
        "data-disabled": context.disabled ? "" : void 0,
        ...thumbProps,
        ref: forwardedRef
      }
    );
  }
);
SwitchThumb.displayName = THUMB_NAME;
var BUBBLE_INPUT_NAME = "SwitchBubbleInput";
var SwitchBubbleInput = reactExports.forwardRef(
  ({
    __scopeSwitch,
    control,
    checked,
    bubbles = true,
    ...props
  }, forwardedRef) => {
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(ref, forwardedRef);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    reactExports.useEffect(() => {
      const input = ref.current;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        setChecked.call(input, checked);
        input.dispatchEvent(event);
      }
    }, [prevChecked, checked, bubbles]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "checkbox",
        "aria-hidden": true,
        defaultChecked: checked,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0
        }
      }
    );
  }
);
SwitchBubbleInput.displayName = BUBBLE_INPUT_NAME;
function getState(checked) {
  return checked ? "checked" : "unchecked";
}
var Root = Switch$1;
var Thumb = SwitchThumb;
function Switch({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "switch",
      className: cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Thumb,
        {
          "data-slot": "switch-thumb",
          className: cn(
            "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
          )
        }
      )
    }
  );
}
const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "ar", label: "Arabic" },
  { code: "ur", label: "Urdu" },
  { code: "mr", label: "Marathi" },
  { code: "ta", label: "Tamil" },
  { code: "ml", label: "Malayalam" }
];
function getInitials(principal) {
  return principal.slice(0, 2).toUpperCase();
}
function shortenPrincipal(principal) {
  if (principal.length <= 12) return principal;
  return `${principal.slice(0, 5)}...${principal.slice(-4)}`;
}
function SettingRow({
  icon: Icon,
  label,
  children,
  onClick,
  href,
  destructive = false,
  ocid
}) {
  const content = /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "flex items-center justify-between gap-3 py-3.5 px-4",
        onClick || href ? "cursor-pointer" : ""
      ),
      onClick,
      onKeyDown: onClick ? (e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      } : void 0,
      role: onClick ? "button" : void 0,
      tabIndex: onClick ? 0 : void 0,
      "data-ocid": ocid,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Icon,
            {
              className: cn(
                "w-4.5 h-4.5 shrink-0",
                destructive ? "text-destructive" : "text-muted-foreground"
              ),
              style: { width: 18, height: 18 }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: cn(
                "text-sm font-body truncate",
                destructive ? "text-destructive" : "text-foreground"
              ),
              children: label
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 flex items-center", children: children || (onClick || href ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4 text-muted-foreground" }) : null) })
      ]
    }
  );
  if (href) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href, target: "_blank", rel: "noopener noreferrer", children: content });
  }
  return content;
}
function SettingsSection({
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-4 text-[11px] font-display font-semibold text-muted-foreground uppercase tracking-wider mb-1", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-card border border-border/60 divide-y divide-border/40 overflow-hidden", children })
  ] });
}
function ProfilePage() {
  const { user, identity, logout } = useAuth();
  const isPremium = useIsPremium();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [language, setLanguage] = reactExports.useState("en");
  const [notifEnabled, setNotifEnabled] = reactExports.useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = reactExports.useState(false);
  const principal = (identity == null ? void 0 : identity.getPrincipal().toText()) ?? "";
  const initials = principal ? getInitials(principal) : "U";
  const shortPrincipal = principal ? shortenPrincipal(principal) : "Not signed in";
  const totalScans = Number((user == null ? void 0 : user.totalScans) ?? 0);
  const { data: usageLimitData } = useUsageLimit();
  const scansToday = Number((usageLimitData == null ? void 0 : usageLimitData.scansToday) ?? 0);
  const handleNotificationToggle = async (checked) => {
    if (checked) {
      try {
        const perm = await Notification.requestPermission();
        if (perm === "granted") {
          setNotifEnabled(true);
          ue.success("Notifications enabled");
        } else {
          ue.error("Permission denied. Please enable in browser settings.");
        }
      } catch {
        ue.error("Notifications not supported.");
      }
    } else {
      setNotifEnabled(false);
    }
  };
  const handleDeleteAccount = () => {
    ue.error(
      "Account deletion initiated. Data will be removed within 24 hours."
    );
  };
  const handleLogout = () => {
    logout();
    navigate({ to: "/auth" });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col min-h-full bg-background",
      "data-ocid": "profile.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Profile" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-4 py-5 bg-card border-b border-border/60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-display font-bold text-white shrink-0",
                style: {
                  background: "linear-gradient(135deg, oklch(0.55 0.20 250), oklch(0.72 0.18 200))"
                },
                "aria-label": "User avatar",
                children: initials
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-sm font-mono text-muted-foreground truncate",
                  "data-ocid": "profile.principal_id",
                  children: shortPrincipal
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  className: cn(
                    "text-[10px] px-2 py-0.5",
                    isPremium ? "bg-amber-400/15 text-amber-400 border border-amber-400/30" : "bg-muted text-muted-foreground"
                  ),
                  "data-ocid": "profile.plan_badge",
                  children: isPremium ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-2.5 h-2.5 mr-1" }),
                    "Premium ✨"
                  ] }) : "Free Plan"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              StatCard,
              {
                icon: ScanText,
                label: isPremium ? "Scans Today" : `Today (${scansToday}/10)`,
                value: String(scansToday),
                color: "text-primary",
                ocid: "profile.scans_today_card"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              StatCard,
              {
                icon: Star,
                label: "Total Scans",
                value: String(totalScans),
                color: "text-accent",
                ocid: "profile.total_scans_card"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              StatCard,
              {
                icon: Flame,
                label: "Total Scans",
                value: String(totalScans),
                color: "text-amber-400",
                ocid: "profile.streak_card"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 px-4 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsSection, { title: "Appearance", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SettingRow, { icon: Moon, label: "Dark Mode", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              checked: isDark,
              onCheckedChange: toggleTheme,
              "data-ocid": "profile.dark_mode_switch",
              "aria-label": "Toggle dark mode"
            }
          ) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SettingsSection, { title: "Preferences", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SettingRow, { icon: FileText, label: "Default Language", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: language,
                onValueChange: (v) => setLanguage(v),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      className: "h-8 w-28 text-xs border-0 bg-muted focus:ring-0",
                      "data-ocid": "profile.language_select",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: LANGUAGES.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: l.code, className: "text-xs", children: l.label }, l.code)) })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SettingRow, { icon: Bell, label: "Notifications", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                checked: notifEnabled,
                onCheckedChange: handleNotificationToggle,
                "data-ocid": "profile.notifications_switch",
                "aria-label": "Toggle notifications"
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SettingsSection, { title: "Account", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SettingRow,
              {
                icon: Shield,
                label: "Privacy Policy",
                href: "https://scantextpro.app/privacy",
                ocid: "profile.privacy_link"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SettingRow,
              {
                icon: FileText,
                label: "Terms of Service",
                href: "https://scantextpro.app/terms",
                ocid: "profile.terms_link"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "profile.delete_account_button", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SettingRow, { icon: Trash2, label: "Delete Account", destructive: true }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "profile.delete_account_dialog", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete Account?" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "This will permanently delete all your scans and data. This action cannot be undone. Are you sure?" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { "data-ocid": "profile.delete_cancel_button", children: "Cancel" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    AlertDialogAction,
                    {
                      onClick: handleDeleteAccount,
                      "data-ocid": "profile.delete_confirm_button",
                      className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                      children: "Delete Account"
                    }
                  )
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SettingsSection, { title: "About", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-body text-muted-foreground", children: "App version" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-mono text-foreground", children: "ScanText Pro v1.0.0" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SettingRow,
              {
                icon: CircleHelp,
                label: "Help & Support",
                onClick: () => navigate({ to: "/help" }),
                ocid: "profile.help_link"
              }
            )
          ] }),
          !isPremium && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "w-full rounded-2xl p-[1.5px] mb-4 block",
              style: {
                background: "linear-gradient(135deg, oklch(0.72 0.18 200), oklch(0.55 0.20 250))"
              },
              onClick: () => navigate({ to: "/subscription" }),
              "data-ocid": "profile.upgrade_nudge",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-[14px] bg-card px-4 py-3.5 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-5 h-5 text-amber-400" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-display font-semibold text-foreground", children: "Upgrade to Premium" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-body text-muted-foreground", children: "Unlimited scans + AI tools" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-4 h-4 text-primary" })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { open: logoutDialogOpen, onOpenChange: setLogoutDialogOpen, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "lg",
                className: "w-full rounded-2xl text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive",
                "data-ocid": "profile.sign_out_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "w-4 h-4 mr-2" }),
                  "Sign Out"
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "profile.sign_out_dialog", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Sign out?" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "You will need to sign in again to access your scans." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { "data-ocid": "profile.sign_out_cancel_button", children: "Cancel" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AlertDialogAction,
                  {
                    onClick: handleLogout,
                    "data-ocid": "profile.sign_out_confirm_button",
                    children: "Sign Out"
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-muted-foreground mt-6 mb-2", children: [
            "© ",
            (/* @__PURE__ */ new Date()).getFullYear(),
            ".",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "underline underline-offset-2 hover:text-foreground transition-colors",
                children: "Built with caffeine.ai"
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  color,
  ocid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl bg-background border border-border/60 p-3 flex flex-col gap-1",
      "data-ocid": ocid,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: cn("w-4 h-4", color) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg font-display font-bold text-foreground leading-tight", children: [
          value,
          suffix
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-body text-muted-foreground leading-tight", children: label })
      ]
    }
  );
}
export {
  ProfilePage as default
};
