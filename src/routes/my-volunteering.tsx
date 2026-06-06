import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { Loader2, HandHeart, Trash2, MapPin, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/my-volunteering")({ component: MyVolunteering });

function MyVolunteering() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("volunteer_requests")
        .select(`
          *,
          projects (
            id,
            name,
            location,
            improvement_type,
            images
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (err: any) {
      toast.error("Erro ao carregar candidaturas: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [user]);

  const cancel = async (id: string) => {
    if (!confirm("Tem certeza que deseja cancelar sua candidatura de voluntário?")) return;
    const { error } = await supabase.from("volunteer_requests").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Candidatura cancelada");
    load();
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "Aprovada":
        return <Badge className="bg-green-500 hover:bg-green-600 gap-1"><CheckCircle2 className="h-3 w-3" /> Aprovada</Badge>;
      case "Recusada":
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Recusada</Badge>;
      default:
        return <Badge variant="secondary" className="gap-1"><AlertCircle className="h-3 w-3" /> Pendente</Badge>;
    }
  };

  if (!user)
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 grid place-items-center">
          <p>Faça login para ver suas candidaturas.</p>
        </main>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-primary/10 p-2 rounded-lg text-primary">
            <HandHeart className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold">Minhas Candidaturas</h1>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <p>Carregando suas candidaturas...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border-2 border-dashed border-border bg-muted/20">
            <HandHeart className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground text-lg">Você ainda não se candidatou a nenhum projeto.</p>
            <Button asChild className="mt-4" variant="outline">
              <Link to="/projects">Ver Projetos Precisando de Ajuda</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {applications.map((v) => (
              <div key={v.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden border border-border bg-muted/30 flex items-center justify-center shrink-0">
                    {v.projects?.images?.[0] ? (
                      <img src={v.projects.images[0]} alt="" className="max-w-full max-h-full object-contain" />
                    ) : (
                      <HandHeart className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                      <Link 
                        to="/projects/$id" 
                        params={{ id: v.project_id }} 
                        className="text-xl font-bold hover:text-primary transition-colors"
                      >
                        {v.projects?.name || "Projeto não disponível"}
                      </Link>
                      {getStatusBadge(v.status)}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" /> {v.projects?.location}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" /> Inscrito em {new Date(v.created_at).toLocaleDateString("pt-BR")}
                      </div>
                      <div className="flex items-center gap-1.5 sm:col-span-2">
                        <Badge variant="outline" className="text-[10px] uppercase font-bold px-1.5 py-0">
                          {v.projects?.improvement_type}
                        </Badge>
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-3 text-sm text-foreground/80 mb-4">
                      <p className="font-semibold text-[10px] uppercase text-muted-foreground mb-1">Sua Mensagem / Habilidades:</p>
                      {v.skills && <p className="font-medium text-primary mb-1">{v.skills}</p>}
                      <p className="italic">"{v.message}"</p>
                    </div>
                    
                    <div className="flex items-center justify-end">
                      {v.status !== "Recusada" && (
                        <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => cancel(v.id)}>
                          <Trash2 className="h-4 w-4 mr-2" /> Cancelar Candidatura
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
