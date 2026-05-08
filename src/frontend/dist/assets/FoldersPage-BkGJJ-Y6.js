import { c as createLucideIcon, i as useQueryClient, u as useNavigate, r as reactExports, j as jsxRuntimeExports, d as cn, S as SkeletonCard, b as ue } from "./index-CLbxCJ0J.js";
import { E as EmptyState } from "./EmptyState-CubEIkxw.js";
import { B as Button } from "./button-BO8a7v6H.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-CAg59FlY.js";
import { I as Input } from "./input-uhtvcpMH.js";
import { createActor } from "./backend-C1iwlURu.js";
import { u as useActor, a as useQuery } from "./useActor-MzWlzUvO.js";
import { u as useMutation } from "./useMutation-B_xqqUfL.js";
import { F as FolderOpen } from "./folder-open-CbOlBw_Z.js";
import { R as Receipt } from "./receipt-CkmodHNU.js";
import { C as CreditCard } from "./credit-card-DCPn-U5z.js";
import { B as BookOpen } from "./book-open-Y9GOukyA.js";
import { f as formatDistanceToNow } from "./formatDistanceToNow-BI0ppbMU.js";
import { T as Trash2 } from "./trash-2-ylQv7UWx.js";
import "./index-D5ioHTv5.js";
import "./index-CYXnM25L.js";
import "./index-xugKHP5J.js";
import "./index-BlW7uNs2.js";
import "./x-BZQsBvo_.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  ["path", { d: "M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16", key: "jecpp" }],
  ["rect", { width: "20", height: "14", x: "2", y: "6", rx: "2", key: "i6l2r4" }]
];
const Briefcase = createLucideIcon("briefcase", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z", key: "1b4qmf" }],
  ["path", { d: "M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2", key: "i71pzd" }],
  ["path", { d: "M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2", key: "10jefs" }],
  ["path", { d: "M10 6h4", key: "1itunk" }],
  ["path", { d: "M10 10h4", key: "tcdvrf" }],
  ["path", { d: "M10 14h4", key: "kelpxr" }],
  ["path", { d: "M10 18h4", key: "1ulq68" }]
];
const Building2 = createLucideIcon("building-2", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M12 10v6", key: "1bos4e" }],
  ["path", { d: "M9 13h6", key: "1uhe8q" }],
  [
    "path",
    {
      d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
      key: "1kt360"
    }
  ]
];
const FolderPlus = createLucideIcon("folder-plus", __iconNode$3);
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
      d: "M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z",
      key: "j76jl0"
    }
  ],
  ["path", { d: "M22 10v6", key: "1lu8f3" }],
  ["path", { d: "M6 12.5V16a6 3 0 0 0 12 0v-3.5", key: "1r8lef" }]
];
const GraduationCap = createLucideIcon("graduation-cap", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "7", height: "7", x: "3", y: "3", rx: "1", key: "1g98yp" }],
  ["rect", { width: "7", height: "7", x: "14", y: "3", rx: "1", key: "6d4xhi" }],
  ["rect", { width: "7", height: "7", x: "14", y: "14", rx: "1", key: "nxv5o0" }],
  ["rect", { width: "7", height: "7", x: "3", y: "14", rx: "1", key: "1bb6yr" }]
];
const LayoutGrid = createLucideIcon("layout-grid", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
const Plus = createLucideIcon("plus", __iconNode);
const FOLDER_KEYS = {
  all: ["folders"]
};
function useListFolders() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: FOLDER_KEYS.all,
    queryFn: async () => {
      if (!actor) return [];
      return actor.listFolders();
    },
    enabled: !!actor && !isFetching,
    staleTime: 6e4
  });
}
function useCreateFolder() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createFolder(args);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: FOLDER_KEYS.all });
    }
  });
}
function useDeleteFolder() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deleteFolder(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: FOLDER_KEYS.all });
    }
  });
}
const TEMPLATE_FOLDERS = [
  {
    id: "all",
    label: "All Scans",
    emoji: "🗂️",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { className: "w-4 h-4" })
  },
  {
    id: "study",
    label: "Study Notes",
    emoji: "📚",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "w-4 h-4" })
  },
  {
    id: "receipts",
    label: "Receipts",
    emoji: "🧾",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "w-4 h-4" })
  },
  {
    id: "office",
    label: "Office Docs",
    emoji: "💼",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "w-4 h-4" })
  },
  {
    id: "id_cards",
    label: "ID Cards",
    emoji: "🪪",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-4 h-4" })
  },
  {
    id: "books",
    label: "Books",
    emoji: "📖",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-4 h-4" })
  },
  {
    id: "business",
    label: "Business Cards",
    emoji: "💳",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "w-4 h-4" })
  }
];
const FOLDER_EMOJIS = [
  "📁",
  "📂",
  "🗂️",
  "📚",
  "💼",
  "🧾",
  "🪪",
  "📝",
  "🔖",
  "📌",
  "🗃️",
  "🗄️"
];
const FOLDER_COLORS = [
  "from-primary/20 to-primary/5 border-primary/20",
  "from-accent/20 to-accent/5 border-accent/20",
  "from-purple-500/20 to-purple-500/5 border-purple-500/20",
  "from-rose-500/20 to-rose-500/5 border-rose-500/20",
  "from-amber-500/20 to-amber-500/5 border-amber-500/20",
  "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20"
];
function getFolderColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return FOLDER_COLORS[Math.abs(hash) % FOLDER_COLORS.length];
}
function FolderCard({ folder, index, onDelete }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = reactExports.useState(false);
  const colorClass = getFolderColor(folder.name);
  const createdAt = folder.createdAt ? Number(folder.createdAt) / 1e6 : Date.now();
  const dateStr = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      "data-ocid": `folders.item.${index}`,
      className: cn(
        "relative rounded-2xl bg-gradient-to-br border p-4 flex flex-col gap-3 cursor-pointer active:scale-[0.97] transition-all duration-150 shadow-sm text-left w-full",
        colorClass
      ),
      onClick: () => navigate({ to: "/history" }),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl leading-none", children: folder.icon ?? "📁" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": `folders.menu.${index}`,
              className: "w-7 h-7 flex items-center justify-center rounded-lg bg-background/30 hover:bg-background/50 transition-colors",
              onClick: (e) => {
                e.stopPropagation();
                setMenuOpen((v) => !v);
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-base leading-none", children: "\\u22EF" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-display font-semibold text-foreground truncate", children: folder.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground font-body mt-0.5", children: dateStr })
        ] }),
        menuOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute top-10 right-3 z-30 bg-card border border-border/60 rounded-xl shadow-lg overflow-hidden min-w-[140px]",
            role: "menu",
            onClick: (e) => e.stopPropagation(),
            onKeyDown: (e) => e.stopPropagation(),
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": `folders.delete_button.${index}`,
                className: "w-full flex items-center gap-2.5 px-4 py-3 text-sm font-body text-destructive hover:bg-destructive/10 transition-colors",
                onClick: () => {
                  setMenuOpen(false);
                  onDelete(folder.id, folder.name);
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }),
                  " Delete"
                ]
              }
            )
          }
        )
      ]
    }
  );
}
function CreateFolderDialog({
  open,
  onClose
}) {
  const [name, setName] = reactExports.useState("");
  const [selectedEmoji, setSelectedEmoji] = reactExports.useState("📁");
  const createFolder = useCreateFolder();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    createFolder.mutate(
      { name: name.trim(), icon: selectedEmoji },
      {
        onSuccess: () => {
          ue.success(`Folder "${name.trim()}" created`);
          setName("");
          setSelectedEmoji("📁");
          onClose();
        },
        onError: () => ue.error("Failed to create folder")
      }
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-sm rounded-2xl font-body",
      "data-ocid": "folders.create_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-lg", children: "New Folder" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "folder-name-input",
                className: "text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider",
                children: "Folder Name"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "folder-name-input",
                "data-ocid": "folders.name_input",
                value: name,
                onChange: (e) => setName(e.target.value),
                placeholder: "e.g. Medical Records",
                className: "rounded-xl font-body",
                autoFocus: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "folder-icon-picker",
                className: "text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider",
                children: "Icon"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "folder-icon-picker", className: "grid grid-cols-6 gap-2", children: FOLDER_EMOJIS.map((emoji) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "folders.emoji_picker",
                className: cn(
                  "w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all",
                  selectedEmoji === emoji ? "bg-primary/20 border-2 border-primary/50 scale-110" : "bg-muted/60 hover:bg-muted border-2 border-transparent"
                ),
                onClick: () => setSelectedEmoji(emoji),
                children: emoji
              },
              emoji
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 flex-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                className: "flex-1 rounded-xl font-body",
                "data-ocid": "folders.cancel_button",
                onClick: onClose,
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                className: "flex-1 rounded-xl font-body",
                "data-ocid": "folders.create_submit_button",
                disabled: !name.trim() || createFolder.isPending,
                children: createFolder.isPending ? "Creating…" : "Create"
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
function FoldersPage() {
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = reactExports.useState(false);
  const [activeTemplate, setActiveTemplate] = reactExports.useState("all");
  const { data: folders, isLoading } = useListFolders();
  const deleteFolder = useDeleteFolder();
  const handleDelete = (id, name) => {
    deleteFolder.mutate(id, {
      onSuccess: () => ue.success(`"${name}" deleted`),
      onError: () => ue.error("Failed to delete folder")
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-h-screen bg-background pb-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 z-20 bg-card/95 backdrop-blur-md border-b border-border/60 px-4 pt-12 pb-3 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-bold text-foreground tracking-tight", children: "Folders" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            size: "sm",
            className: "gap-1.5 rounded-xl font-body text-sm",
            "data-ocid": "folders.create_button",
            onClick: () => setCreateOpen(true),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
              " New"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1", children: TEMPLATE_FOLDERS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          "data-ocid": `folders.template.${t.id}`,
          className: cn(
            "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-medium transition-all duration-200",
            activeTemplate === t.id ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted/60 text-muted-foreground hover:bg-muted"
          ),
          onClick: () => {
            setActiveTemplate(t.id);
            navigate({ to: "/history" });
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t.emoji }),
            t.label
          ]
        },
        t.id
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: Array.from({ length: 4 }).map((_, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
      /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonCard, { lines: 2 }, i)
    )) }) : !folders || folders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        "data-ocid": "folders.empty_state",
        icon: FolderOpen,
        title: "No folders yet",
        description: "Create a folder to organize your scans by topic or type",
        ctaLabel: "Create Folder",
        onCta: () => setCreateOpen(true)
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-body text-muted-foreground mb-3", children: [
        folders.length,
        " folder",
        folders.length !== 1 ? "s" : ""
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        folders.map((folder, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          FolderCard,
          {
            folder,
            index: idx + 1,
            onDelete: handleDelete
          },
          folder.id
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": "folders.add_tile",
            className: "rounded-2xl border-2 border-dashed border-border/60 flex flex-col items-center justify-center gap-2 py-6 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 text-muted-foreground hover:text-primary",
            onClick: () => setCreateOpen(true),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FolderPlus, { className: "w-6 h-6", strokeWidth: 1.5 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-body", children: "New Folder" })
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      CreateFolderDialog,
      {
        open: createOpen,
        onClose: () => setCreateOpen(false)
      }
    )
  ] });
}
export {
  FoldersPage as default
};
