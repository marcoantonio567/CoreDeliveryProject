import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { HandHeart, MapPin, Package, Truck } from "lucide-react";

export const Route = createFileRoute("/materials/$id")({ component: MaterialDetail });

function MaterialDetail() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const [m, setM] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [names, setNames] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    quantity: "",
    description: "",
    contact_info: "",
    address: "",
    needs_freight: false,
  });

  const loadMaterial = () =>
    supabase.from("materials").select("*").eq("id", id).maybeSingle().then(({ data }) => setM(data));

  const loadRequests = () =>
    supabase
      .from("material_requests")
      .select("*")
      .eq("material_id", id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setRequests(data || []));

  useEffect(() => {
    loadMaterial();
    loadRequests();
  }, [id]);

  // Pre-fill address from user profile
  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("phone, address_street, address_number, address_complement, address_neighborhood, address_city, address_state, address_zip")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        const parts = [
          data.address_street,
          data.address_number,
          data.address_complement,
          data.address_neighborhood,
          data.address_city,
          data.address_state,
          data.address_zip,
        ].filter(Boolean);
        if (parts.length) setForm((f) => ({ ...f, address: parts.join(", ") }));
        if (data.phone) setForm((f) => ({ ...f, contact_info: f.contact_info || data.phone || "" }));
      });
  }, [user]);

  // Resolve requester names for owner view
  useEffect(() => {
    const ids = [...new Set(requests.map((r) => r.user_id).filter(Boolean))];
    if (!ids.length) return;
    supabase
      .from("profiles")
      .select("id, display_name")
      .in("id", ids)
      .then(({ data }) => {
        const map: Record<string, string> = {};
        (data || []).forEach((p: any) => { map[p.id] = p.display_name; });
        setNames(map);
      });
  }, [requests]);

  if (!m)
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 grid place-items-center"><p>Carregando...</p></main>
      </div>
    );

  const isOwner = user?.id === m.owner_id;

  const submitRequest = async () => {
    if (!user) return toast.error("Faça login para solicitar.");
    if (!form.description.trim()) return toast.error("Descreva sua necessidade.");
    if (!form.contact_info.trim()) return toast.error("Informe um contato.");
    if (!form.address.trim()) return toast.error("Informe o endereço para entrega.");

    const { error } = await supabase.from("material_requests").insert({
      material_id: id,
      user_id: user.id,
      quantity: form.quantity ? Number(form.quantity) : null,
      description: form.description,
      contact_info: form.contact_info,
      address: form.address,
      needs_freight: form.needs_freight,
    });
    if (error) return toast.error(error.message);
    toast.success("Solicitação enviada! O doador entrará em contato.");
    setForm({ quantity: "", description: "", contact_info: "", address: "", needs_freight: false });
    loadRequests();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-10">
        {/* Images */}
        <div className="grid md:grid-cols-2 gap-3 mb-6">
          {m.images.length
            ? m.images.map((u: string, i: number) => (
                <img key={i} src={u} alt="" className="rounded-lg aspect-video object-cover w-full" loading="lazy" />
              ))
            : (
              <div className="rounded-lg bg-muted aspect-video col-span-2 grid place-items-center">
                <Package className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
        </div>

        {/* Info */}
        <h1 className="text-3xl font-bold">{m.name}</h1>
        <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{m.location}</span>
          <span>Quantidade disponível: <b className="text-foreground">{m.quantity}</b></span>
        </div>
        <p className="mt-4 whitespace-pre-wrap">{m.description}</p>

        {/* Contact (always visible) */}
        <div className="mt-6 rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold">Contato do doador</h3>
          <p className="mt-2 text-sm">{m.contact_info}</p>
        </div>

        {/* Donation request form — hidden from owner */}
        {!isOwner && (
          <div className="mt-8 rounded-xl border border-border bg-card p-6 space-y-4">
            <div>
              <h3 className="font-semibold inline-flex items-center gap-2 text-lg">
                <HandHeart className="h-5 w-5 text-primary" />Solicitar esta doação
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Conte sua história e por que precisa deste material. O doador analisará seu pedido.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="req-qty">Quantidade desejada <span className="text-muted-foreground">(opcional)</span></Label>
                <Input
                  id="req-qty"
                  type="number"
                  min={1}
                  placeholder="Ex: 20"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="req-contact">Contato (e-mail / telefone)</Label>
                <Input
                  id="req-contact"
                  placeholder="seu@email.com ou (XX) XXXXX-XXXX"
                  value={form.contact_info}
                  onChange={(e) => setForm({ ...form, contact_info: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="req-desc">Descrição da necessidade</Label>
              <Textarea
                id="req-desc"
                rows={4}
                placeholder="Explique por que precisa deste material, como será utilizado e sua situação atual…"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="req-address">Endereço para entrega</Label>
              <Input
                id="req-address"
                placeholder="Rua, número, bairro, cidade – UF"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div
                role="checkbox"
                aria-checked={form.needs_freight}
                onClick={() => setForm({ ...form, needs_freight: !form.needs_freight })}
                className={`h-5 w-5 shrink-0 rounded border transition-colors ${form.needs_freight ? "bg-primary border-primary" : "border-input bg-background"} flex items-center justify-center`}
              >
                {form.needs_freight && (
                  <svg className="h-3 w-3 text-primary-foreground" fill="none" viewBox="0 0 12 12">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="inline-flex items-center gap-2 text-sm">
                <Truck className="h-4 w-4 text-muted-foreground" />
                Preciso de ajuda com o frete
              </span>
            </label>

            <Button onClick={submitRequest} className="w-full sm:w-auto">
              Enviar solicitação
            </Button>
          </div>
        )}

        {/* Owner view: list of requests */}
        {isOwner && (
          <div className="mt-8 rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-4 inline-flex items-center gap-2">
              <HandHeart className="h-5 w-5 text-primary" />Solicitações recebidas ({requests.length})
            </h3>
            {requests.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma solicitação ainda.</p>
            ) : (
              <ul className="space-y-4">
                {requests.map((r) => (
                  <li key={r.id} className="rounded-lg border border-border p-4 text-sm space-y-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-medium">{names[r.user_id] || "Usuário"}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(r.created_at).toLocaleString("pt-BR")}
                      </span>
                    </div>
                    {r.quantity && <p className="text-muted-foreground">Quantidade: <b className="text-foreground">{r.quantity}</b></p>}
                    <p className="whitespace-pre-wrap">{r.description}</p>
                    <p className="text-muted-foreground">Contato: <b className="text-foreground">{r.contact_info}</b></p>
                    <p className="text-muted-foreground">Endereço: <b className="text-foreground">{r.address}</b></p>
                    {r.needs_freight && (
                      <span className="inline-flex items-center gap-1 text-xs rounded-full bg-secondary px-2 py-0.5">
                        <Truck className="h-3 w-3" />Precisa de frete
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
