import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";
import { uploadImages } from "@/lib/upload";
import { toast } from "sonner";

export const Route = createFileRoute("/materials/$id/edit")({ component: EditMaterial });

function EditMaterial() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState<any>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from("materials").select("*").eq("id", id).maybeSingle().then(({ data }) => setForm(data));
  }, [id]);

  if (!user) return <div className="min-h-screen flex flex-col"><Header /><main className="flex-1 grid place-items-center"><p>Faça login.</p></main></div>;
  if (!form) return <div className="min-h-screen flex flex-col"><Header /><main className="flex-1 grid place-items-center"><p>Carregando...</p></main></div>;

  const removeImage = (url: string) => setForm({ ...form, images: form.images.filter((u: string) => u !== url) });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      let images = form.images || [];
      if (files.length) images = [...images, ...await uploadImages(user.id, files)];
      const { error } = await supabase.from("materials").update({
        name: form.name, description: form.description, location: form.location,
        quantity: Number(form.quantity), contact_info: form.contact_info, images,
      }).eq("id", id);
      if (error) throw error;
      toast.success("Atualizado!");
      nav({ to: "/materials/$id", params: { id } });
    } catch (err: any) { toast.error(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Editar material</h1>
        <form onSubmit={submit} className="space-y-4 rounded-xl border border-border bg-card p-6">
          <div><Label>Nome</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><Label>Descrição</Label><Textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Localização</Label><Input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
            <div><Label>Quantidade</Label><Input type="number" min={1} required value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} /></div>
          </div>
          <div><Label>Contato</Label><Input required value={form.contact_info} onChange={(e) => setForm({ ...form, contact_info: e.target.value })} /></div>
          <div>
            <Label>Imagens atuais</Label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {(form.images || []).map((u: string) => (
                <div key={u} className="relative">
                  <img src={u} alt="" className="aspect-video w-full object-cover rounded" />
                  <button type="button" onClick={() => removeImage(u)} className="absolute top-1 right-1 bg-destructive text-destructive-foreground text-xs px-2 rounded">x</button>
                </div>
              ))}
            </div>
          </div>
          <div><Label>Adicionar imagens</Label><Input type="file" accept="image/*" multiple onChange={(e) => setFiles(Array.from(e.target.files || []))} /></div>
          <Button type="submit" disabled={loading}>{loading ? "Salvando..." : "Salvar"}</Button>
        </form>
      </main>
    </div>
  );
}
