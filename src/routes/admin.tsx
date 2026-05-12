import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({ component: Admin });

function Admin() {
  const { isAdmin, loading } = useAuth();
  const [pending, setPending] = useState<any[]>([]);
  const [reported, setReported] = useState<any[]>([]);
  const [completionReq, setCompletionReq] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [promoteEmail, setPromoteEmail] = useState("");

  const reload = async () => {
    const { data: p } = await supabase.from("projects").select("*").eq("status", "pending").order("created_at");
    setPending(p || []);
    const { data: r } = await supabase.from("reports").select("project_id, projects(*)");
    const map: Record<string, { count: number; project: any }> = {};
    (r || []).forEach((row: any) => { if (!row.projects) return; map[row.project_id] = map[row.project_id] || { count: 0, project: row.projects }; map[row.project_id].count++; });
    setReported(Object.values(map).sort((a, b) => b.count - a.count));
    const { data: c } = await supabase.from("projects").select("*").eq("completion_status", "completion_requested");
    setCompletionReq(c || []);
    const { data: u } = await supabase.from("profiles").select("id, display_name");
    setUsers(u || []);
  };

  useEffect(() => { if (isAdmin) reload(); }, [isAdmin]);

  if (loading) return null;
  if (!isAdmin) return <div className="min-h-screen flex flex-col"><Header /><main className="flex-1 grid place-items-center"><p>Acesso restrito a administradores.</p></main></div>;

  const approve = async (id: string) => {
    await supabase.from("projects").update({ status: "approved" }).eq("id", id);
    toast.success("Aprovado"); reload();
  };
  const reject = async (id: string) => {
    const reason = reasons[id]; if (!reason) return toast.error("Informe o motivo.");
    await supabase.from("projects").update({ status: "rejected", rejection_reason: reason }).eq("id", id);
    toast.success("Reprovado"); reload();
  };
  const disable = async (id: string) => { await supabase.from("projects").update({ status: "disabled" }).eq("id", id); toast.success("Desabilitado"); reload(); };
  const approveCompletion = async (proj: any) => {
    await supabase.from("projects").update({ completion_status: "completed" }).eq("id", proj.id);
    // Issue certificates to all volunteers
    const { data: vols } = await supabase.from("volunteer_requests").select("user_id").eq("project_id", proj.id);
    if (vols && vols.length) {
      await supabase.from("certificates").insert(vols.map((v: any) => ({ project_id: proj.id, user_id: v.user_id })));
    }
    toast.success("Concluído e certificados emitidos!"); reload();
  };
  const rejectCompletion = async (id: string) => { await supabase.from("projects").update({ completion_status: "completion_rejected" }).eq("id", id); reload(); };

  const promoteUser = async () => {
    const u = users.find((x) => x.display_name?.toLowerCase() === promoteEmail.toLowerCase() || x.id === promoteEmail);
    if (!u) return toast.error("Usuário não encontrado (use ID ou display name).");
    const { error } = await supabase.from("user_roles").insert({ user_id: u.id, role: "admin" });
    if (error) return toast.error(error.message);
    toast.success("Usuário promovido a administrador!");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Painel de Administração</h1>
        <Tabs defaultValue="triagem">
          <TabsList>
            <TabsTrigger value="triagem">Triagem ({pending.length})</TabsTrigger>
            <TabsTrigger value="denuncias">Denúncias ({reported.length})</TabsTrigger>
            <TabsTrigger value="conclusao">Conclusões ({completionReq.length})</TabsTrigger>
            <TabsTrigger value="acessos">Acessos</TabsTrigger>
          </TabsList>

          <TabsContent value="triagem" className="space-y-4 mt-4">
            {pending.map((p) => (
              <div key={p.id} className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-sm text-muted-foreground">{p.improvement_type} — {p.location}</p>
                <p className="mt-2 text-sm">{p.description}</p>
                <Textarea placeholder="Motivo (caso reprovar)" value={reasons[p.id] || ""} onChange={(e) => setReasons({ ...reasons, [p.id]: e.target.value })} className="mt-3" />
                <div className="mt-3 flex gap-2">
                  <Button size="sm" onClick={() => approve(p.id)}>Aprovar</Button>
                  <Button size="sm" variant="destructive" onClick={() => reject(p.id)}>Reprovar</Button>
                </div>
              </div>
            ))}
            {pending.length === 0 && <p className="text-muted-foreground">Sem projetos pendentes.</p>}
          </TabsContent>

          <TabsContent value="denuncias" className="space-y-4 mt-4">
            {reported.map((r: any) => (
              <div key={r.project.id} className="rounded-xl border border-border bg-card p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{r.project.name}</h3>
                  <p className="text-sm text-destructive">{r.count} denúncia(s)</p>
                </div>
                <Button size="sm" variant="destructive" onClick={() => disable(r.project.id)}>Desabilitar</Button>
              </div>
            ))}
            {reported.length === 0 && <p className="text-muted-foreground">Sem denúncias.</p>}
          </TabsContent>

          <TabsContent value="conclusao" className="space-y-4 mt-4">
            {completionReq.map((p) => (
              <div key={p.id} className="rounded-xl border border-border bg-card p-5 flex items-center justify-between">
                <div><h3 className="font-semibold">{p.name}</h3><p className="text-sm text-muted-foreground">{p.location}</p></div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => approveCompletion(p)}>Aprovar conclusão</Button>
                  <Button size="sm" variant="outline" onClick={() => rejectCompletion(p.id)}>Reprovar</Button>
                </div>
              </div>
            ))}
            {completionReq.length === 0 && <p className="text-muted-foreground">Sem conclusões pendentes.</p>}
          </TabsContent>

          <TabsContent value="acessos" className="mt-4 space-y-3">
            <p className="text-sm text-muted-foreground">Promover usuário a administrador (informe o ID ou nome de exibição exato).</p>
            <div className="flex gap-2 max-w-xl">
              <Input placeholder="ID ou nome do usuário" value={promoteEmail} onChange={(e) => setPromoteEmail(e.target.value)} />
              <Button onClick={promoteUser}>Promover</Button>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Usuários</h3>
              <ul className="text-sm space-y-1">
                {users.map((u) => <li key={u.id} className="font-mono text-xs">{u.id} — {u.display_name}</li>)}
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
