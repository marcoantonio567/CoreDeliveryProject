import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/auth";
import {
  Award,
  BarChart3,
  Calendar,
  CheckCircle2,
  HandHeart,
  LayoutDashboard,
  Package,
  Plus,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({ component: UserDashboard });

function UserDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    myProjects: 0,
    supportedProjects: 0,
    donationsCount: 0,
    volunteerRequests: 0,
    certificatesCount: 0,
  });
  const [activeProjects, setActiveProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      try {
        const [
          { count: myP },
          { data: volReqs },
          { count: dons },
          { count: certs },
          { data: myActiveP },
        ] = await Promise.all([
          supabase.from("projects").select("*", { count: "exact", head: true }).eq("owner_id", user.id),
          supabase.from("volunteer_requests").select("project_id").eq("user_id", user.id),
          supabase.from("donations").select("*", { count: "exact", head: true }).eq("user_id", user.id),
          supabase.from("certificates").select("*", { count: "exact", head: true }).eq("user_id", user.id),
          supabase.from("projects").select("*").eq("owner_id", user.id).eq("status", "approved").eq("completion_status", "in_progress"),
        ]);

        const supportedIds = new Set((volReqs || []).map((r) => r.project_id));

        setStats({
          myProjects: myP || 0,
          supportedProjects: supportedIds.size,
          donationsCount: dons || 0,
          volunteerRequests: (volReqs || []).length,
          certificatesCount: certs || 0,
        });
        setActiveProjects(myActiveP || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (!user)
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 grid place-items-center">
          <p>Faça login para ver seu dashboard.</p>
        </main>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <LayoutDashboard className="h-8 w-8 text-primary" /> Meu Painel
            </h1>
            <p className="text-muted-foreground mt-1">Bem-vindo(a) de volta ao ConstruirJuntos.</p>
          </div>
          <Button asChild>
            <Link to="/projects/new">
              <Plus className="h-4 w-4 mr-1" /> Novo Projeto
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Meus Projetos</p>
            <p className="text-3xl font-bold mt-1">{stats.myProjects}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Apoiados</p>
            <p className="text-3xl font-bold mt-1">{stats.supportedProjects}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Doações</p>
            <p className="text-3xl font-bold mt-1">{stats.donationsCount}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Voluntariado</p>
            <p className="text-3xl font-bold mt-1">{stats.volunteerRequests}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 bg-primary/5 border-primary/20">
            <p className="text-xs text-primary uppercase font-bold tracking-wider">Certificados</p>
            <p className="text-3xl font-bold mt-1 text-primary">{stats.certificatesCount}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <BarChart3 className="h-5 w-5" /> Projetos em Andamento
            </h2>
            {activeProjects.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-border p-10 text-center">
                <p className="text-muted-foreground">Você não tem projetos ativos no momento.</p>
                <Button asChild variant="outline" className="mt-4">
                  <Link to="/projects/new">Começar um projeto</Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {activeProjects.map((p) => (
                  <Link
                    key={p.id}
                    to="/projects/$id"
                    params={{ id: p.id }}
                    className="group rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                          {p.name}
                        </h3>
                        <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> Criado em {new Date(p.created_at).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <Badge variant="outline">{p.urgency}</Badge>
                    </div>
                    {p.financial_goal > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Progresso financeiro</span>
                          <span className="font-medium">R$ {p.financial_goal}</span>
                        </div>
                        <Progress value={30} className="h-2" />
                      </div>
                    )}
                    <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <HandHeart className="h-3 w-3" /> Ver solicitações
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" /> Ver necessidades
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Award className="h-5 w-5 text-accent" /> Conquistas
            </h2>
            <div className="rounded-xl border border-border bg-card p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <Award className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="font-bold">Impacto Social</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Você já participou de {stats.supportedProjects} projetos da comunidade.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold">Doador Ativo</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Total de {stats.donationsCount} doações realizadas para projetos.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="font-bold">Voluntário Certificado</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Possui {stats.certificatesCount} certificados de conclusão de obra.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-primary/10 border border-primary/20 p-6">
              <h4 className="font-bold text-primary flex items-center gap-2 mb-2">
                <Package className="h-4 w-4" /> Doe Materiais
              </h4>
              <p className="text-xs text-primary/80 leading-relaxed mb-4">
                Tem sobras de construção em casa? Cadastre e ajude alguém a terminar sua obra.
              </p>
              <Button asChild size="sm" className="w-full">
                <Link to="/materials/new">Cadastrar Material</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Badge({ children, variant = "default", className = "" }: any) {
  const styles = {
    default: "bg-primary text-primary-foreground",
    outline: "border border-border text-muted-foreground",
    secondary: "bg-secondary text-secondary-foreground",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[variant as keyof typeof styles]} ${className}`}>
      {children}
    </span>
  );
}
