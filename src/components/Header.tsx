import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { HardHat, LogOut, Shield, User as UserIcon } from "lucide-react";

export function Header() {
  const { user, isAdmin, signOut } = useAuth();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground">
            <HardHat className="h-5 w-5" />
          </span>
          <span>ConstruirJuntos</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/projects" className="text-muted-foreground hover:text-foreground">Projetos</Link>
          <Link to="/materials" className="text-muted-foreground hover:text-foreground">Materiais</Link>
          {isAdmin && <Link to="/admin" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1"><Shield className="h-4 w-4" /> Admin</Link>}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button variant="ghost" size="sm" asChild><Link to="/profile"><UserIcon className="h-4 w-4 mr-1" />Perfil</Link></Button>
              <Button variant="ghost" size="sm" onClick={signOut}><LogOut className="h-4 w-4" /></Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild><Link to="/login">Entrar</Link></Button>
              <Button size="sm" asChild><Link to="/signup">Cadastrar</Link></Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
