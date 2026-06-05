import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { Loader2, Package, Trash2, MapPin, Phone, Mail, Clock } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/my-requests")({ component: MyRequests });

function MyRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("material_requests")
        .select(`
          *,
          materials (
            id,
            name,
            location,
            availability_status,
            images
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (err: any) {
      toast.error("Erro ao carregar solicitações: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [user]);

  const cancel = async (id: string) => {
    if (!confirm("Tem certeza que deseja desfazer seu interesse neste material?")) return;
    const { error } = await supabase.from("material_requests").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Interesse removido");
    load();
  };

  if (!user)
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 grid place-items-center">
          <p>Faça login para ver suas solicitações.</p>
        </main>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-primary/10 p-2 rounded-lg text-primary">
            <Package className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold">Solicitações de Materiais</h1>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <p>Carregando solicitações...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border-2 border-dashed border-border bg-muted/20">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground text-lg">Você ainda não demonstrou interesse em nenhum material.</p>
            <Button asChild className="mt-4" variant="outline">
              <Link to="/materials">Ver Materiais Disponíveis</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {requests.map((r) => (
              <div key={r.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden bg-muted shrink-0">
                    {r.materials?.images?.[0] ? (
                      <img src={r.materials.images[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Package className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                      <Link 
                        to="/materials/$id" 
                        params={{ id: r.material_id }} 
                        className="text-xl font-bold hover:text-primary transition-colors"
                      >
                        {r.materials?.name || "Material não disponível"}
                      </Link>
                      <Badge variant={r.materials?.availability_status === "Disponível" ? "default" : "secondary"}>
                        {r.materials?.availability_status || "Indisponível"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" /> {r.materials?.location}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" /> Solicitado em {new Date(r.created_at).toLocaleDateString("pt-BR")}
                      </div>
                      {r.contact_phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-4 w-4" /> {r.contact_phone}
                        </div>
                      )}
                      {r.contact_email && (
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-4 w-4" /> {r.contact_email}
                        </div>
                      )}
                    </div>

                    <div className="bg-muted/50 rounded-lg p-3 text-sm italic text-foreground/80 mb-4">
                      "{r.description}"
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        Qtd. Solicitada: <b>{r.quantity || "1"}</b>
                      </div>
                      {r.materials?.availability_status !== "Doado" && (
                        <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => cancel(r.id)}>
                          <Trash2 className="h-4 w-4 mr-2" /> Desfazer Interesse
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
