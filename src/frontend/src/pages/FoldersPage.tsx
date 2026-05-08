import { EmptyState } from "@/components/EmptyState";
import { SkeletonCard } from "@/components/SkeletonCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  useCreateFolder,
  useDeleteFolder,
  useListFolders,
} from "@/hooks/useFolders";
import { cn } from "@/lib/utils";
import type { FolderView } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import {
  BookOpen,
  Briefcase,
  Building2,
  CreditCard,
  FolderOpen,
  FolderPlus,
  GraduationCap,
  LayoutGrid,
  Plus,
  Receipt,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const TEMPLATE_FOLDERS: {
  id: string;
  label: string;
  emoji: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "all",
    label: "All Scans",
    emoji: "🗂️",
    icon: <LayoutGrid className="w-4 h-4" />,
  },
  {
    id: "study",
    label: "Study Notes",
    emoji: "📚",
    icon: <GraduationCap className="w-4 h-4" />,
  },
  {
    id: "receipts",
    label: "Receipts",
    emoji: "🧾",
    icon: <Receipt className="w-4 h-4" />,
  },
  {
    id: "office",
    label: "Office Docs",
    emoji: "💼",
    icon: <Briefcase className="w-4 h-4" />,
  },
  {
    id: "id_cards",
    label: "ID Cards",
    emoji: "🪪",
    icon: <CreditCard className="w-4 h-4" />,
  },
  {
    id: "books",
    label: "Books",
    emoji: "📖",
    icon: <BookOpen className="w-4 h-4" />,
  },
  {
    id: "business",
    label: "Business Cards",
    emoji: "💳",
    icon: <Building2 className="w-4 h-4" />,
  },
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
  "🗄️",
];

const FOLDER_COLORS = [
  "from-primary/20 to-primary/5 border-primary/20",
  "from-accent/20 to-accent/5 border-accent/20",
  "from-purple-500/20 to-purple-500/5 border-purple-500/20",
  "from-rose-500/20 to-rose-500/5 border-rose-500/20",
  "from-amber-500/20 to-amber-500/5 border-amber-500/20",
  "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20",
];

function getFolderColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return FOLDER_COLORS[Math.abs(hash) % FOLDER_COLORS.length];
}

interface FolderCardProps {
  folder: FolderView;
  index: number;
  onDelete: (id: string, name: string) => void;
}

function FolderCard({ folder, index, onDelete }: FolderCardProps) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const colorClass = getFolderColor(folder.name);
  const createdAt = folder.createdAt
    ? Number(folder.createdAt) / 1_000_000
    : Date.now();
  const dateStr = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  return (
    <button
      type="button"
      data-ocid={`folders.item.${index}`}
      className={cn(
        "relative rounded-2xl bg-gradient-to-br border p-4 flex flex-col gap-3 cursor-pointer active:scale-[0.97] transition-all duration-150 shadow-sm text-left w-full",
        colorClass,
      )}
      onClick={() => navigate({ to: "/history" })}
    >
      <div className="flex items-start justify-between">
        <div className="text-2xl leading-none">
          {folder.icon ?? "\uD83D\uDCC1"}
        </div>
        <button
          type="button"
          data-ocid={`folders.menu.${index}`}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-background/30 hover:bg-background/50 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((v) => !v);
          }}
        >
          <span className="text-muted-foreground text-base leading-none">
            \u22EF
          </span>
        </button>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-display font-semibold text-foreground truncate">
          {folder.name}
        </p>
        <p className="text-[10px] text-muted-foreground font-body mt-0.5">
          {dateStr}
        </p>
      </div>

      {/* Dropdown */}
      {menuOpen && (
        <div
          className="absolute top-10 right-3 z-30 bg-card border border-border/60 rounded-xl shadow-lg overflow-hidden min-w-[140px]"
          role="menu"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            data-ocid={`folders.delete_button.${index}`}
            className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-body text-destructive hover:bg-destructive/10 transition-colors"
            onClick={() => {
              setMenuOpen(false);
              onDelete(folder.id, folder.name);
            }}
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      )}
    </button>
  );
}

