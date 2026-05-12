import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";
import { uploadImages } from "@/lib/upload";
import { toast } from "sonner";

export const Route = createFileRoute("/projects/new")({ component: NewProject });

function NewProject() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", description: "", improvement_type: "Telhado", location: "" });
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  if (!user) return <div className="min-h-screen flex flex-col"><Header /><main className="flex-1 grid place-items-center"><p>Faça login para criar projetos.</p></main></div>;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const images = files.length ? await uploadImages(user.id, files) : [];
      const { error } = await supabase.from("projects").insert({ ...form, owner_id: user.id, images });
      if (error) throw error;
      toast.success("Projeto criado! Aguardando aprovação do administrador.");
      nav({ to: "/projects" });
    } catch (err: any) { toast.error(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Novo projeto</h1>
        <form onSubmit={submit} className="space-y-4 rounded-xl border border-border bg-card p-6">
          <div><Label>Nome</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><Label>Descrição</Label><Textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div><Label>Tipo de melhoria</Label>
            <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.improvement_type} onChange={(e) => setForm({ ...form, improvement_type: e.target.value })}>
              {["Telhado", "Banheiro", "Estrutura", "Cozinha", "Hidráulica", "Elétrica", "Outro"].map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div><Label>Localização</Label><Input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
          <div><Label>Imagens</Label><Input type="file" accept="image/*" multiple onChange={(e) => setFiles(Array.from(e.target.files || []))} /></div>
          <Button type="submit" disabled={loading}>{loading ? "Enviando..." : "Criar projeto"}</Button>
        </form>
      </main>
    </div>
  );
}
