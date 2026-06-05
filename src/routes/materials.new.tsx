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
import { Package, ShieldCheck, Truck } from "lucide-react";

export const Route = createFileRoute("/materials/new")({ component: NewMaterial });

const CONDITION_OPTIONS = ["Novo", "Seminovo", "Usado"];
const UNIT_OPTIONS = ["Unidade", "Quilograma", "Metro", "Litro", "Saco"];

const formatPhone = (v: string) => {
  const digits = v.replace(/\D/g, "");
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
};

function NewMaterial() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    location: "",
    quantity: 1,
    condition: "Novo",
    unit: "Unidade",
    contact_phone: "",
    contact_email: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  if (!user)
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 grid place-items-center">
          <p>Faça login.</p>
        </main>
      </div>
    );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.contact_phone && !form.contact_email) {
      return toast.error("Informe pelo menos um meio de contato (Telefone ou E-mail).");
    }
    setLoading(true);
    try {
      const images = files.length ? await uploadImages(user.id, files) : [];
      const { error } = await supabase.from("materials").insert({
        ...form,
        quantity: Number(form.quantity),
        owner_id: user.id,
        images,
        availability_status: "Disponível",
        contact_info: form.contact_phone || form.contact_email, // Maintain compatibility
      });
      if (error) throw error;
      toast.success("Material publicado! Aguardando aprovação.");
      nav({ to: "/materials" });
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
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Doar material</h1>
        </div>

        <form onSubmit={submit} className="space-y-4 rounded-xl border border-border bg-card p-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Material</Label>
            <Input
              id="name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ex: Telhas de fibrocimento"
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
                placeholder="Ex: Centro, Itapevi - SP"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc">Descrição do material</Label>
            <Textarea
              id="desc"
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Descreva o estado, marca, dimensões..."
            />
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Meios de Contato (Informe pelo menos um)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone / WhatsApp</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={form.contact_phone}
                  onChange={(e) => setForm({ ...form, contact_phone: formatPhone(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={form.contact_email}
                  onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Imagens do material</Label>
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
              onClick={() => nav({ to: "/materials" })}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Publicando..." : "Publicar Doação"}
            </Button>
          </div>
        </form>

        <div className="mt-6 rounded-lg bg-muted/50 p-4 border border-border">
          <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
            <ShieldCheck className="h-4 w-4 text-primary" /> Transparência e Segurança
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Sua doação passará por uma breve moderação antes de ficar visível para todos. Ao doar,
            você ajuda a transformar a realidade habitacional de alguém.
          </p>
        </div>
      </main>
    </div>
  );
}
