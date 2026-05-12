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

export const Route = createFileRoute("/materials/new")({ component: NewMaterial });

function NewMaterial() {
  const { user } = useAuth(); const nav = useNavigate();
  const [form, setForm] = useState({ name: "", description: "", location: "", quantity: 1, contact_info: "" });
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  if (!user) return <div className="min-h-screen flex flex-col"><Header /><main className="flex-1 grid place-items-center"><p>Faça login.</p></main></div>;
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const images = files.length ? await uploadImages(user.id, files) : [];
      const { error } = await supabase.from("materials").insert({ ...form, quantity: Number(form.quantity), owner_id: user.id, images });
      if (error) throw error;
      toast.success("Material publicado!");
      nav({ to: "/materials" });
    } catch (err: any) { toast.error(err.message); } finally { setLoading(false); }
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Doar material</h1>
        <form onSubmit={submit} className="space-y-4 rounded-xl border border-border bg-card p-6">
          <div><Label>Nome</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><Label>Descrição</Label><Textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Localização</Label><Input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
            <div><Label>Quantidade</Label><Input type="number" min={1} required value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} /></div>
          </div>
          <div><Label>Contato (e-mail/telefone)</Label><Input required value={form.contact_info} onChange={(e) => setForm({ ...form, contact_info: e.target.value })} /></div>
          <div><Label>Imagens</Label><Input type="file" accept="image/*" multiple onChange={(e) => setFiles(Array.from(e.target.files || []))} /></div>
          <Button type="submit" disabled={loading}>{loading ? "Enviando..." : "Publicar"}</Button>
        </form>
      </main>
    </div>
  );
}
