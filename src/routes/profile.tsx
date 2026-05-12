import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { uploadImages } from "@/lib/upload";
import { toast } from "sonner";
import { Award, LogOut, Trash2 } from "lucide-react";

export const Route = createFileRoute("/profile")({ component: Profile });

function Profile() {
  const { user, signOut } = useAuth();
  const nav = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [certs, setCerts] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({ data }) => { setProfile(data); setName(data?.display_name || ""); });
    supabase.from("certificates").select("*, projects(name)").eq("user_id", user.id).then(({ data }) => setCerts(data || []));
  }, [user]);

  if (!user) return <div className="min-h-screen flex flex-col"><Header /><main className="flex-1 grid place-items-center"><p>Faça login.</p></main></div>;

  const save = async () => {
    let avatar_url = profile?.avatar_url;
    if (file) { const [u] = await uploadImages(user.id, [file]); avatar_url = u; }
    const { error } = await supabase.from("profiles").update({ display_name: name, avatar_url }).eq("id", user.id);
    if (error) return toast.error(error.message);
    toast.success("Perfil atualizado!");
    setProfile({ ...profile, display_name: name, avatar_url });
  };

  const deleteAccount = async () => {
    if (!confirm("Apagar sua conta? Esta ação é irreversível.")) return;
    // Best-effort: sign out (server-side full delete would need an edge function)
    await supabase.from("profiles").update({ display_name: "[Conta removida]", avatar_url: null }).eq("id", user.id);
    await signOut();
    toast.success("Conta desativada.");
    nav({ to: "/" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto max-w-3xl px-4 py-10 space-y-8">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-4">
            {profile?.avatar_url ? <img src={profile.avatar_url} alt="" className="h-20 w-20 rounded-full object-cover" /> : <div className="h-20 w-20 rounded-full bg-muted" />}
            <div>
              <h1 className="text-2xl font-bold">{profile?.display_name}</h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <div><Label>Nome</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div><Label>Foto de perfil</Label><Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} /></div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={save}>Salvar</Button>
              <Button variant="outline" onClick={() => signOut()}><LogOut className="h-4 w-4 mr-1" />Sair</Button>
              <Button variant="destructive" onClick={deleteAccount}><Trash2 className="h-4 w-4 mr-1" />Apagar conta</Button>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3 inline-flex items-center gap-2"><Award className="h-5 w-5 text-accent" />Certificados</h2>
          {certs.length === 0 ? <p className="text-muted-foreground text-sm">Nenhum certificado ainda.</p> : (
            <div className="grid sm:grid-cols-2 gap-4">
              {certs.map((c) => (
                <div key={c.id} className="rounded-xl border-2 border-accent/40 bg-gradient-to-br from-accent/10 to-primary/5 p-5">
                  <Award className="h-8 w-8 text-accent" />
                  <h3 className="mt-3 font-semibold">Certificado de Participação</h3>
                  <p className="text-sm text-muted-foreground">Projeto: {c.projects?.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">Emitido em {new Date(c.issued_at).toLocaleDateString("pt-BR")}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
