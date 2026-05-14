import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Hammer, Package, FolderKanban, Boxes, User as UserIcon, Shield, HardHat } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth";

export function AppSidebar() {
  const { user, isAdmin } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const path = useRouterState({ select: (r) => r.location.pathname });
  const active = (p: string) => path === p || path.startsWith(p + "/");

  const main = [
    { title: "Início", url: "/", icon: Home },
    { title: "Projetos", url: "/projects", icon: Hammer },
    { title: "Materiais", url: "/materials", icon: Package },
  ];
  const mine = [
    { title: "Meus projetos", url: "/my-projects", icon: FolderKanban },
    { title: "Meus materiais", url: "/my-materials", icon: Boxes },
    { title: "Perfil", url: "/profile", icon: UserIcon },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link to="/" className="flex items-center gap-2 px-2 py-1.5">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground shrink-0">
            <HardHat className="h-4 w-4" />
          </span>
          {!collapsed && <span className="font-semibold">ConstruirJuntos</span>}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegar</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {main.map((i) => (
                <SidebarMenuItem key={i.url}>
                  <SidebarMenuButton asChild isActive={active(i.url)} tooltip={i.title}>
                    <Link to={i.url}><i.icon /><span>{i.title}</span></Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {user && (
          <SidebarGroup>
            <SidebarGroupLabel>Minha área</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mine.map((i) => (
                  <SidebarMenuItem key={i.url}>
                    <SidebarMenuButton asChild isActive={active(i.url)} tooltip={i.title}>
                      <Link to={i.url}><i.icon /><span>{i.title}</span></Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={active("/admin")} tooltip="Painel Admin">
                    <Link to="/admin"><Shield /><span>Painel</span></Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
