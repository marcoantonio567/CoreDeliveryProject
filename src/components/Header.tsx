import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LogOut, User as UserIcon } from "lucide-react";

export function Header() {
  const { user, signOut } = useAuth();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="flex h-14 items-center justify-between gap-2 px-4">
        <SidebarTrigger />
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
