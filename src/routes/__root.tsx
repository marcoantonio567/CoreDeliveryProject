import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import { AuthProvider, useAuth } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ConstruirJuntos — Voluntariado e Doações para Moradia" },
      { name: "description", content: "Plataforma que conecta voluntários, doadores e comunidades para melhorias habitacionais." },
      { property: "og:title", content: "ConstruirJuntos — Voluntariado e Doações para Moradia" },
      { property: "og:description", content: "Plataforma que conecta voluntários, doadores e comunidades para melhorias habitacionais." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "ConstruirJuntos — Voluntariado e Doações para Moradia" },
      { name: "twitter:description", content: "Plataforma que conecta voluntários, doadores e comunidades para melhorias habitacionais." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/02f0020a-f9ff-4305-aa4b-8d98acbebfc5/id-preview-60d572b1--6c9e1e21-4742-41da-a054-df9dfeb037ad.lovable.app-1778686854725.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/02f0020a-f9ff-4305-aa4b-8d98acbebfc5/id-preview-60d572b1--6c9e1e21-4742-41da-a054-df9dfeb037ad.lovable.app-1778686854725.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const publicPaths = ["/", "/login", "/signup", "/forgot-password", "/reset-password"];
  const isPublicPath = publicPaths.includes(location.pathname);

  useEffect(() => {
    if (!loading) {
      if (!user && !isPublicPath) {
        navigate({ to: "/login" });
      } else if (user && (location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/")) {
        navigate({ to: "/dashboard" });
      }
    }
  }, [user, loading, isPublicPath, navigate, location.pathname]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user && !isPublicPath) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useLocation();
  const hideSidebar = ["/", "/login", "/signup", "/forgot-password", "/reset-password"].includes(
    location.pathname,
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthGuard>
          <SidebarProvider defaultOpen={!hideSidebar}>
            {!hideSidebar && <AppSidebar />}
            <SidebarInset className="min-w-0">
              <Outlet />
            </SidebarInset>
          </SidebarProvider>
          <Toaster />
        </AuthGuard>
      </AuthProvider>
    </QueryClientProvider>
  );
}
