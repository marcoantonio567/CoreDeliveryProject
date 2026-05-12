import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { MapPin, Package } from "lucide-react";

export const Route = createFileRoute("/materials/$id")({ component: MaterialDetail });

function MaterialDetail() {
  const { id } = Route.useParams();
  const [m, setM] = useState<any>(null);
  useEffect(() => { supabase.from("materials").select("*").eq("id", id).maybeSingle().then(({ data }) => setM(data)); }, [id]);
  if (!m) return <div className="min-h-screen flex flex-col"><Header /><main className="flex-1 grid place-items-center"><p>Carregando...</p></main></div>;
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-10">
        <div className="grid md:grid-cols-2 gap-3 mb-6">
          {m.images.length ? m.images.map((u: string, i: number) => <img key={i} src={u} alt="" className="rounded-lg aspect-video object-cover w-full" loading="lazy" />) : <div className="rounded-lg bg-muted aspect-video col-span-2 grid place-items-center"><Package className="h-12 w-12 text-muted-foreground" /></div>}
        </div>
        <h1 className="text-3xl font-bold">{m.name}</h1>
        <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{m.location}</span>
          <span>Quantidade: <b className="text-foreground">{m.quantity}</b></span>
        </div>
        <p className="mt-4 whitespace-pre-wrap">{m.description}</p>
        <div className="mt-6 rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold">Entrar em contato com o doador</h3>
          <p className="mt-2 text-sm">{m.contact_info}</p>
        </div>
      </main>
    </div>
  );
}
