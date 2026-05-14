import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Flag, HandHeart, MapPin, Sparkles } from "lucide-react";

export const Route = createFileRoute("/projects/$id")({ component: ProjectDetail });

function ProjectDetail() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const [p, setP] = useState<any>(null);
  const [volunteerMsg, setVolunteerMsg] = useState("");
  const [donationDesc, setDonationDesc] = useState("");
  const [donationAmt, setDonationAmt] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [reqForm, setReqForm] = useState({ request_type: "material", description: "", quantity: "", contact_info: "" });

  const load = async () => {
    const { data } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
    setP(data);
    const { data: v } = await supabase
      .from("volunteer_requests")
      .select("id, message, created_at, user_id")
      .eq("project_id", id)
      .order("created_at", { ascending: false });
    setVolunteers(v || []);
    const { data: d } = await supabase.from("donations").select("id, description, amount, created_at, user_id").eq("project_id", id).order("created_at", { ascending: false });
    setDonations(d || []);
    const { data: rq } = await supabase.from("project_requests").select("*").eq("project_id", id).order("created_at", { ascending: false });
    setRequests(rq || []);
  };
  useEffect(() => { load(); }, [id]);

  // resolve names for volunteers/donations
  const [names, setNames] = useState<Record<string, string>>({});
  useEffect(() => {
    const ids = Array.from(new Set([...volunteers.map(v => v.user_id), ...donations.map(d => d.user_id)].filter(Boolean)));
    if (ids.length === 0) return;
    supabase.from("profiles").select("id, display_name").in("id", ids).then(({ data }) => {
      const map: Record<string, string> = {};
      (data || []).forEach((r: any) => { map[r.id] = r.display_name; });
      setNames(map);
    });
  }, [volunteers, donations]);

  if (!p) return <div className="min-h-screen flex flex-col"><Header /><main className="flex-1 grid place-items-center"><p>Carregando...</p></main></div>;

  const volunteer = async () => {
    if (!user) return toast.error("Faça login.");
    const { error } = await supabase.from("volunteer_requests").insert({ project_id: id, user_id: user.id, message: volunteerMsg });
    if (error) return toast.error(error.message);
    toast.success("Solicitação de voluntariado enviada!");
    setVolunteerMsg("");
  };

  const donate = async () => {
    if (!user) return toast.error("Faça login.");
    const { error } = await supabase.from("donations").insert({ project_id: id, user_id: user.id, description: donationDesc, amount: donationAmt ? Number(donationAmt) : null });
    if (error) return toast.error(error.message);
    toast.success("Doação registrada!");
    setDonationDesc(""); setDonationAmt("");
  };

  const report = async () => {
    if (!user) return toast.error("Faça login.");
    const { error } = await supabase.from("reports").insert({ project_id: id, user_id: user.id, reason: reportReason });
    if (error) return toast.error(error.message);
    toast.success("Denúncia registrada.");
    setReportReason("");
  };

  const requestCompletion = async () => {
    const { error } = await supabase.from("projects").update({ completion_status: "completion_requested" }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Conclusão solicitada para revisão do administrador.");
    load();
  };

  const submitRequest = async () => {
    if (!user) return toast.error("Faça login.");
    if (!reqForm.description.trim()) return toast.error("Descreva a necessidade.");
    const { error } = await supabase.from("project_requests").insert({
      project_id: id, user_id: user.id, request_type: reqForm.request_type,
      description: reqForm.description, quantity: reqForm.quantity ? Number(reqForm.quantity) : null,
      contact_info: reqForm.contact_info,
    });
    if (error) return toast.error(error.message);
    toast.success("Solicitação enviada!");
    setReqForm({ request_type: "material", description: "", quantity: "", contact_info: "" });
    load();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-3 mb-6">
          {p.images.map((u: string, i: number) => <img key={i} src={u} alt="" className="rounded-lg aspect-video object-cover w-full" loading="lazy" />)}
          {p.images.length === 0 && <div className="rounded-lg bg-muted aspect-video col-span-2" />}
        </div>
        <span className="text-sm font-medium text-primary uppercase tracking-wide">{p.improvement_type}</span>
        <h1 className="text-3xl md:text-4xl font-bold mt-1">{p.name}</h1>
        <p className="mt-2 text-muted-foreground inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{p.location}</p>
        <p className="mt-4 text-foreground/90 whitespace-pre-wrap">{p.description}</p>
        <div className="mt-3 inline-flex gap-2 text-xs">
          <span className="rounded-full bg-secondary px-3 py-1">Status: {p.completion_status}</span>
        </div>

        {user?.id === p.owner_id && p.completion_status === "in_progress" && (
          <div className="mt-6"><Button onClick={requestCompletion}><Sparkles className="h-4 w-4 mr-1" />Marcar como concluído</Button></div>
        )}

        <div className="mt-10 grid md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold mb-2 inline-flex items-center gap-2"><HandHeart className="h-4 w-4 text-primary" />Voluntariar-se</h3>
            <Textarea placeholder="Conte sua especialidade" rows={3} value={volunteerMsg} onChange={(e) => setVolunteerMsg(e.target.value)} />
            <Button onClick={volunteer} className="mt-2 w-full" size="sm">Enviar solicitação</Button>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold mb-2 inline-flex items-center gap-2"><Sparkles className="h-4 w-4 text-accent" />Doar</h3>
            <Input placeholder="Descrição (ex: 50 telhas)" value={donationDesc} onChange={(e) => setDonationDesc(e.target.value)} />
            <Input type="number" placeholder="Valor R$ (opcional)" value={donationAmt} onChange={(e) => setDonationAmt(e.target.value)} className="mt-2" />
            <Button onClick={donate} className="mt-2 w-full" size="sm" variant="secondary">Registrar doação</Button>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold mb-2 inline-flex items-center gap-2"><Flag className="h-4 w-4 text-destructive" />Denunciar</h3>
            <Textarea placeholder="Motivo da denúncia" rows={3} value={reportReason} onChange={(e) => setReportReason(e.target.value)} />
            <Button onClick={report} variant="destructive" className="mt-2 w-full" size="sm">Enviar denúncia</Button>
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-3 inline-flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" />Solicitar materiais, frete ou registrar intenção de doação</h3>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Tipo</label>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={reqForm.request_type} onChange={(e) => setReqForm({ ...reqForm, request_type: e.target.value })}>
                <option value="material">Material</option>
                <option value="frete">Ajuda de custo / frete</option>
                <option value="doacao">Intenção de doação</option>
              </select>
            </div>
            <div><label className="text-xs text-muted-foreground">Quantidade (opcional)</label><Input type="number" min={1} value={reqForm.quantity} onChange={(e) => setReqForm({ ...reqForm, quantity: e.target.value })} /></div>
            <div className="md:col-span-2"><label className="text-xs text-muted-foreground">Descrição da necessidade</label><Textarea rows={3} value={reqForm.description} onChange={(e) => setReqForm({ ...reqForm, description: e.target.value })} /></div>
            <div className="md:col-span-2"><label className="text-xs text-muted-foreground">Contato (e-mail/telefone)</label><Input value={reqForm.contact_info} onChange={(e) => setReqForm({ ...reqForm, contact_info: e.target.value })} /></div>
          </div>
          <Button onClick={submitRequest} className="mt-3" size="sm">Enviar solicitação</Button>
        </div>
        {user?.id === p.owner_id && (
          <div className="mt-10 grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold mb-3 inline-flex items-center gap-2"><HandHeart className="h-4 w-4 text-primary" />Voluntários ({volunteers.length})</h3>
              {volunteers.length === 0 ? <p className="text-sm text-muted-foreground">Ninguém se voluntariou ainda.</p> : (
                <ul className="space-y-3">
                  {volunteers.map((v) => (
                    <li key={v.id} className="text-sm border-b border-border pb-2 last:border-0">
                      <p className="font-medium">{names[v.user_id] || "Usuário"}</p>
                      {v.message && <p className="text-muted-foreground mt-1 whitespace-pre-wrap">{v.message}</p>}
                      <p className="text-xs text-muted-foreground mt-1">{new Date(v.created_at).toLocaleString("pt-BR")}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold mb-3 inline-flex items-center gap-2"><Sparkles className="h-4 w-4 text-accent" />Doações ({donations.length})</h3>
              {donations.length === 0 ? <p className="text-sm text-muted-foreground">Nenhuma doação registrada.</p> : (
                <ul className="space-y-3">
                  {donations.map((d) => (
                    <li key={d.id} className="text-sm border-b border-border pb-2 last:border-0 flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{names[d.user_id] || "Doador"}</p>
                        <p className="text-muted-foreground">{d.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(d.created_at).toLocaleString("pt-BR")}</p>
                      </div>
                      {d.amount && <span className="font-semibold text-primary whitespace-nowrap">R$ {Number(d.amount).toFixed(2)}</span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="rounded-xl border border-border bg-card p-5 md:col-span-2">
              <h3 className="font-semibold mb-3">Solicitações recebidas ({requests.length})</h3>
              {requests.length === 0 ? <p className="text-sm text-muted-foreground">Nenhuma solicitação ainda.</p> : (
                <ul className="space-y-3">
                  {requests.map((r) => (
                    <li key={r.id} className="text-sm border-b border-border pb-2 last:border-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium capitalize">{r.request_type === "frete" ? "Ajuda de custo / frete" : r.request_type}</span>
                        <span className="text-xs rounded-full bg-secondary px-2 py-0.5">{r.status}</span>
                      </div>
                      <p className="text-muted-foreground mt-1 whitespace-pre-wrap">{r.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {names[r.user_id] || "Usuário"} {r.quantity ? `· Qtd: ${r.quantity}` : ""} {r.contact_info ? `· ${r.contact_info}` : ""} · {new Date(r.created_at).toLocaleString("pt-BR")}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
