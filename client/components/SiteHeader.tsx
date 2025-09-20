import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function SiteHeader() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid size-8 place-items-center rounded-full bg-black text-white font-bold">💬</div>
          <span className="text-lg font-semibold tracking-tight">InterviewEcho</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link
            to="/"
            className={cn(
              "hidden rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground md:block",
              location.pathname === "/" && "text-foreground",
            )}
          >
            Главная
          </Link>
          <Link
            to="/dashboard"
            className={cn(
              "hidden rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground md:block",
              isDashboard && "text-foreground",
            )}
          >
            Дашборд
          </Link>
          <Button asChild className="rounded-full bg-black px-4 text-white hover:bg-black/90">
            <Link to={isDashboard ? "/" : "/dashboard"}>
              {isDashboard ? "Новая вакансия ✍️" : "Перейти в дашборд →"}
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
