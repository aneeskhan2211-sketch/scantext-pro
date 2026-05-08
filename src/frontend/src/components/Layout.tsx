import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import { Camera, Clock, Home, Sparkles, User } from "lucide-react";

const HIDDEN_NAV_PATHS = ["/", "/splash", "/onboarding", "/auth"];

const NAV_ITEMS = [
  { id: "home", label: "Home", path: "/home", Icon: Home },
  { id: "scan", label: "Scan", path: "/scan", Icon: Camera },
  { id: "history", label: "History", path: "/history", Icon: Clock },
  { id: "tools", label: "Tools", path: "/tools", Icon: Sparkles },
  { id: "profile", label: "Profile", path: "/profile", Icon: User },
] as const;

interface LayoutProps {
  children: React.ReactNode;
  /** Pass to suppress the bottom nav on specific pages */
  hideNav?: boolean;
}

export function Layout({ children, hideNav }: LayoutProps) {
  const { pathname } = useLocation();
  const shouldHideNav = hideNav ?? HIDDEN_NAV_PATHS.includes(pathname);

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div
        className="relative flex flex-col w-full max-w-[430px] min-h-screen bg-background"
        style={{ isolation: "isolate" }}
      >
        {/* Page content */}
        <main
          className={cn(
            "flex-1 flex flex-col overflow-y-auto",
            !shouldHideNav && "pb-[72px]",
          )}
        >
          {children}
        </main>

        {/* Bottom navigation */}
        {!shouldHideNav && (
          <nav
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-card border-t border-border/60"
            style={{
              paddingBottom: "env(safe-area-inset-bottom, 0px)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              background: "oklch(var(--card) / 0.92)",
            }}
            aria-label="Main navigation"
          >
            <div className="flex items-stretch h-[60px]">
              {NAV_ITEMS.map(({ id, label, path, Icon }) => {
                const isActive =
                  pathname === path ||
                  (path !== "/home" && pathname.startsWith(path));

                return (
                  <Link
                    key={id}
                    to={path}
                    data-ocid={`nav.${id}_tab`}
                    className={cn(
                      "flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-none",
                      isActive
                        ? "text-accent"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {/* Scan button gets special treatment */}
                    {id === "scan" ? (
                      <span
                        className={cn(
                          "flex items-center justify-center w-12 h-12 rounded-full -mt-5 shadow-elevated transition-all duration-200",
                          isActive
                            ? "bg-accent text-accent-foreground scale-110"
                            : "bg-primary text-primary-foreground",
                        )}
                      >
                        <Icon className="w-5 h-5" />
                      </span>
                    ) : (
                      <>
                        <Icon
                          className="w-5 h-5"
                          strokeWidth={isActive ? 2.5 : 1.8}
                        />
                        <span className="text-[10px] font-body font-medium">
                          {label}
                        </span>
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}
