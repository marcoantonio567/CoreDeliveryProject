import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  Flag,
  HandHeart,
  History,
  Info,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  QrCode,
  Sparkles,
  Trash2,
  TrendingUp,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { uploadImages } from "@/lib/upload";

function tlv(tag: string, value: string) {
  return `${tag}${value.length.toString().padStart(2, "0")}${value}`;
}

function crc16(str: string) {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1;
  }
  return (crc & 0xffff).toString(16).toUpperCase().padStart(4, "0");
}

function buildPixPayload(key: string) {
  const merchantAccount = tlv("00", "br.gov.bcb.pix") + tlv("01", key);
  const body =
    tlv("00", "01") +
    tlv("01", "12") +
    tlv("26", merchantAccount) +
    tlv("52", "0000") +
    tlv("53", "986") +
    tlv("58", "BR") +
    tlv("59", "ConstruirJuntos") +
    tlv("60", "Brasil") +
    "6304";
  return body + crc16(body);
}

const PIX_TYPE_LABELS: Record<string, string> = {
  cpf: "CPF",
  cnpj: "CNPJ",
  email: "E-mail",
  phone: "Telefone",
  random: "Chave aleatória",
};

const NEED_TYPES = ["Material", "Mão de obra", "Frete", "Financeira"];

export const Route = createFileRoute("/projects/$id")({ component: ProjectDetail });

