import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/my-materials")({ component: MyMaterials });

const STATUS_LABEL: Record<string, string> = { pending: "Pendente", approved: "Aprovado", rejected: "Reprovado", disabled: "Desabilitado" };
const STATUS_CLASS: Record<string, string> = {
  pending: "bg-secondary text-secondary-foreground", approved: "bg-primary/15 text-primary",
  rejected: "bg-destructive/15 text-destructive", disabled: "bg-muted text-muted-foreground",
};

function MyMaterials() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await supabase
        .from("materials")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });
      setItems(data || []);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, [user]);

  const remove = async (id: string) => {
    if (!confirm("Excluir material?")) return;
    const { error } = await supabase.from("materials").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Excluído"); load();
  };

  if (!user) return <div className="min-h-screen flex flex-col"><Header /><main className="flex-1 grid place-items-center"><p>Faça login.</p></main></div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h1 className="text-3xl font-bold">Meus materiais</h1>
          <Button asChild><Link to="/materials/new"><Plus className="h-4 w-4 mr-1" />Novo</Link></Button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <p>Carregando seus materiais...</p>
          </div>
        ) : items.length === 0 ? (
          <p className="text-muted-foreground">Você ainda não cadastrou materiais.</p>
        ) : (
          <div className="space-y-3">
            {items.map((m) => (
              <div key={m.id} className="rounded-xl border border-border bg-card p-5 flex flex-wrap items-center gap-4 justify-between">
                <div className="min-w-0 flex-1">
                  <Link to="/materials/$id" params={{ id: m.id }} className="font-semibold hover:underline">{m.name}</Link>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                    <span className={`rounded-full px-2 py-0.5 ${STATUS_CLASS[m.status] || ""}`}>{STATUS_LABEL[m.status] || m.status}</span>
                    <span className="text-muted-foreground">Qtd: {m.quantity}</span>
                    <span className="text-muted-foreground">· {new Date(m.created_at).toLocaleDateString("pt-BR")}</span>
                  </div>
                  {m.rejection_reason && <p className="mt-1 text-xs text-destructive">Motivo: {m.rejection_reason}</p>}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" asChild><Link to="/materials/$id/edit" params={{ id: m.id }}><Pencil className="h-4 w-4" /></Link></Button>
                  <Button size="sm" variant="destructive" onClick={() => remove(m.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
