import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Award, BarChart3, CheckCircle2, Flag, MapPin, Package, Users, Wallet } from "lucide-react";

export const Route = createFileRoute("/admin")({ component: Admin });

function Admin() {
  const { isAdmin, loading } = useAuth();
  const [pendingProjects, setPendingProjects] = useState<any[]>([]);
  const [pendingMaterials, setPendingMaterials] = useState<any[]>([]);
  const [reported, setReported] = useState<any[]>([]);
  const [completionReq, setCompletionReq] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [adminIds, setAdminIds] = useState<Set<string>>(new Set());
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [search, setSearch] = useState({ projects: "", materials: "", users: "" });
  const [promoteEmail, setPromoteEmail] = useState("");
  const [rejectingProject, setRejectingProject] = useState<any>(null);
  const [rejectingMaterial, setRejectingMaterial] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [metrics, setMetrics] = useState({
    activeProjects: 0,
    completedProjects: 0,
    totalVolunteers: 0,
    totalMaterials: 0,
    totalRaised: 0,
    pendingReports: 0,
  });

  const reload = async () => {
    const [
      { data: pp },
      { data: pm },
      { data: r },
      { data: c },
      { data: u },
      { data: ar },
      { data: allP },
      { data: allM },
      { data: allV },
      { data: allD },
    ] = await Promise.all([
      supabase.from("projects").select("*").eq("status", "pending").order("created_at"),
      supabase.from("materials").select("*").eq("status", "pending").order("created_at"),
      supabase.from("reports").select("project_id, reason, created_at, projects(*)"),
      supabase.from("projects").select("*").eq("completion_status", "completion_requested"),
      supabase
        .from("profiles")
        .select("id, display_name, created_at")
        .order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id").eq("role", "admin"),
      supabase.from("projects").select("status, completion_status"),
      supabase.from("materials").select("id"),
      supabase.from("volunteer_requests").select("id"),
      supabase.from("donations").select("amount"),
    ]);
    setPendingProjects(pp || []);
    setPendingMaterials(pm || []);
    const map: Record<string, { count: number; project: any; reasons: string[] }> = {};
    (r || []).forEach((row: any) => {
      if (!row.projects) return;
      map[row.project_id] = map[row.project_id] || { count: 0, project: row.projects, reasons: [] };
      map[row.project_id].count++;
      map[row.project_id].reasons.push(row.reason);
    });
    setReported(Object.values(map).sort((a, b) => b.count - a.count));
    setCompletionReq(c || []);
    setUsers(u || []);
    setAdminIds(new Set((ar || []).map((x: any) => x.user_id)));

    setMetrics({
      activeProjects: (allP || []).filter((p) => p.status === "approved" && p.completion_status === "in_progress").length,
      completedProjects: (allP || []).filter((p) => p.completion_status === "completed").length,
      totalVolunteers: (allV || []).length,
      totalMaterials: (allM || []).length,
      totalRaised: (allD || []).reduce((acc, curr) => acc + (curr.amount || 0), 0),
      pendingReports: (r || []).length,
    });
  };

  useEffect(() => { if (isAdmin) reload(); }, [isAdmin]);

  if (loading) return null;
  if (!isAdmin) return <div className="min-h-screen flex flex-col"><Header /><main className="flex-1 grid place-items-center"><p>Acesso restrito a administradores.</p></main></div>;

  // Project actions
  const approveProject = async (id: string) => { await supabase.from("projects").update({ status: "approved" }).eq("id", id); toast.success("Aprovado"); reload(); };
  const rejectProject = async (id: string, reason: string) => {
    if (!reason) return toast.error("Informe o motivo.");
    await supabase.from("projects").update({ status: "rejected", rejection_reason: reason }).eq("id", id);
    toast.success("Reprovado"); reload();
  };
  const disable = async (id: string) => { await supabase.from("projects").update({ status: "disabled" }).eq("id", id); toast.success("Desabilitado"); reload(); };

  // Material actions
  const approveMaterial = async (id: string) => { await supabase.from("materials").update({ status: "approved" }).eq("id", id); toast.success("Aprovado"); reload(); };
  const rejectMaterial = async (id: string, reason: string) => {
    if (!reason) return toast.error("Informe o motivo.");
    await supabase.from("materials").update({ status: "rejected", rejection_reason: reason }).eq("id", id);
    toast.success("Reprovado"); reload();
  };

  // Completion
  const approveCompletion = async (proj: any) => {
    await supabase.from("projects").update({ completion_status: "completed" }).eq("id", proj.id);
    const { data: vols } = await supabase.from("volunteer_requests").select("user_id").eq("project_id", proj.id);
    if (vols && vols.length) await supabase.from("certificates").insert(vols.map((v: any) => ({ project_id: proj.id, user_id: v.user_id })));
    toast.success("Concluído e certificados emitidos!"); reload();
  };
  const rejectCompletion = async (id: string) => { await supabase.from("projects").update({ completion_status: "completion_rejected" }).eq("id", id); reload(); };

  // Users
  const promote = async (uid: string) => {
    const { error } = await supabase.from("user_roles").insert({ user_id: uid, role: "admin" });
    if (error) return toast.error(error.message);
    toast.success("Promovido"); reload();
  };
  const promoteByName = async () => {
    const u = users.find((x) => x.display_name?.toLowerCase() === promoteEmail.toLowerCase() || x.id === promoteEmail);
    if (!u) return toast.error("Usuário não encontrado.");
    promote(u.id); setPromoteEmail("");
  };

  const filteredProjects = useMemo(() => pendingProjects.filter((p) => !search.projects || p.name.toLowerCase().includes(search.projects.toLowerCase())), [pendingProjects, search.projects]);
  const filteredMaterials = useMemo(() => pendingMaterials.filter((m) => !search.materials || m.name.toLowerCase().includes(search.materials.toLowerCase())), [pendingMaterials, search.materials]);
  const filteredUsers = useMemo(() => users.filter((u) => !search.users || u.display_name?.toLowerCase().includes(search.users.toLowerCase()) || u.id.includes(search.users)), [users, search.users]);

  const ProjectCard = ({ p }: { p: any }) => {
    const owner = users.find((u) => u.id === p.owner_id);
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-wrap gap-4 justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-lg">{p.name}</h3>
            <p className="text-sm text-primary">{p.improvement_type}</p>
            <p className="text-sm text-muted-foreground inline-flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" />{p.location}</p>
            <p className="text-xs text-muted-foreground mt-1">Autor: {owner?.display_name || p.owner_id}</p>
            <p className="mt-3 text-sm whitespace-pre-wrap">{p.description}</p>
          </div>
          <div className="flex flex-col items-end gap-2 self-start">
            <Link to="/projects/$id" params={{ id: p.id }} className="text-xs text-primary hover:underline">Ver página completa</Link>
            <Button size="sm" variant="outline" asChild className="h-7 text-xs">
              <Link to="/projects/$id/edit" params={{ id: p.id }}>Editar Projeto</Link>
            </Button>
          </div>
        </div>
        {p.images?.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
            {p.images.map((u: string) => <img key={u} src={u} alt="" className="aspect-video w-full object-cover rounded" />)}
          </div>
        )}
        <div className="mt-3 flex gap-2">
          <Button size="sm" onClick={() => approveProject(p.id)}>Aprovar</Button>
          <Button 
            size="sm" 
            variant="destructive" 
            onClick={() => {
              setRejectingProject(p);
              setRejectionReason("");
            }}
          >
            Reprovar
          </Button>
        </div>
      </div>
    );
  };

  const MaterialCard = ({ m }: { m: any }) => {
    const owner = users.find((u) => u.id === m.owner_id);
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-wrap gap-4 justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-lg">{m.name}</h3>
            <p className="text-sm text-muted-foreground inline-flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" />{m.location}</p>
            <p className="text-xs text-muted-foreground mt-1">Autor: {owner?.display_name || m.owner_id} · Quantidade: {m.quantity}</p>
            <p className="mt-3 text-sm whitespace-pre-wrap">{m.description}</p>
            <p className="mt-1 text-xs text-muted-foreground">Contato: {m.contact_info}</p>
          </div>
        </div>
        {m.images?.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
            {m.images.map((u: string) => <img key={u} src={u} alt="" className="aspect-video w-full object-cover rounded" />)}
          </div>
        )}
        <div className="mt-3 flex gap-2">
          <Button size="sm" onClick={() => approveMaterial(m.id)}>Aprovar</Button>
          <Button 
            size="sm" 
            variant="destructive" 
            onClick={() => {
              setRejectingMaterial(m);
              setRejectionReason("");
            }}
          >
            Reprovar
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Painel de Administração</h1>
        <Tabs defaultValue="metrics">
          <TabsList className="flex-wrap h-auto mb-6">
            <TabsTrigger value="metrics" className="gap-2"><BarChart3 className="h-4 w-4" /> Métricas</TabsTrigger>
            <TabsTrigger value="projects">Projetos ({pendingProjects.length})</TabsTrigger>
            <TabsTrigger value="materials">Materiais ({pendingMaterials.length})</TabsTrigger>
            <TabsTrigger value="reports">Denúncias ({reported.length})</TabsTrigger>
            <TabsTrigger value="completion">Conclusões ({completionReq.length})</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-3 text-primary mb-2">
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Ativos</span>
                </div>
                <p className="text-3xl font-bold">{metrics.activeProjects}</p>
                <p className="text-xs text-muted-foreground mt-1">Projetos em andamento</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-3 text-green-600 mb-2">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Concluídos</span>
                </div>
                <p className="text-3xl font-bold">{metrics.completedProjects}</p>
                <p className="text-xs text-muted-foreground mt-1">Impacto total realizado</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-3 text-blue-600 mb-2">
                  <Users className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Voluntários</span>
                </div>
                <p className="text-3xl font-bold">{metrics.totalVolunteers}</p>
                <p className="text-xs text-muted-foreground mt-1">Solicitações totais</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-3 text-orange-600 mb-2">
                  <Package className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Materiais</span>
                </div>
                <p className="text-3xl font-bold">{metrics.totalMaterials}</p>
                <p className="text-xs text-muted-foreground mt-1">Doações cadastradas</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-3 text-emerald-600 mb-2">
                  <Wallet className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Arrecadado</span>
                </div>
                <p className="text-2xl font-bold">R$ {metrics.totalRaised.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-1">Total via plataforma</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-3 text-destructive mb-2">
                  <Flag className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Denúncias</span>
                </div>
                <p className="text-3xl font-bold">{metrics.pendingReports}</p>
                <p className="text-xs text-muted-foreground mt-1">Registros totais</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4 mt-4">
            <Input placeholder="Pesquisar projetos..." value={search.projects} onChange={(e) => setSearch({ ...search, projects: e.target.value })} className="max-w-md" />
            {filteredProjects.map((p) => <ProjectCard key={p.id} p={p} />)}
            {filteredProjects.length === 0 && <p className="text-muted-foreground">Sem projetos pendentes.</p>}
          </TabsContent>

          <TabsContent value="materials" className="space-y-4 mt-4">
            <Input placeholder="Pesquisar materiais..." value={search.materials} onChange={(e) => setSearch({ ...search, materials: e.target.value })} className="max-w-md" />
            {filteredMaterials.map((m) => <MaterialCard key={m.id} m={m} />)}
            {filteredMaterials.length === 0 && <p className="text-muted-foreground">Sem materiais pendentes.</p>}
          </TabsContent>

          <TabsContent value="reports" className="space-y-4 mt-4">
            {reported.map((r: any) => (
              <div key={r.project.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <Link to="/projects/$id" params={{ id: r.project.id }} className="font-semibold hover:underline">{r.project.name}</Link>
                    <p className="text-sm text-destructive">{r.count} denúncia(s)</p>
                  </div>
                  <Button size="sm" variant="destructive" onClick={() => disable(r.project.id)}>Desabilitar</Button>
                </div>
                <ul className="mt-3 space-y-1 text-sm text-muted-foreground list-disc pl-5">
                  {r.reasons.map((reason: string, i: number) => <li key={i}>{reason}</li>)}
                </ul>
              </div>
            ))}
            {reported.length === 0 && <p className="text-muted-foreground">Sem denúncias.</p>}
          </TabsContent>

          <TabsContent value="completion" className="space-y-4 mt-4">
            {completionReq.map((p) => (
              <div key={p.id} className="rounded-xl border border-border bg-card p-5 flex items-center justify-between">
                <div><Link to="/projects/$id" params={{ id: p.id }} className="font-semibold hover:underline">{p.name}</Link><p className="text-sm text-muted-foreground">{p.location}</p></div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => approveCompletion(p)}>Aprovar</Button>
                  <Button size="sm" variant="outline" onClick={() => rejectCompletion(p.id)}>Reprovar</Button>
                </div>
              </div>
            ))}
            {completionReq.length === 0 && <p className="text-muted-foreground">Sem conclusões pendentes.</p>}
          </TabsContent>

          <TabsContent value="users" className="mt-4 space-y-4">
            <div className="flex gap-2 max-w-xl">
              <Input placeholder="Promover por ID ou nome exato" value={promoteEmail} onChange={(e) => setPromoteEmail(e.target.value)} />
              <Button onClick={promoteByName}>Promover</Button>
            </div>
            <Input placeholder="Pesquisar usuários..." value={search.users} onChange={(e) => setSearch({ ...search, users: e.target.value })} className="max-w-md" />
            <div className="rounded-xl border border-border bg-card divide-y divide-border">
              {filteredUsers.map((u) => (
                <div key={u.id} className="p-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{u.display_name}</p>
                    <p className="text-xs text-muted-foreground font-mono truncate">{u.id}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {adminIds.has(u.id)
                      ? <span className="text-xs rounded-full bg-primary/15 text-primary px-2 py-0.5">admin</span>
                      : <Button size="sm" variant="outline" onClick={() => promote(u.id)}>Promover</Button>}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Rejection Dialog for Projects */}
        <Dialog open={!!rejectingProject} onOpenChange={(open) => !open && setRejectingProject(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reprovar Projeto</DialogTitle>
              <DialogDescription>
                Informe o motivo da reprovação para que o autor saiba o que precisa ser ajustado.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-2">
              <Label htmlFor="proj-rejection-reason">Motivo da Reprovação *</Label>
              <Textarea
                id="proj-rejection-reason"
                placeholder="Ex: Descrição insuficiente, imagens inadequadas..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRejectingProject(null)}>Cancelar</Button>
              <Button 
                variant="destructive" 
                disabled={!rejectionReason.trim()}
                onClick={() => {
                  rejectProject(rejectingProject.id, rejectionReason);
                  setRejectingProject(null);
                }}
              >
                Confirmar Reprovação
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Rejection Dialog for Materials */}
        <Dialog open={!!rejectingMaterial} onOpenChange={(open) => !open && setRejectingMaterial(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reprovar Doação de Material</DialogTitle>
              <DialogDescription>
                Informe o motivo da reprovação.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-2">
              <Label htmlFor="mat-rejection-reason">Motivo da Reprovação *</Label>
              <Textarea
                id="mat-rejection-reason"
                placeholder="Ex: Material não permitido, informações falsas..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRejectingMaterial(null)}>Cancelar</Button>
              <Button 
                variant="destructive" 
                disabled={!rejectionReason.trim()}
                onClick={() => {
                  rejectMaterial(rejectingMaterial.id, rejectionReason);
                  setRejectingMaterial(null);
                }}
              >
                Confirmar Reprovação
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
