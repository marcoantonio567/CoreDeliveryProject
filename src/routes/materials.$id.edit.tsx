import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
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
import { Package, X, Loader2, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/materials/$id/edit")({ component: EditMaterial });

const CONDITION_OPTIONS = ["Novo", "Seminovo", "Usado"];
const UNIT_OPTIONS = ["Unidade", "Quilograma", "Metro", "Litro", "Saco"];

function EditMaterial() {
  const { id } = Route.useParams();
  const { user, isAdmin } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState<any>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      setFetching(true);
      try {
        const { data } = await supabase
          .from("materials")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (data) {
          setForm({
            ...data,
            name: data.name || "",
            description: data.description || "",
            location: data.location || "",
            quantity: data.quantity || 1,
            contact_info: data.contact_info || "",
            condition: data.condition || "Novo",
            unit: data.unit || "Unidade",
            images: data.images || [],
          });
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error("Error loading material:", err);
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [id]);

  if (!user)
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 grid place-items-center">
          <p>Faça login.</p>
        </main>
      </div>
    );

  if (fetching)
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 grid place-items-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Carregando material...</p>
          </div>
        </main>
      </div>
    );

  if (notFound)
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 grid place-items-center">
          <div className="text-center">
            <p className="text-xl font-semibold">Material não encontrado.</p>
            <Button variant="link" asChild>
              <Link to="/materials">Voltar para materiais</Link>
            </Button>
          </div>
        </main>
      </div>
    );

  if (user.id !== form.owner_id && !isAdmin)
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 grid place-items-center">
          <p>Você não tem permissão para editar este material.</p>
        </main>
      </div>
    );

  const removeImage = (url: string) =>
    setForm({ ...form, images: (form.images || []).filter((u: string) => u !== url) });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let images = form.images || [];
      if (files.length) images = [...images, ...(await uploadImages(user.id, files))];
      const { error } = await supabase
        .from("materials")
        .update({
          name: form.name,
          description: form.description,
          location: form.location,
          quantity: Number(form.quantity),
          contact_info: form.contact_info,
          condition: form.condition,
          unit: form.unit,
          images,
        })
        .eq("id", id);
      if (error) throw error;
      toast.success("Atualizado!");
      nav({ to: "/materials/$id", params: { id } });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto max-w-2xl px-4 py-10">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/materials/$id" params={{ id }}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Editar material</h1>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Material</Label>
            <Input
              id="name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Estado de Conservação</Label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                value={form.condition}
                onChange={(e) => setForm({ ...form, condition: e.target.value })}
              >
                {CONDITION_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Unidade de Medida</Label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
              >
                {UNIT_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="qty">Quantidade disponível</Label>
              <Input
                id="qty"
                type="number"
                min={1}
                required
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loc">Localização (Bairro/Cidade)</Label>
              <Input
                id="loc"
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc">Descrição do material</Label>
            <Textarea
              id="desc"
              required
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact">Contato (e-mail ou telefone)</Label>
            <Input
              id="contact"
              required
              value={form.contact_info}
              onChange={(e) => setForm({ ...form, contact_info: e.target.value })}
            />
          </div>

          <div className="space-y-4">
            <Label>Imagens atuais</Label>
            {form.images?.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {form.images.map((u: string) => (
                  <div key={u} className="relative group">
                    <img
                      src={u}
                      alt=""
                      className="aspect-video w-full object-cover rounded-lg border border-border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(u)}
                      className="absolute top-1 right-1 bg-destructive/90 text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">Nenhuma imagem cadastrada.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Adicionar novas imagens</Label>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              asChild
            >
              <Link to="/materials/$id" params={{ id }}>
                Cancelar
              </Link>
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
