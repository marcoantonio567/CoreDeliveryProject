import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, Package, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/materials/")({ component: Materials });

function Materials() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let query = supabase
      .from("materials")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });
    if (q) query = query.ilike("name", `%${q}%`);
    query.then(({ data }) => {
      setItems(data || []);
      setLoading(false);
    });
  }, [q]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="flex flex-wrap gap-3 items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Materiais para doação</h1>
            <p className="text-muted-foreground">Recursos disponibilizados pela comunidade.</p>
          </div>
          {user && <Button asChild><Link to="/materials/new"><Plus className="h-4 w-4 mr-1" />Doar material</Link></Button>}
        </div>
        <Input placeholder="Pesquisar..." value={q} onChange={(e) => setQ(e.target.value)} className="max-w-md mb-6" />
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <p>Carregando materiais...</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((m) => (
              <Link key={m.id} to="/materials/$id" params={{ id: m.id }} className="group rounded-xl overflow-hidden border border-border bg-card hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-muted overflow-hidden">
                  {m.images[0] ? <img src={m.images[0]} alt={m.name} className="w-full h-full object-cover" loading="lazy" /> : <div className="w-full h-full grid place-items-center"><Package className="h-10 w-10 text-muted-foreground" /></div>}
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold">{m.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{m.description}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{m.location}</span>
                    <span>Qtd: {m.quantity}</span>
                  </div>
                </div>
              </Link>
            ))}
            {items.length === 0 && <p className="text-muted-foreground">Nenhum material disponível.</p>}
          </div>
        )}
      </main>
    </div>
  );
}
