import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/Header";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({ component: Signup });

function Signup() {
  const nav = useNavigate();
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { display_name: name }, emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Conta criada!");
    nav({ to: "/" });
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 grid place-items-center px-4 py-12">
        <form onSubmit={onSubmit} className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-sm space-y-4">
          <h1 className="text-2xl font-bold">Criar conta</h1>
          <div className="space-y-2"><Label>Nome</Label><Input required value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="space-y-2"><Label>E-mail</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div className="space-y-2"><Label>Senha</Label><Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Criando..." : "Cadastrar"}</Button>
          <p className="text-sm text-center text-muted-foreground">Já tem conta? <Link to="/login" className="text-primary hover:underline">Entrar</Link></p>
        </form>
      </main>
    </div>
  );
}