function ProjectDetail() {
  const { id } = Route.useParams();
  const { user, isAdmin } = useAuth();
  const [p, setP] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isNeedOpen, setIsNeedOpen] = useState(false);
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isVolunteerOpen, setIsVolunteerOpen] = useState(false);
  const [isEditNeedOpen, setIsEditNeedOpen] = useState(false);
  const [isDeleteNeedOpen, setIsDeleteNeedOpen] = useState(false);

  const [editForm, setEditForm] = useState<any>(null);
  const [editFiles, setEditFiles] = useState<File[]>([]);
  const [editLoading, setEditLoading] = useState(false);
  const [volunteerForm, setVolunteerForm] = useState({
    message: "",
    contact_phone: "",
    contact_email: "",
    skills: "",
  });
  const [editingNeed, setEditingNeed] = useState<any>(null);
  const [deletingNeed, setDeletingNeed] = useState<any>(null);
  const [volunteerMsg, setVolunteerMsg] = useState("");
  const [donationDesc, setDonationDesc] = useState("");
  const [donationAmt, setDonationAmt] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [needs, setNeeds] = useState<any[]>([]);
  const [updates, setUpdates] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  
  const [newNeed, setNewNeed] = useState({ type: "Material", description: "", quantity_needed: "" });
  const [newUpdate, setNewUpdate] = useState({ description: "" });
  const [newExpense, setNewExpense] = useState({ description: "", amount: "", date: new Date().toISOString().split("T")[0] });

  const [reqForm, setReqForm] = useState({
    request_type: "material",
    description: "",
    quantity: "",
    contact_info: "",
  });
  const [ownerPix, setOwnerPix] = useState<{ pix_key: string; pix_key_type: string } | null>(null);

  const load = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const { data } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
      setP(data);
      if (data) {
        setEditForm({
          name: data.name || "",
          description: data.description || "",
          improvement_type: data.improvement_type || "Telhado",
          location: data.location || "",
          urgency: data.urgency || "Média",
          financial_goal: data.financial_goal || 0,
          estimated_cost: data.estimated_cost || 0,
          start_date: data.start_date || "",
          end_date: data.end_date || "",
          beneficiary_name: data.beneficiary_name || "",
          beneficiary_residents: data.beneficiary_residents || 0,
          beneficiary_children: data.beneficiary_children || 0,
          beneficiary_income: data.beneficiary_income || "Até 1 salário mínimo",
          beneficiary_situation: data.beneficiary_situation || "",
          beneficiary_vulnerability: data.beneficiary_vulnerability || "",
          images: data.images || [],
        });
      }
      if (data?.owner_id) {
        supabase
          .from("profiles")
          .select("pix_key, pix_key_type")
          .eq("id", data.owner_id)
          .maybeSingle()
          .then(({ data: pix }) => {
            setOwnerPix(
              pix?.pix_key ? { pix_key: pix.pix_key, pix_key_type: pix.pix_key_type ?? "" } : null,
            );
          });
      }
      const { data: v } = await supabase
        .from("volunteer_requests")
        .select("id, message, created_at, user_id, status")
        .eq("project_id", id)
        .order("created_at", { ascending: false });
      setVolunteers(v || []);
      const { data: d } = await supabase
        .from("donations")
        .select("id, description, amount, created_at, user_id")
        .eq("project_id", id)
        .order("created_at", { ascending: false });
      setDonations(d || []);
      const { data: rq } = await supabase
        .from("project_requests")
        .select("*")
        .eq("project_id", id)
        .order("created_at", { ascending: false });
      setRequests(rq || []);

      // Load new advanced data
      const [{ data: nd }, { data: up }, { data: ex }] = await Promise.all([
        supabase.from("project_needs").select("*").eq("project_id", id).order("created_at"),
        supabase.from("project_updates").select("*").eq("project_id", id).order("created_at", { ascending: false }),
        supabase.from("project_expenses").select("*").eq("project_id", id).order("date", { ascending: false }),
      ]);
      setNeeds(nd || []);
      setUpdates(up || []);
      setExpenses(ex || []);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, [id]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("phone, profession, specialty")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        setVolunteerForm((f) => ({
          ...f,
          contact_phone: f.contact_phone || data.phone || "",
          skills: f.skills || (data.profession ? `${data.profession}${data.specialty ? ` (${data.specialty})` : ""}` : ""),
          contact_email: f.contact_email || user.email || "",
        }));
      });
  }, [user]);

  // resolve names for volunteers/donations
  const [names, setNames] = useState<Record<string, string>>({});
  useEffect(() => {
    const ids = Array.from(
      new Set(
        [
          ...volunteers.map((v) => v.user_id),
          ...donations.map((d) => d.user_id),
          ...requests.map((r) => r.user_id),
        ].filter(Boolean),
      ),
    );
    if (ids.length === 0) return;
    supabase
      .from("profiles")
      .select("id, display_name")
      .in("id", ids)
      .then(({ data }) => {
        const map: Record<string, string> = {};
        (data || []).forEach((r: any) => {
          map[r.id] = r.display_name;
        });
        setNames(map);
      });
  }, [volunteers, donations, requests]);

  if (loading)
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 grid place-items-center">
          <p>Carregando...</p>
        </main>
      </div>
    );

  if (!p)
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 grid place-items-center space-y-4">
          <p className="text-xl font-bold">Projeto não encontrado</p>
          <p className="text-muted-foreground">O projeto que você procura não existe ou ainda não foi aprovado.</p>
          <Button asChild>
            <Link to="/">Voltar para o início</Link>
          </Button>
        </main>
      </div>
    );

  const volunteer = async () => {
    if (!user) return toast.error("Faça login.");
    if (!volunteerForm.message || !volunteerForm.skills) {
      return toast.error("Preencha os campos obrigatórios.");
    }
    if (!volunteerForm.contact_phone && !volunteerForm.contact_email) {
      return toast.error("Informe pelo menos um meio de contato.");
    }
    const { error } = await supabase.from("volunteer_requests").insert({
      project_id: id,
      user_id: user.id,
      message: volunteerForm.message,
      skills: volunteerForm.skills,
      contact_phone: volunteerForm.contact_phone,
      contact_email: volunteerForm.contact_email,
    });
    if (error) return toast.error(error.message);
    toast.success("Solicitação de voluntariado enviada!");
    setVolunteerForm({
      message: "",
      skills: volunteerForm.skills, // keep skills for convenience
      contact_phone: volunteerForm.contact_phone,
      contact_email: volunteerForm.contact_email,
    });
    setIsVolunteerOpen(false);
    load(true);
  };

  const donate = async () => {
    if (!user) return toast.error("Faça login.");
    const { error } = await supabase.from("donations").insert({
      project_id: id,
      user_id: user.id,
      description: donationDesc,
      amount: donationAmt ? Number(donationAmt) : null,
    });
    if (error) return toast.error(error.message);
    toast.success("Doação registrada!");
    setDonationDesc("");
    setDonationAmt("");
  };

  const report = async () => {
    if (!user) return toast.error("Faça login.");
    const { error } = await supabase
      .from("reports")
      .insert({ project_id: id, user_id: user.id, reason: reportReason });
    if (error) return toast.error(error.message);
    toast.success("Denúncia registrada.");
    setReportReason("");
  };

  const removeEditImage = (url: string) => {
    setEditForm({ ...editForm, images: (editForm.images || []).filter((u: string) => u !== url) });
  };

  const saveProject = async () => {
    if (!editForm.name || !editForm.description || !editForm.location || !editForm.beneficiary_name || !editForm.beneficiary_situation || !editForm.beneficiary_vulnerability || !editForm.estimated_cost || !editForm.financial_goal || !editForm.start_date || !editForm.end_date) {
      return toast.error("Por favor, preencha todos os campos obrigatórios marcados com *");
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
        return toast.error("O projeto deve ter pelo menos uma imagem.");
      }

      const { error } = await supabase
        .from("projects")
        .update({
          name: editForm.name,
          description: editForm.description,
          improvement_type: editForm.improvement_type,
          location: editForm.location,
          urgency: editForm.urgency,
          financial_goal: Number(editForm.financial_goal),
          estimated_cost: Number(editForm.estimated_cost),
          start_date: editForm.start_date || null,
          end_date: editForm.end_date || null,
          beneficiary_name: editForm.beneficiary_name,
          beneficiary_residents: Number(editForm.beneficiary_residents),
          beneficiary_children: Number(editForm.beneficiary_children),
          beneficiary_income: editForm.beneficiary_income,
          beneficiary_situation: editForm.beneficiary_situation,
          beneficiary_vulnerability: editForm.beneficiary_vulnerability,
          images: images,
        })
        .eq("id", id);

      if (error) throw error;
      toast.success("Projeto atualizado!");
      setIsEditOpen(false);
      setEditFiles([]);
      load(true);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  const requestCompletion = async () => {
    const { error } = await supabase
      .from("projects")
      .update({ completion_status: "completion_requested" })
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Conclusão solicitada para revisão do administrador.");
    load(true);
  };

  const submitRequest = async () => {
    if (!user) return toast.error("Faça login.");
    if (!reqForm.description.trim()) return toast.error("Descreva a necessidade.");
    const { error } = await supabase.from("project_requests").insert({
      project_id: id,
      user_id: user.id,
      request_type: reqForm.request_type,
      description: reqForm.description,
      quantity: reqForm.quantity ? Number(reqForm.quantity) : null,
      contact_info: reqForm.contact_info,
    });
    if (error) return toast.error(error.message);
    toast.success("Solicitação enviada!");
    setReqForm({ request_type: "material", description: "", quantity: "", contact_info: "" });
    load(true);
  };

  const addNeed = async () => {
    if (!newNeed.description || !newNeed.quantity_needed) {
      return toast.error("Por favor, preencha todos os campos da necessidade.");
    }
    const { error } = await supabase.from("project_needs").insert({
      project_id: id,
      type: newNeed.type,
      description: newNeed.description,
      quantity_needed: newNeed.quantity_needed ? Number(newNeed.quantity_needed) : null,
    });
    if (error) return toast.error(error.message);
    toast.success("Necessidade adicionada!");
    setNewNeed({ type: "Material", description: "", quantity_needed: "" });
    setIsNeedOpen(false);
    load(true);
  };

  const updateNeed = async () => {
    if (!editingNeed.description || !editingNeed.quantity_needed) {
      return toast.error("Por favor, preencha todos os campos da necessidade.");
    }
    const { error } = await supabase
      .from("project_needs")
      .update({
        type: editingNeed.type,
        description: editingNeed.description,
        quantity_needed: Number(editingNeed.quantity_needed),
      })
      .eq("id", editingNeed.id);

    if (error) return toast.error(error.message);
    toast.success("Necessidade atualizada!");
    setIsEditNeedOpen(false);
    load(true);
  };

  const deleteNeed = async () => {
    if (!deletingNeed) return;
    const { error } = await supabase.from("project_needs").delete().eq("id", deletingNeed.id);
    if (error) return toast.error(error.message);
    toast.success("Necessidade excluída!");
    setIsDeleteNeedOpen(false);
    load(true);
  };

  const updateNeedProgress = async (needId: string, met: number, total: number) => {
    const status = met >= total ? "Atendida" : met > 0 ? "Parcialmente atendida" : "Pendente";
    const { error } = await supabase
      .from("project_needs")
      .update({ quantity_met: met, status })
      .eq("id", needId);
    if (error) return toast.error(error.message);
    
    // Update local state instead of calling load() to avoid full page reload/flicker
    setNeeds((prev) =>
      prev.map((n) => (n.id === needId ? { ...n, quantity_met: met, status } : n)),
    );
    toast.success("Progresso atualizado!");
  };

  const addUpdate = async () => {
    if (!newUpdate.description) return toast.error("Informe a descrição da atualização.");
    const { error } = await supabase
      .from("project_updates")
      .insert({ project_id: id, description: newUpdate.description });
    if (error) return toast.error(error.message);
    toast.success("Atualização publicada!");
    setNewUpdate({ description: "" });
    setIsUpdateOpen(false);
    load(true);
  };

  const addExpense = async () => {
    if (!newExpense.description || !newExpense.amount || !newExpense.date) {
      return toast.error("Preencha todos os campos do gasto.");
    }
    const { error } = await supabase.from("project_expenses").insert({
      project_id: id,
      description: newExpense.description,
      amount: Number(newExpense.amount),
      date: newExpense.date,
    });
    if (error) return toast.error(error.message);
    toast.success("Gasto registrado!");
    setNewExpense({
      description: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
    });
    setIsExpenseOpen(false);
    load(true);
  };

  const updateVolunteerStatus = async (vId: string, status: string) => {
    const { error } = await supabase.from("volunteer_requests").update({ status }).eq("id", vId);
    if (error) return toast.error(error.message);
    toast.success("Status do voluntário atualizado!");
    load(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-5xl">
        {/* Top Section: Images and Title */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="space-y-4">
            <div className="aspect-video rounded-xl overflow-hidden border border-border bg-muted">
              {p.images?.[0] ? (
                <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  Sem imagens
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {p.images?.slice(1, 5).map((u: string, i: number) => (
                <img
                  key={i}
                  src={u}
                  alt=""
                  className="aspect-square rounded-lg object-cover border border-border"
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="outline" className="uppercase tracking-wider">
                {p.improvement_type}
              </Badge>
              <Badge
                variant={
                  p.urgency === "Emergencial"
                    ? "destructive"
                    : p.urgency === "Alta"
                      ? "default"
                      : "secondary"
                }
              >
                Urgência: {p.urgency}
              </Badge>
              {p.completion_status === "completed" && (
                <Badge className="bg-green-500 hover:bg-green-600">Concluído</Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">{p.name}</h1>
            <p className="mt-2 text-muted-foreground flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {p.location}
            </p>

            <div className="mt-6 space-y-4 flex-1">
              {p.financial_goal > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium inline-flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-primary" /> Meta Financeira
                    </span>
                    <span className="text-muted-foreground">
                      R$ {donations.reduce((acc, d) => acc + (d.amount || 0), 0).toFixed(2)} / R${" "}
                      {Number(p.financial_goal).toFixed(2)}
                    </span>
                  </div>
                  <Progress
                    value={
                      (donations.reduce((acc, d) => acc + (d.amount || 0), 0) / p.financial_goal) *
                      100
                    }
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="rounded-lg border border-border p-3 bg-muted/30">
                  <p className="text-xs text-muted-foreground uppercase font-semibold">
                    Voluntários
                  </p>
                  <p className="text-2xl font-bold">
                    {volunteers.filter((v) => v.status === "Aprovada").length}
                  </p>
                </div>
                <div className="rounded-lg border border-border p-3 bg-muted/30">
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Doações</p>
                  <p className="text-2xl font-bold">{donations.length}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {user?.id === p.owner_id || isAdmin ? (
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1 gap-2">
                      <Pencil className="h-4 w-4" /> Editar Projeto
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Editar Projeto</DialogTitle>
                      <DialogDescription>
                        Atualize as informações básicas e detalhes do projeto.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                      <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="basic">Básico</TabsTrigger>
                          <TabsTrigger value="beneficiary">Beneficiário</TabsTrigger>
                          <TabsTrigger value="planning">Planejamento</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="basic" className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Nome do Projeto *</Label>
                            <Input
                              id="name"
                              required
                              value={editForm?.name}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="desc">Descrição *</Label>
                            <Textarea
                              id="desc"
                              required
                              rows={4}
                              value={editForm?.description}
                              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Tipo de melhoria *</Label>
                              <select
                                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                                value={editForm?.improvement_type}
                                onChange={(e) => setEditForm({ ...editForm, improvement_type: e.target.value })}
                              >
                                {["Telhado", "Banheiro", "Estrutura", "Cozinha", "Hidráulica", "Elétrica", "Outro"].map((o) => (
                                  <option key={o}>{o}</option>
                                ))}
                              </select>
                            </div>
                            <div className="space-y-2">
                              <Label>Urgência *</Label>
                              <select
                                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                                value={editForm?.urgency}
                                onChange={(e) => setEditForm({ ...editForm, urgency: e.target.value })}
                              >
                                {["Baixa", "Média", "Alta", "Emergencial"].map((o) => (
                                  <option key={o}>{o}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="loc">Localização *</Label>
                            <Input
                              id="loc"
                              required
                              value={editForm?.location}
                              onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                            />
                          </div>
                          <div className="space-y-4 pt-4 border-t">
                            <Label>Imagens do Projeto *</Label>
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
                        </TabsContent>

                        <TabsContent value="beneficiary" className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <Label htmlFor="b_name">Nome do Beneficiário *</Label>
                            <Input
                              id="b_name"
                              required
                              value={editForm?.beneficiary_name}
                              onChange={(e) => setEditForm({ ...editForm, beneficiary_name: e.target.value })}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="residents">Moradores (opcional)</Label>
                              <Input
                                id="residents"
                                type="number"
                                value={editForm?.beneficiary_residents}
                                onChange={(e) => setEditForm({ ...editForm, beneficiary_residents: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="children">Crianças (opcional)</Label>
                              <Input
                                id="children"
                                type="number"
                                value={editForm?.beneficiary_children}
                                onChange={(e) => setEditForm({ ...editForm, beneficiary_children: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Renda Familiar (opcional)</Label>
                            <select
                              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                              value={editForm?.beneficiary_income}
                              onChange={(e) => setEditForm({ ...editForm, beneficiary_income: e.target.value })}
                            >
                              <option value="">Não informado</option>
                              {[
                                "Até 1 salário mínimo",
                                "1 a 2 salários mínimos",
                                "2 a 3 salários mínimos",
                                "Mais de 3 salários mínimos",
                                "Sem renda",
                              ].map((o) => (
                                <option key={o}>{o}</option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="vulnerability">Vulnerabilidade *</Label>
                            <Input
                              id="vulnerability"
                              required
                              value={editForm?.beneficiary_vulnerability}
                              onChange={(e) => setEditForm({ ...editForm, beneficiary_vulnerability: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="situation">Situação Habitacional *</Label>
                            <Textarea
                              id="situation"
                              required
                              value={editForm?.beneficiary_situation}
                              onChange={(e) => setEditForm({ ...editForm, beneficiary_situation: e.target.value })}
                            />
                          </div>
                        </TabsContent>

                        <TabsContent value="planning" className="space-y-4 pt-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="est_cost">Custo Estimado (R$) *</Label>
                              <Input
                                id="est_cost"
                                required
                                type="number"
                                value={editForm?.estimated_cost}
                                onChange={(e) => setEditForm({ ...editForm, estimated_cost: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="fin_goal">Meta Financeira (R$) *</Label>
                              <Input
                                id="fin_goal"
                                required
                                type="number"
                                value={editForm?.financial_goal}
                                onChange={(e) => setEditForm({ ...editForm, financial_goal: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="start">Data de Início *</Label>
                              <Input
                                id="start"
                                required
                                type="date"
                                value={editForm?.start_date}
                                onChange={(e) => setEditForm({ ...editForm, start_date: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="end">Previsão de Término *</Label>
                              <Input
                                id="end"
                                required
                                type="date"
                                value={editForm?.end_date}
                                onChange={(e) => setEditForm({ ...editForm, end_date: e.target.value })}
                              />
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancelar</Button>
                      <Button onClick={saveProject}>Salvar Alterações</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              ) : (
                <>
                  <Button className="flex-1 gap-2" onClick={() => document.getElementById("interaction-tabs")?.scrollIntoView({ behavior: "smooth" })}>
                    <HandHeart className="h-4 w-4" /> Apoiar
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0 mb-6">
                <TabsTrigger
                  value="about"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                >
                  Sobre
                </TabsTrigger>
                <TabsTrigger
                  value="needs"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                >
                  Necessidades
                </TabsTrigger>
                <TabsTrigger
                  value="timeline"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                >
                  Timeline
                </TabsTrigger>
                <TabsTrigger
                  value="finance"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                >
                  Financeiro
                </TabsTrigger>
                {user?.id === p.owner_id && (
                  <TabsTrigger
                    value="management"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2 text-primary"
                  >
                    Gestão
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="about" className="space-y-8">
                <div className="prose prose-sm max-w-none">
                  <h3 className="text-xl font-bold mb-4">Descrição do Projeto</h3>
                  <p className="whitespace-pre-wrap text-foreground/80 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                {p.beneficiary_name && (
                  <div className="rounded-xl border border-border bg-card p-6">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" /> Informações do Beneficiário
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase font-semibold">
                          Responsável
                        </p>
                        <p className="font-medium">{p.beneficiary_name}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase font-semibold">
                          Moradores
                        </p>
                        <p className="font-medium">
                          {p.beneficiary_residents} pessoas ({p.beneficiary_children} crianças)
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase font-semibold">
                          Renda Familiar
                        </p>
                        <p className="font-medium">{p.beneficiary_income}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase font-semibold">
                          Vulnerabilidade
                        </p>
                        <p className="font-medium">{p.beneficiary_vulnerability}</p>
                      </div>
                    </div>
                    {p.beneficiary_situation && (
                      <div className="mt-6 space-y-1 border-t pt-4">
                        <p className="text-xs text-muted-foreground uppercase font-semibold">
                          Situação Habitacional
                        </p>
                        <p className="text-sm text-foreground/80">{p.beneficiary_situation}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-border bg-muted/20 p-4">
                    <h4 className="text-sm font-bold flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4" /> Cronograma Previsto
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Início:</span>
                        <span className="font-medium">
                          {p.start_date
                            ? new Date(p.start_date).toLocaleDateString("pt-BR")
                            : "Não definido"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Conclusão:</span>
                        <span className="font-medium">
                          {p.end_date
                            ? new Date(p.end_date).toLocaleDateString("pt-BR")
                            : "Não definido"}
                        </span>
                      </div>
                    </div>
                  </div>
                  {p.estimated_cost > 0 && (
                    <div className="rounded-xl border border-border bg-muted/20 p-4">
                      <h4 className="text-sm font-bold flex items-center gap-2 mb-2">
                        <Wallet className="h-4 w-4" /> Custo Estimado
                      </h4>
                      <p className="text-2xl font-bold text-primary">
                        R$ {Number(p.estimated_cost).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">Valor total previsto para a obra</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="needs" className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold">Necessidades do Projeto</h3>
                  <Badge variant="outline">{needs.length} itens</Badge>
                </div>
                {needs.length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed rounded-xl border-border">
                    <p className="text-muted-foreground">Nenhuma necessidade cadastrada.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {needs.map((n) => (
                      <div key={n.id} className="rounded-xl border border-border bg-card p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <Badge className="mb-2">{n.type}</Badge>
                            <h4 className="font-bold text-lg">{n.description}</h4>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge
                              variant={n.status === "Atendida" ? "default" : "secondary"}
                              className={n.status === "Atendida" ? "bg-green-500" : ""}
                            >
                              {n.status}
                            </Badge>
                            {(user?.id === p.owner_id || isAdmin) && (
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                                  onClick={() => {
                                    setEditingNeed(n);
                                    setIsEditNeedOpen(true);
                                  }}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                  onClick={() => {
                                    setDeletingNeed(n);
                                    setIsDeleteNeedOpen(true);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                        {n.quantity_needed > 0 && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span>Progresso</span>
                              <span>
                                {n.quantity_met || 0} / {n.quantity_needed}
                              </span>
                            </div>
                            <Progress value={((n.quantity_met || 0) / n.quantity_needed) * 100} />
                          </div>
                        )}
                        {user?.id === p.owner_id && (
                          <div className="mt-4 pt-4 border-t flex items-center gap-4">
                            <Label className="text-xs">Atualizar quantidade atendida:</Label>
                            <Input
                              type="number"
                              className="w-24 h-8"
                              defaultValue={n.quantity_met || 0}
                              onBlur={(e) =>
                                updateNeedProgress(n.id, Number(e.target.value), n.quantity_needed)
                              }
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="timeline" className="space-y-6">
                <h3 className="text-xl font-bold mb-4">Linha do Tempo</h3>
                <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                  {updates.length === 0 && (
                    <p className="text-muted-foreground ml-2">O projeto ainda não possui atualizações.</p>
                  )}
                  {updates.map((u) => (
                    <div key={u.id} className="relative">
                      <span className="absolute -left-[29px] top-1.5 h-4 w-4 rounded-full border-2 border-background bg-primary ring-4 ring-background" />
                      <div className="rounded-xl border border-border bg-card p-5">
                        <p className="text-xs text-muted-foreground mb-1">
                          {new Date(u.created_at).toLocaleDateString("pt-BR")}
                        </p>
                        <p className="text-foreground/90 whitespace-pre-wrap">{u.description}</p>
                      </div>
                    </div>
                  ))}
                  <div className="relative">
                    <span className="absolute -left-[29px] top-1.5 h-4 w-4 rounded-full border-2 border-background bg-muted-foreground ring-4 ring-background" />
                    <div className="rounded-xl border border-border bg-muted/20 p-5">
                      <p className="text-xs text-muted-foreground mb-1">
                        {new Date(p.created_at).toLocaleDateString("pt-BR")}
                      </p>
                      <p className="font-semibold">Projeto criado e enviado para aprovação</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="finance" className="space-y-6">
                <h3 className="text-xl font-bold mb-4">Transparência Financeira</h3>
                
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Arrecadado</p>
                    <p className="text-xl font-bold text-green-600">
                      R$ {donations.reduce((acc, d) => acc + (d.amount || 0), 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Utilizado</p>
                    <p className="text-xl font-bold text-destructive">
                      R$ {expenses.reduce((acc, e) => acc + (e.amount || 0), 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Saldo</p>
                    <p className="text-xl font-bold">
                      R$ {(donations.reduce((acc, d) => acc + (d.amount || 0), 0) - expenses.reduce((acc, e) => acc + (e.amount || 0), 0)).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold flex items-center gap-2">
                    <History className="h-4 w-4" /> Histórico de Gastos
                  </h4>
                  {expenses.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">Nenhuma despesa registrada até o momento.</p>
                  ) : (
                    <div className="rounded-xl border border-border overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-muted">
                          <tr>
                            <th className="px-4 py-2 text-left">Data</th>
                            <th className="px-4 py-2 text-left">Descrição</th>
                            <th className="px-4 py-2 text-right">Valor</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {expenses.map((e) => (
                            <tr key={e.id}>
                              <td className="px-4 py-3">{new Date(e.date).toLocaleDateString("pt-BR")}</td>
                              <td className="px-4 py-3">{e.description}</td>
                              <td className="px-4 py-3 text-right font-medium">R$ {Number(e.amount).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </TabsContent>

              {user?.id === p.owner_id && (
                <TabsContent value="management" className="space-y-8">
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <h3 className="text-xl font-bold">Painel de Gestão do Proprietário</h3>
                      <div className="flex flex-wrap gap-2">
                        <Dialog open={isNeedOpen} onOpenChange={setIsNeedOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm" className="gap-2">
                              <Plus className="h-4 w-4" /> Nova Necessidade
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Adicionar Necessidade</DialogTitle>
                              <DialogDescription>
                                Especifique o que o projeto precisa no momento.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label>Tipo *</Label>
                                <select
                                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                                  value={newNeed.type}
                                  onChange={(e) => setNewNeed({ ...newNeed, type: e.target.value })}
                                >
                                  {NEED_TYPES.map((t) => (
                                    <option key={t}>{t}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="space-y-2">
                                <Label>Descrição *</Label>
                                <Input
                                  value={newNeed.description}
                                  onChange={(e) => setNewNeed({ ...newNeed, description: e.target.value })}
                                  placeholder="Ex: 50 sacos de cimento"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Quantidade total necessária *</Label>
                                <Input
                                  type="number"
                                  value={newNeed.quantity_needed}
                                  onChange={(e) => setNewNeed({ ...newNeed, quantity_needed: e.target.value })}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsNeedOpen(false)}>Cancelar</Button>
                              <Button onClick={addNeed}>Cadastrar</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="gap-2">
                              <History className="h-4 w-4" /> Nova Atualização
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Publicar Atualização</DialogTitle>
                              <DialogDescription>
                                Mantenha os apoiadores informados sobre o progresso.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <Label>Descrição da Atualização *</Label>
                              <Textarea
                                placeholder="Descreva o que aconteceu no projeto hoje..."
                                rows={5}
                                value={newUpdate.description}
                                onChange={(e) => setNewUpdate({ description: e.target.value })}
                              />
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsUpdateOpen(false)}>Cancelar</Button>
                              <Button onClick={addUpdate}>Publicar</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Dialog open={isExpenseOpen} onOpenChange={setIsExpenseOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="secondary" className="gap-2">
                              <Wallet className="h-4 w-4" /> Registrar Gasto
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Registrar Gasto / Prestação de Contas</DialogTitle>
                              <DialogDescription>
                                Registre como os recursos estão sendo utilizados.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label>Data *</Label>
                                <Input
                                  type="date"
                                  value={newExpense.date}
                                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Descrição do gasto *</Label>
                                <Input
                                  placeholder="Ex: Compra de materiais na loja X"
                                  value={newExpense.description}
                                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Valor (R$) *</Label>
                                <Input
                                  type="number"
                                  value={newExpense.amount}
                                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsExpenseOpen(false)}>Cancelar</Button>
                              <Button onClick={addExpense}>Salvar Gasto</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <HandHeart className="h-5 w-5" /> Candidatos a Voluntário
                    </h3>
                    {volunteers.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Nenhuma solicitação de voluntário recebida.</p>
                    ) : (
                      <div className="grid gap-4">
                        {volunteers.map((v) => (
                          <div key={v.id} className="rounded-xl border border-border bg-card p-5">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-bold text-lg">{names[v.user_id] || "Carregando..."}</p>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                  <p>{new Date(v.created_at).toLocaleString("pt-BR")}</p>
                                  {v.skills && <p className="font-medium text-primary">Habilidade: {v.skills}</p>}
                                </div>
                              </div>
                              <Badge variant={v.status === "Aprovada" ? "default" : v.status === "Recusada" ? "destructive" : "secondary"}>
                                {v.status || "Pendente"}
                              </Badge>
                            </div>
                            
                            <div className="mt-4 grid sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold">Mensagem</p>
                                <p className="text-sm text-foreground/80 bg-muted/30 p-3 rounded-lg border border-border/50">
                                  {v.message}
                                </p>
                              </div>
                              <div className="space-y-3">
                                <div className="space-y-1">
                                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Contatos</p>
                                  <div className="text-sm space-y-1">
                                    {v.contact_phone && (
                                      <p className="flex items-center gap-2">
                                        <Phone className="h-3 w-3" /> {v.contact_phone}
                                      </p>
                                    )}
                                    {v.contact_email && (
                                      <p className="flex items-center gap-2">
                                        <Mail className="h-3 w-3" /> {v.contact_email}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                
                                {v.status === "Pendente" && (
                                  <div className="flex gap-2 pt-2">
                                    <Button className="flex-1" size="sm" onClick={() => updateVolunteerStatus(v.id, "Aprovada")}>Aceitar</Button>
                                    <Button className="flex-1" size="sm" variant="outline" onClick={() => updateVolunteerStatus(v.id, "Recusada")}>Recusar</Button>
                                  </div>
                                )}
                                {v.status === "Aprovada" && v.contact_phone && (
                                  <Button className="w-full" size="sm" variant="secondary" asChild>
                                    <a href={`https://wa.me/${v.contact_phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                                      Falar no WhatsApp
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <div id="interaction-tabs" className="sticky top-20 space-y-6">
              {/* Main Interaction Card */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-4">Como você quer ajudar?</h3>
                
                <Tabs defaultValue="volunteer">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="volunteer">Trabalho</TabsTrigger>
                    <TabsTrigger value="donate">Recursos</TabsTrigger>
                  </TabsList>

                  <TabsContent value="volunteer" className="space-y-4">
                    <p className="text-sm text-muted-foreground">Ofereça seu tempo e habilidades para ajudar na execução desta melhoria.</p>
                    {volunteers.some((v) => v.user_id === user?.id) ? (
                      <div className="space-y-4">
                        <div className="bg-primary/10 text-primary p-4 rounded-xl text-center font-medium text-sm">
                          Sua candidatura já foi enviada!
                        </div>
                        {volunteers.find((v) => v.user_id === user?.id)?.status !== "Recusada" && (
                          <Button
                            variant="outline"
                            className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => {
                              const myReq = volunteers.find((v) => v.user_id === user?.id);
                              if (myReq) updateVolunteerStatus(myReq.id, "Recusada");
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Cancelar Candidatura
                          </Button>
                        )}
                      </div>
                    ) : (
                      <Dialog open={isVolunteerOpen} onOpenChange={setIsVolunteerOpen}>
                        <DialogTrigger asChild>
                          <Button className="w-full">
                            Candidatar-se como voluntário
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Candidatura de Voluntário</DialogTitle>
                            <DialogDescription>
                              Preencha os dados abaixo para que o proprietário possa entrar em contato.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Suas habilidades / Profissão *</Label>
                              <Input
                                placeholder="Ex: Pedreiro, Eletricista, Ajudante..."
                                value={volunteerForm.skills}
                                onChange={(e) => setVolunteerForm({ ...volunteerForm, skills: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Telefone / WhatsApp *</Label>
                              <Input
                                placeholder="(00) 00000-0000"
                                value={volunteerForm.contact_phone}
                                onChange={(e) => {
                                  const digits = e.target.value.replace(/\D/g, "");
                                  let formatted = digits;
                                  if (digits.length > 2) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
                                  if (digits.length > 7) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
                                  setVolunteerForm({ ...volunteerForm, contact_phone: formatted });
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>E-mail</Label>
                              <Input
                                type="email"
                                placeholder="seu@email.com"
                                value={volunteerForm.contact_email}
                                onChange={(e) => setVolunteerForm({ ...volunteerForm, contact_email: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Mensagem de interesse *</Label>
                              <Textarea
                                placeholder="Conte como você pode ajudar no projeto..."
                                rows={4}
                                value={volunteerForm.message}
                                onChange={(e) => setVolunteerForm({ ...volunteerForm, message: e.target.value })}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsVolunteerOpen(false)}>Cancelar</Button>
                            <Button onClick={volunteer}>Enviar Candidatura</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </TabsContent>

                  <TabsContent value="donate" className="space-y-4">
                    <p className="text-sm text-muted-foreground">Doe materiais, frete ou recursos financeiros para o projeto.</p>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs">Tipo de oferta</Label>
                        <select
                          className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                          value={reqForm.request_type}
                          onChange={(e) => setReqForm({ ...reqForm, request_type: e.target.value })}
                        >
                          <option value="material">Material / Insumos</option>
                          <option value="frete">Ajuda de custo / Frete</option>
                          <option value="doacao">Doação Financeira</option>
                        </select>
                      </div>
                      <div>
                        <Label className="text-xs">Descrição da oferta</Label>
                        <Textarea
                          placeholder="O que você está oferecendo?"
                          rows={3}
                          value={reqForm.description}
                          onChange={(e) => setReqForm({ ...reqForm, description: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Qtd (opcional)</Label>
                          <Input
                            type="number"
                            placeholder="Ex: 50"
                            value={reqForm.quantity}
                            onChange={(e) => setReqForm({ ...reqForm, quantity: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Valor (R$)</Label>
                          <Input
                            type="number"
                            placeholder="0,00"
                            value={donationAmt}
                            onChange={(e) => setDonationAmt(e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">Seu contato (e-mail/telefone)</Label>
                        <Input
                          placeholder="Como o dono do projeto te acha?"
                          value={reqForm.contact_info}
                          onChange={(e) => setReqForm({ ...reqForm, contact_info: e.target.value })}
                        />
                      </div>
                      <Button onClick={submitRequest} className="w-full" variant="secondary">
                        Enviar Oferta de Ajuda
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* PIX Card (if available) */}
              {ownerPix && (
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <h3 className="font-bold flex items-center gap-2 mb-4">
                    <QrCode className="h-5 w-5 text-primary" /> Doação Direta (PIX)
                  </h3>
                  <div className="flex flex-col items-center">
                    <div className="p-2 bg-white rounded-xl border border-border mb-4">
                      <QRCodeSVG value={buildPixPayload(ownerPix.pix_key)} size={140} />
                    </div>
                    <p className="text-xs text-center text-muted-foreground mb-4">
                      O valor vai direto para a conta do responsável pelo projeto.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2"
                      onClick={() => {
                        navigator.clipboard.writeText(ownerPix.pix_key);
                        toast.success("Chave PIX copiada!");
                      }}
                    >
                      <Copy className="h-4 w-4" /> Copiar Chave PIX
                    </Button>
                  </div>
                </div>
              )}

              {/* Report Card */}
              <div className="rounded-2xl border border-border bg-muted/50 p-6">
                <h4 className="text-sm font-bold flex items-center gap-2 text-destructive mb-3">
                  <Flag className="h-4 w-4" /> Denunciar Irregularidade
                </h4>
                <Textarea
                  placeholder="Descreva o problema encontrado..."
                  className="text-xs mb-3"
                  rows={2}
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                />
                <Button variant="ghost" size="sm" className="w-full text-xs text-destructive hover:bg-destructive/10" onClick={report}>
                  Enviar Denúncia
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Need Dialog */}
        <Dialog open={isEditNeedOpen} onOpenChange={setIsEditNeedOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Necessidade</DialogTitle>
              <DialogDescription>
                Atualize as informações da necessidade do projeto.
              </DialogDescription>
            </DialogHeader>
            {editingNeed && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Tipo *</Label>
                  <select
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={editingNeed.type}
                    onChange={(e) => setEditingNeed({ ...editingNeed, type: e.target.value })}
                  >
                    {NEED_TYPES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Descrição *</Label>
                  <Input
                    value={editingNeed.description}
                    onChange={(e) => setEditingNeed({ ...editingNeed, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Quantidade total necessária *</Label>
                  <Input
                    type="number"
                    value={editingNeed.quantity_needed}
                    onChange={(e) => setEditingNeed({ ...editingNeed, quantity_needed: e.target.value })}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditNeedOpen(false)}>Cancelar</Button>
              <Button onClick={updateNeed}>Salvar Alterações</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Need Confirmation */}
        <AlertDialog open={isDeleteNeedOpen} onOpenChange={setIsDeleteNeedOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. Isso excluirá permanentemente a necessidade
                "{deletingNeed?.description}" do projeto.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={deleteNeed} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}
