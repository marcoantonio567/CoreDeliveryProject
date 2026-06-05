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
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Copy,
  Flag,
  HandHeart,
  History,
  Info,
  MapPin,
  Plus,
  QrCode,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Label } from "recharts";

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

  const load = async () => {
    const { data } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
    setP(data);
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
  };
  useEffect(() => {
    load();
  }, [id]);

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

  if (!p)
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 grid place-items-center">
          <p>Carregando...</p>
        </main>
      </div>
    );

  const volunteer = async () => {
    if (!user) return toast.error("Faça login.");
    const { error } = await supabase
      .from("volunteer_requests")
      .insert({ project_id: id, user_id: user.id, message: volunteerMsg });
    if (error) return toast.error(error.message);
    toast.success("Solicitação de voluntariado enviada!");
    setVolunteerMsg("");
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

  const requestCompletion = async () => {
    const { error } = await supabase
      .from("projects")
      .update({ completion_status: "completion_requested" })
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Conclusão solicitada para revisão do administrador.");
    load();
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
    load();
  };

  const addNeed = async () => {
    if (!newNeed.description) return toast.error("Informe a descrição.");
    const { error } = await supabase.from("project_needs").insert({
      project_id: id,
      type: newNeed.type,
      description: newNeed.description,
      quantity_needed: newNeed.quantity_needed ? Number(newNeed.quantity_needed) : null,
    });
    if (error) return toast.error(error.message);
    toast.success("Necessidade adicionada!");
    setNewNeed({ type: "Material", description: "", quantity_needed: "" });
    load();
  };

  const updateNeedProgress = async (needId: string, met: number, total: number) => {
    const status = met >= total ? "Atendida" : met > 0 ? "Parcialmente atendida" : "Pendente";
    const { error } = await supabase
      .from("project_needs")
      .update({ quantity_met: met, status })
      .eq("id", needId);
    if (error) return toast.error(error.message);
    toast.success("Progresso atualizado!");
    load();
  };

  const addUpdate = async () => {
    if (!newUpdate.description) return toast.error("Informe a descrição.");
    const { error } = await supabase
      .from("project_updates")
      .insert({ project_id: id, description: newUpdate.description });
    if (error) return toast.error(error.message);
    toast.success("Atualização publicada!");
    setNewUpdate({ description: "" });
    load();
  };

  const addExpense = async () => {
    if (!newExpense.description || !newExpense.amount) return toast.error("Preencha os campos.");
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
    load();
  };

  const updateVolunteerStatus = async (vId: string, status: string) => {
    const { error } = await supabase.from("volunteer_requests").update({ status }).eq("id", vId);
    if (error) return toast.error(error.message);
    toast.success("Status do voluntário atualizado!");
    load();
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
                <Button asChild variant="outline" className="flex-1">
                  <Link to="/projects/$id/edit" params={{ id }}>
                    Editar Projeto
                  </Link>
                </Button>
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
                          <Badge
                            variant={n.status === "Atendida" ? "default" : "secondary"}
                            className={n.status === "Atendida" ? "bg-green-500" : ""}
                          >
                            {n.status}
                          </Badge>
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
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold">Painel de Gestão do Proprietário</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="rounded-xl border border-border p-5 bg-card space-y-4">
                        <h4 className="font-bold flex items-center gap-2">
                          <Plus className="h-4 w-4" /> Adicionar Necessidade
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs">Tipo</Label>
                            <select
                              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                              value={newNeed.type}
                              onChange={(e) => setNewNeed({ ...newNeed, type: e.target.value })}
                            >
                              {NEED_TYPES.map((t) => (
                                <option key={t}>{t}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <Label className="text-xs">Descrição</Label>
                            <Input
                              value={newNeed.description}
                              onChange={(e) => setNewNeed({ ...newNeed, description: e.target.value })}
                              placeholder="Ex: 50 sacos de cimento"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Quantidade total necessária</Label>
                            <Input
                              type="number"
                              value={newNeed.quantity_needed}
                              onChange={(e) => setNewNeed({ ...newNeed, quantity_needed: e.target.value })}
                            />
                          </div>
                          <Button onClick={addNeed} size="sm" className="w-full">
                            Cadastrar Necessidade
                          </Button>
                        </div>
                      </div>

                      <div className="rounded-xl border border-border p-5 bg-card space-y-4">
                        <h4 className="font-bold flex items-center gap-2">
                          <History className="h-4 w-4" /> Publicar Atualização
                        </h4>
                        <div className="space-y-3">
                          <Textarea
                            placeholder="Descreva o que aconteceu no projeto hoje..."
                            rows={5}
                            value={newUpdate.description}
                            onChange={(e) => setNewUpdate({ description: e.target.value })}
                          />
                          <Button onClick={addUpdate} size="sm" className="w-full">
                            Publicar na Timeline
                          </Button>
                        </div>
                      </div>

                      <div className="rounded-xl border border-border p-5 bg-card space-y-4 sm:col-span-2">
                        <h4 className="font-bold flex items-center gap-2">
                          <Wallet className="h-4 w-4" /> Registrar Gasto / Prestação de Contas
                        </h4>
                        <div className="grid sm:grid-cols-3 gap-4">
                          <div>
                            <Label className="text-xs">Data</Label>
                            <Input
                              type="date"
                              value={newExpense.date}
                              onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <Label className="text-xs">Descrição do gasto</Label>
                            <Input
                              placeholder="Ex: Compra de materiais na loja X"
                              value={newExpense.description}
                              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Valor (R$)</Label>
                            <Input
                              type="number"
                              value={newExpense.amount}
                              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                            />
                          </div>
                          <div className="sm:col-span-2 flex items-end">
                            <Button onClick={addExpense} size="sm" className="w-full">
                              Salvar Gasto
                            </Button>
                          </div>
                        </div>
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
                                <p className="text-xs text-muted-foreground">{new Date(v.created_at).toLocaleString("pt-BR")}</p>
                              </div>
                              <Badge variant={v.status === "Aprovada" ? "default" : v.status === "Recusada" ? "destructive" : "secondary"}>
                                {v.status || "Pendente"}
                              </Badge>
                            </div>
                            <p className="mt-4 text-sm whitespace-pre-wrap text-foreground/80 bg-muted/30 p-3 rounded-lg">
                              {v.message}
                            </p>
                            {v.status === "Pendente" && (
                              <div className="mt-4 flex gap-2">
                                <Button size="sm" onClick={() => updateVolunteerStatus(v.id, "Aprovada")}>Aceitar</Button>
                                <Button size="sm" variant="outline" onClick={() => updateVolunteerStatus(v.id, "Recusada")}>Recusar</Button>
                              </div>
                            )}
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
                    <Textarea
                      placeholder="Diga como você pode ajudar (ex: sou pedreiro e posso ajudar no fim de semana)"
                      rows={4}
                      value={volunteerMsg}
                      onChange={(e) => setVolunteerMsg(e.target.value)}
                    />
                    <Button onClick={volunteer} className="w-full">
                      Candidatar-se como voluntário
                    </Button>
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
      </main>
    </div>
  );
}
