import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, MapPin } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/projects/")({ component: Projects });

type Project = { id: string; name: string; description: string; improvement_type: string; location: string; images: string[] };

function Projects() {
  const { user } = useAuth();
  const [items, setItems] = useState<Project[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    let query = supabase.from("projects").select("id,name,description,improvement_type,location,images").eq("status", "approved").order("created_at", { ascending: false });
    if (q) query = query.ilike("name", `%${q}%`);
    query.then(({ data }) => setItems((data as Project[]) || []));
  }, [q]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="flex flex-wrap gap-3 items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Projetos ativos</h1>
            <p className="text-muted-foreground">Encontre iniciativas para apoiar.</p>
          </div>
          {user && <Button asChild><Link to="/projects/new"><Plus className="h-4 w-4 mr-1" /> Novo projeto</Link></Button>}
        </div>
        <Input placeholder="Pesquisar por nome..." value={q} onChange={(e) => setQ(e.target.value)} className="max-w-md mb-6" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <Link key={p.id} to="/projects/$id" params={{ id: p.id }} className="group rounded-xl overflow-hidden border border-border bg-card hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-muted overflow-hidden">
                {p.images[0] && <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />}
              </div>
              <div className="p-5">
                <span className="text-xs font-medium text-primary uppercase tracking-wide">{p.improvement_type}</span>
                <h3 className="mt-1 text-lg font-semibold">{p.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                <p className="mt-3 text-xs text-muted-foreground inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{p.location}</p>
              </div>
            </Link>
          ))}
          {items.length === 0 && <p className="text-muted-foreground">Nenhum projeto encontrado.</p>}
        </div>
      </main>
    </div>
  );
}
