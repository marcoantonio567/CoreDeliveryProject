import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/my-projects")({ component: MyProjects });

const STATUS_LABEL: Record<string, string> = { pending: "Pendente", approved: "Aprovado", rejected: "Reprovado", disabled: "Desabilitado" };
const STATUS_CLASS: Record<string, string> = {
  pending: "bg-secondary text-secondary-foreground", approved: "bg-primary/15 text-primary",
  rejected: "bg-destructive/15 text-destructive", disabled: "bg-muted text-muted-foreground",
};

function MyProjects() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });
      const list = data || [];
      const ids = list.map((p) => p.id);
      if (ids.length) {
        const [{ data: vols }, { data: dons }] = await Promise.all([
          supabase.from("volunteer_requests").select("project_id").in("project_id", ids),
          supabase.from("donations").select("project_id").in("project_id", ids),
        ]);
        const vCount: Record<string, number> = {};
        const dCount: Record<string, number> = {};
        (vols || []).forEach((v: any) => {
          vCount[v.project_id] = (vCount[v.project_id] || 0) + 1;
        });
        (dons || []).forEach((d: any) => {
          dCount[d.project_id] = (dCount[d.project_id] || 0) + 1;
        });
        setItems(list.map((p) => ({ ...p, _v: vCount[p.id] || 0, _d: dCount[p.id] || 0 })));
      } else setItems(list);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, [user]);

  const remove = async (id: string) => {
    if (!confirm("Excluir projeto?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Excluído"); load();
  };

  if (!user) return <div className="min-h-screen flex flex-col"><Header /><main className="flex-1 grid place-items-center"><p>Faça login.</p></main></div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h1 className="text-3xl font-bold">Meus projetos</h1>
          <Button asChild><Link to="/projects/new"><Plus className="h-4 w-4 mr-1" />Novo</Link></Button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <p>Carregando seus projetos...</p>
          </div>
        ) : items.length === 0 ? (
          <p className="text-muted-foreground">Você ainda não criou projetos.</p>
        ) : (
          <div className="space-y-3">
            {items.map((p) => (
              <div key={p.id} className="rounded-xl border border-border bg-card p-5 flex flex-wrap items-center gap-4 justify-between">
                <div className="min-w-0 flex-1">
                  <Link to="/projects/$id" params={{ id: p.id }} className="font-semibold hover:underline">{p.name}</Link>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                    <span className={`rounded-full px-2 py-0.5 ${STATUS_CLASS[p.status]}`}>{STATUS_LABEL[p.status]}</span>
                    <span className="text-muted-foreground">{p._v} voluntário(s) · {p._d} doação(ões)</span>
                    <span className="text-muted-foreground">· {new Date(p.created_at).toLocaleDateString("pt-BR")}</span>
                  </div>
                  {p.rejection_reason && <p className="mt-1 text-xs text-destructive">Motivo: {p.rejection_reason}</p>}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" asChild><Link to="/projects/$id/edit" params={{ id: p.id }}><Pencil className="h-4 w-4" /></Link></Button>
                  <Button size="sm" variant="destructive" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
