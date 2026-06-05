import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HandHeart, MapPin, Package, Truck, CheckCircle2, Info, Pencil, Trash2, X } from "lucide-react";
import { uploadImages } from "@/lib/upload";

export const Route = createFileRoute("/materials/$id")({ component: MaterialDetail });

function MaterialDetail() {
  const { id } = Route.useParams();
  const { user, isAdmin } = useAuth();
  const [m, setM] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [names, setNames] = useState<Record<string, string>>({});
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [editFiles, setEditFiles] = useState<File[]>([]);
  const [editLoading, setEditLoading] = useState(false);

  const [form, setForm] = useState({
    quantity: "",
    description: "",
    contact_phone: "",
    contact_email: "",
    address: "",
    needs_freight: false,
  });

  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    location: "",
    quantity: 1,
    contact_phone: "",
    contact_email: "",
    condition: "Novo",
    unit: "Unidade",
    images: [] as string[],
  });

  const loadMaterial = () =>
    supabase
      .from("materials")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        setM(data);
        if (data) {
          setEditForm({
            name: data.name || "",
            description: data.description || "",
            location: data.location || "",
            quantity: data.quantity || 1,
            contact_phone: data.contact_phone || "",
            contact_email: data.contact_email || "",
            condition: data.condition || "Novo",
            unit: data.unit || "Unidade",
            images: data.images || [],
          });
        }
      });

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
      .select(
        "phone, address_street, address_number, address_complement, address_neighborhood, address_city, address_state, address_zip",
      )
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
        if (data.phone)
          setForm((f) => ({ ...f, contact_phone: data.phone || "" }));
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
        (data || []).forEach((p: any) => {
          map[p.id] = p.display_name;
        });
        setNames(map);
      });
  }, [requests]);

  if (!m)
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 grid place-items-center">
          <p>Carregando...</p>
        </main>
      </div>
    );

  const isOwner = user?.id === m.owner_id;
  const canEdit = isOwner || isAdmin;

  const submitRequest = async () => {
    if (!user) return toast.error("Faça login para solicitar.");
    if (!form.description.trim()) return toast.error("Descreva sua necessidade.");
    if (!form.contact_phone && !form.contact_email) {
      return toast.error("Informe pelo menos um meio de contato (Telefone ou E-mail).");
    }
    if (!form.address.trim()) return toast.error("Informe o endereço para entrega.");

    const { error } = await supabase.from("material_requests").insert({
      material_id: id,
      user_id: user.id,
      quantity: form.quantity ? Number(form.quantity) : null,
      description: form.description,
      contact_phone: form.contact_phone,
      contact_email: form.contact_email,
      contact_info: form.contact_phone || form.contact_email,
      address: form.address,
      needs_freight: form.needs_freight,
    });
    if (error) return toast.error(error.message);
    toast.success("Solicitação enviada! O doador entrará em contato.");
    setForm({ quantity: "", description: "", contact_phone: "", contact_email: "", address: "", needs_freight: false });
    loadRequests();
  };

  const cancelRequest = async (requestId: string) => {
    const { error } = await supabase.from("material_requests").delete().eq("id", requestId);
    if (error) return toast.error(error.message);
    toast.success("Solicitação cancelada.");
    loadRequests();
  };

  const updateAvailability = async () => {
    if (!pendingStatus) return;
    const { error } = await supabase
      .from("materials")
      .update({ availability_status: pendingStatus })
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status atualizado!");
    setIsConfirmOpen(false);
    setPendingStatus(null);
    loadMaterial();
  };

  const confirmStatusChange = (status: string) => {
    setPendingStatus(status);
    setIsConfirmOpen(true);
  };

  const removeEditImage = (url: string) => {
    setEditForm({ ...editForm, images: (editForm.images || []).filter((u: string) => u !== url) });
  };

  const saveMaterial = async () => {
    if (!editForm.name || !editForm.description || !editForm.location) {
      return toast.error("Preencha os campos obrigatórios.");
    }
    if (!editForm.contact_phone && !editForm.contact_email) {
      return toast.error("Informe pelo menos um meio de contato (Telefone ou E-mail).");
    }

    setEditLoading(true);
    try {
      let images = [...(editForm.images || [])];
      if (editFiles.length > 0) {
        const newImages = await uploadImages(user!.id, editFiles);
        images = [...images, ...newImages];
      }

      if (images.length === 0) {
        setEditLoading(false);
        return toast.error("O material deve ter pelo menos uma imagem.");
      }

      const { error } = await supabase
        .from("materials")
        .update({
          name: editForm.name,
          description: editForm.description,
          location: editForm.location,
          quantity: Number(editForm.quantity),
          contact_phone: editForm.contact_phone,
          contact_email: editForm.contact_email,
          contact_info: editForm.contact_phone || editForm.contact_email, // Compatibility
          condition: editForm.condition,
          unit: editForm.unit,
          images: images,
        })
        .eq("id", id);
      if (error) throw error;
      toast.success("Material atualizado!");
      setIsEditOpen(false);
      setEditFiles([]);
      loadMaterial();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto max-w-5xl px-4 py-10">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Images */}
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden border border-border bg-muted aspect-video">
              {m.images?.[0] ? (
                <img src={m.images[0]} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <Package className="h-12 w-12" />
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {m.images?.slice(1, 5).map((u: string, i: number) => (
                <img
                  key={i}
                  src={u}
                  alt=""
                  className="aspect-square rounded-xl object-cover border border-border"
                />
              ))}
            </div>
          </div>

          {/* Right Column: Info & Actions */}
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="secondary" className="gap-1">
                <CheckCircle2 className="h-3 w-3" /> {m.condition || "Estado não inf."}
              </Badge>
              <Badge variant="outline">
                {m.availability_status || "Disponível"}
              </Badge>
            </div>
            <div className="flex justify-between items-start">
              <h1 className="text-3xl md:text-4xl font-bold">{m.name}</h1>
              {canEdit && (
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Pencil className="h-4 w-4" /> Editar Detalhes
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Editar Material</DialogTitle>
                      <DialogDescription>
                        Atualize as informações do seu anúncio de material.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-name">Nome do Material *</Label>
                        <Input
                          id="edit-name"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Estado de Conservação</Label>
                          <select
                            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                            value={editForm.condition}
                            onChange={(e) => setEditForm({ ...editForm, condition: e.target.value })}
                          >
                            {["Novo", "Seminovo", "Usado"].map((o) => (
                              <option key={o}>{o}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>Unidade de Medida</Label>
                          <select
                            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                            value={editForm.unit}
                            onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })}
                          >
                            {["Unidade", "Quilograma", "Metro", "Litro", "Saco"].map((o) => (
                              <option key={o}>{o}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-qty">Quantidade</Label>
                          <Input
                            id="edit-qty"
                            type="number"
                            min={1}
                            value={editForm.quantity}
                            onChange={(e) => setEditForm({ ...editForm, quantity: Number(e.target.value) })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-loc">Localização *</Label>
                          <Input
                            id="edit-loc"
                            value={editForm.location}
                            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-desc">Descrição *</Label>
                        <Textarea
                            id="edit-desc"
                            rows={4}
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          />
                        </div>

                      <div className="space-y-4 pt-4 border-t">
                        <Label>Imagens do Material *</Label>
                        <div className="grid grid-cols-4 gap-2">
                          {editForm?.images?.map((u: string) => (
                            <div key={u} className="relative group aspect-square">
                              <img src={u} alt="" className="w-full h-full object-cover rounded-md border" />
                              <button
                                type="button"
                                onClick={() => removeEditImage(u)}
                                className="absolute -top-1 -right-1 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-files" className="text-xs text-muted-foreground">Adicionar novas imagens</Label>
                          <Input
                            id="edit-files"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => setEditFiles(Array.from(e.target.files || []))}
                          />
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Meios de Contato (Informe pelo menos um)</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-phone">Telefone / WhatsApp</Label>
                            <Input
                              id="edit-phone"
                              type="tel"
                              placeholder="(00) 00000-0000"
                              value={editForm.contact_phone}
                              onChange={(e) => {
                                const digits = e.target.value.replace(/\D/g, "");
                                let formatted = digits;
                                if (digits.length > 2) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
                                if (digits.length > 7) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
                                setEditForm({ ...editForm, contact_phone: formatted });
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-email">E-mail</Label>
                            <Input
                              id="edit-email"
                              type="email"
                              placeholder="seu@email.com"
                              value={editForm.contact_email}
                              onChange={(e) => setEditForm({ ...editForm, contact_email: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancelar</Button>
                      <Button onClick={saveMaterial} disabled={editLoading}>
                        {editLoading ? "Salvando..." : "Salvar Alterações"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {m.location}
              </span>
              <span className="inline-flex items-center gap-1">
                <Package className="h-4 w-4" />
                Quantidade: <b className="text-foreground ml-1">{m.quantity} {m.unit || "unid."}</b>
              </span>
            </div>

            <div className="mt-6 p-5 rounded-xl border border-border bg-card">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Descrição do Doador
              </h3>
              <p className="whitespace-pre-wrap text-foreground/90">{m.description}</p>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Info className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Contato Direto</p>
                <p className="font-medium">{m.contact_info}</p>
              </div>
            </div>

            {isOwner && (
              <div className="mt-8 space-y-3">
                <p className="text-sm font-bold">Gerenciar disponibilidade:</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={m.availability_status === "Disponível" ? "default" : "outline"}
                    onClick={() => confirmStatusChange("Disponível")}
                  >
                    Disponível
                  </Button>
                  <Button
                    size="sm"
                    variant={m.availability_status === "Reservado" ? "default" : "outline"}
                    onClick={() => confirmStatusChange("Reservado")}
                  >
                    Reservado
                  </Button>
                  <Button
                    size="sm"
                    variant={m.availability_status === "Doado" ? "default" : "outline"}
                    onClick={() => confirmStatusChange("Doado")}
                  >
                    Já Doado
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Donation request form — hidden from owner */}
        {!isOwner && m.availability_status === "Disponível" && (
          <div className="mt-12 rounded-2xl border border-border bg-card p-8 shadow-sm max-w-3xl">
            {requests.some((r) => r.user_id === user?.id) ? (
              <div className="text-center space-y-4">
                <div className="bg-green-100 text-green-700 p-4 rounded-xl flex items-center justify-center gap-2 font-medium">
                  <CheckCircle2 className="h-5 w-5" /> Você já demonstrou interesse neste material!
                </div>
                <p className="text-muted-foreground">O doador já recebeu seus dados e entrará em contato em breve.</p>
                <Button
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                  onClick={() => {
                    const myReq = requests.find((r) => r.user_id === user?.id);
                    if (myReq) cancelRequest(myReq.id);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Desfazer Interesse 
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="font-bold inline-flex items-center gap-2 text-2xl">
                    <HandHeart className="h-6 w-6 text-primary" /> Solicitar este material
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    Conte por que você precisa deste material e como ele ajudará na sua melhoria habitacional.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="req-qty">Quantidade que você precisa ({m.unit || "unid."})</Label>
                    <Input
                      id="req-qty"
                      type="number"
                      min={1}
                      max={m.quantity}
                      placeholder={`Ex: ${m.quantity}`}
                      value={form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="req-phone">Telefone / WhatsApp</Label>
                    <Input
                      id="req-phone"
                      placeholder="(00) 00000-0000"
                      value={form.contact_phone}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "");
                        let formatted = digits;
                        if (digits.length > 2) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
                        if (digits.length > 7) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
                        setForm({ ...form, contact_phone: formatted });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="req-email">E-mail</Label>
                    <Input
                      id="req-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={form.contact_email}
                      onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Label htmlFor="req-desc">Explique sua necessidade</Label>
                  <Textarea
                    id="req-desc"
                    rows={4}
                    placeholder="Conte brevemente sua história e o uso que dará ao material..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div className="mt-4 space-y-2">
                  <Label htmlFor="req-address">Endereço para entrega</Label>
                  <Input
                    id="req-address"
                    placeholder="Rua, número, bairro, cidade – UF"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                </div>

                <div className="mt-6 flex items-center space-x-2 bg-muted/50 p-3 rounded-lg border border-border">
                  <input
                    type="checkbox"
                    id="freight"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={form.needs_freight}
                    onChange={(e) => setForm({ ...form, needs_freight: e.target.checked })}
                  />
                  <Label htmlFor="freight" className="text-sm font-medium flex items-center gap-2">
                    <Truck className="h-4 w-4" /> Preciso de ajuda com o frete / transporte
                  </Label>
                </div>

                <Button onClick={submitRequest} className="mt-8 w-full sm:w-auto px-8" size="lg">
                  Enviar Solicitação
                </Button>
              </>
            )}
          </div>
        )}

        {isOwner && (
          <div className="mt-12 space-y-6">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" /> Interessados neste material ({requests.length})
            </h3>
            {requests.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-2xl border-border bg-muted/20">
                <p className="text-muted-foreground">Ninguém solicitou este material ainda.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {requests.map((r) => (
                  <div key={r.id} className="rounded-xl border border-border bg-card p-6 flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-lg">{names[r.user_id] || "Carregando..."}</p>
                        {r.needs_freight && (
                          <Badge variant="outline" className="text-orange-600 border-orange-600 gap-1">
                            <Truck className="h-3 w-3" /> Precisa de Frete
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-foreground/80 bg-muted/30 p-3 rounded-lg mb-3">
                        {r.description}
                      </p>
                      <div className="grid sm:grid-cols-2 gap-4 text-xs text-muted-foreground">
                        <p><b>Qtd solicitada:</b> {r.quantity || "Não inf."}</p>
                        <p><b>Contato:</b> {r.contact_info}</p>
                        <p className="sm:col-span-2"><b>Endereço:</b> {r.address}</p>
                      </div>
                    </div>
                    <div className="shrink-0 flex flex-col justify-between items-end">
                      <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString("pt-BR")}</p>
                      <Button size="sm" variant="secondary" asChild className="mt-4">
                        <a href={`https://wa.me/${r.contact_info.replace(/\D/g, "").trim()}`} target="_blank" rel="noreferrer">
                          Falar com Interessado
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar alteração de status</AlertDialogTitle>
              <AlertDialogDescription>
                Você tem certeza que deseja alterar o status deste material para "{pendingStatus}"?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setPendingStatus(null)}>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={updateAvailability}>Confirmar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}