function CreateFolderDialog({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("📁");
  const createFolder = useCreateFolder();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createFolder.mutate(
      { name: name.trim(), icon: selectedEmoji },
      {
        onSuccess: () => {
          toast.success(`Folder "${name.trim()}" created`);
          setName("");
          setSelectedEmoji("📁");
          onClose();
        },
        onError: () => toast.error("Failed to create folder"),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-sm rounded-2xl font-body"
        data-ocid="folders.create_dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-lg">New Folder</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="folder-name-input"
              className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider"
            >
              Folder Name
            </label>
            <Input
              id="folder-name-input"
              data-ocid="folders.name_input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Medical Records"
              className="rounded-xl font-body"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="folder-icon-picker"
              className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider"
            >
              Icon
            </label>
            <div id="folder-icon-picker" className="grid grid-cols-6 gap-2">
              {FOLDER_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  data-ocid="folders.emoji_picker"
                  className={cn(
                    "w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all",
                    selectedEmoji === emoji
                      ? "bg-primary/20 border-2 border-primary/50 scale-110"
                      : "bg-muted/60 hover:bg-muted border-2 border-transparent",
                  )}
                  onClick={() => setSelectedEmoji(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          <DialogFooter className="gap-2 flex-row">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-xl font-body"
              data-ocid="folders.cancel_button"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-xl font-body"
              data-ocid="folders.create_submit_button"
              disabled={!name.trim() || createFolder.isPending}
            >
              {createFolder.isPending ? "Creating…" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function FoldersPage() {
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState("all");
  const { data: folders, isLoading } = useListFolders();
  const deleteFolder = useDeleteFolder();

  const handleDelete = (id: string, name: string) => {
    deleteFolder.mutate(id, {
      onSuccess: () => toast.success(`"${name}" deleted`),
      onError: () => toast.error("Failed to delete folder"),
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-card/95 backdrop-blur-md border-b border-border/60 px-4 pt-12 pb-3 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-display font-bold text-foreground tracking-tight">
            Folders
          </h1>
          <Button
            type="button"
            size="sm"
            className="gap-1.5 rounded-xl font-body text-sm"
            data-ocid="folders.create_button"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="w-4 h-4" /> New
          </Button>
        </div>

        {/* Template chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
          {TEMPLATE_FOLDERS.map((t) => (
            <button
              key={t.id}
              type="button"
              data-ocid={`folders.template.${t.id}`}
              className={cn(
                "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-medium transition-all duration-200",
                activeTemplate === t.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted",
              )}
              onClick={() => {
                setActiveTemplate(t.id);
                navigate({ to: "/history" });
              }}
            >
              <span>{t.emoji}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="p-4">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
              <SkeletonCard key={i} lines={2} />
            ))}
          </div>
        ) : !folders || folders.length === 0 ? (
          <EmptyState
            data-ocid="folders.empty_state"
            icon={FolderOpen}
            title="No folders yet"
            description="Create a folder to organize your scans by topic or type"
            ctaLabel="Create Folder"
            onCta={() => setCreateOpen(true)}
          />
        ) : (
          <>
            <p className="text-xs font-body text-muted-foreground mb-3">
              {folders.length} folder{folders.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {folders.map((folder, idx) => (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  index={idx + 1}
                  onDelete={handleDelete}
                />
              ))}
              {/* Add new tile */}
              <button
                type="button"
                data-ocid="folders.add_tile"
                className="rounded-2xl border-2 border-dashed border-border/60 flex flex-col items-center justify-center gap-2 py-6 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 text-muted-foreground hover:text-primary"
                onClick={() => setCreateOpen(true)}
              >
                <FolderPlus className="w-6 h-6" strokeWidth={1.5} />
                <span className="text-xs font-body">New Folder</span>
              </button>
            </div>
          </>
        )}
      </div>

      <CreateFolderDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  );
}
