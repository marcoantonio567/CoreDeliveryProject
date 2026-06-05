import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import { uploadImages } from "@/lib/upload";
import { toast } from "sonner";
import { AlertCircle, Calendar, Info, Users, Wallet } from "lucide-react";

export const Route = createFileRoute("/projects/new")({ component: NewProject });

const URGENCY_OPTIONS = ["Baixa", "Média", "Alta", "Emergencial"];
const INCOME_OPTIONS = ["Até 1 salário mínimo", "1 a 2 salários mínimos", "2 a 3 salários mínimos", "Mais de 3 salários mínimos", "Sem renda"];

function NewProject() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    improvement_type: "Telhado",
    location: "",
    urgency: "Média",
    beneficiary_name: "",
    beneficiary_residents: 0,
    beneficiary_children: 0,
    beneficiary_income: "Até 1 salário mínimo",
    beneficiary_situation: "",
    beneficiary_vulnerability: "",
    estimated_cost: 0,
    financial_goal: 0,
    start_date: "",
    end_date: "",
    observations: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  if (!user)
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 grid place-items-center">
          <p>Faça login para criar projetos.</p>
        </main>
      </div>
    );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const images = files.length ? await uploadImages(user.id, files) : [];
      const { error } = await supabase.from("projects").insert({
        ...form,
        owner_id: user.id,
        images,
        beneficiary_residents: Number(form.beneficiary_residents),
        beneficiary_children: Number(form.beneficiary_children),
        estimated_cost: Number(form.estimated_cost),
        financial_goal: Number(form.financial_goal),
        start_date: form.start_date || null,
        end_date: form.end_date || null,
      });
      if (error) throw error;
      toast.success("Projeto criado! Aguardando aprovação do administrador.");
      nav({ to: "/projects" });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Novo projeto</h1>

        <form onSubmit={submit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic" className="gap-2">
                <Info className="h-4 w-4" />
                Básico
              </TabsTrigger>
              <TabsTrigger value="beneficiary" className="gap-2">
                <Users className="h-4 w-4" />
                Beneficiário
              </TabsTrigger>
              <TabsTrigger value="planning" className="gap-2">
                <Wallet className="h-4 w-4" />
                Planejamento
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-6 rounded-xl border border-border bg-card p-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Projeto</Label>
                <Input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex: Reforma do telhado da Dona Maria"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Descrição detalhada</Label>
                <Textarea
                  id="desc"
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Descreva o que será feito e o impacto esperado..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de melhoria</Label>
                  <select
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                    value={form.improvement_type}
                    onChange={(e) => setForm({ ...form, improvement_type: e.target.value })}
                  >
                    {["Telhado", "Banheiro", "Estrutura", "Cozinha", "Hidráulica", "Elétrica", "Outro"].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Grau de Urgência</Label>
                  <select
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                    value={form.urgency}
                    onChange={(e) => setForm({ ...form, urgency: e.target.value })}
                  >
                    {URGENCY_OPTIONS.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="loc">Localização (Bairro/Cidade)</Label>
                <Input
                  id="loc"
                  required
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="Ex: Vila Nova, São Paulo - SP"
                />
              </div>
              <div className="space-y-2">
                <Label>Imagens do local atual</Label>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setFiles(Array.from(e.target.files || []))}
                />
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> Selecione fotos que mostrem a necessidade da reforma.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="beneficiary" className="space-y-4 mt-6 rounded-xl border border-border bg-card p-6">
              <div className="space-y-2">
                <Label htmlFor="b-name">Nome do responsável pela residência</Label>
                <Input
                  id="b-name"
                  value={form.beneficiary_name}
                  onChange={(e) => setForm({ ...form, beneficiary_name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="b-res">Total de moradores</Label>
                  <Input
                    id="b-res"
                    type="number"
                    min={0}
                    value={form.beneficiary_residents}
                    onChange={(e) => setForm({ ...form, beneficiary_residents: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="b-kids">Quantidade de crianças</Label>
                  <Input
                    id="b-kids"
                    type="number"
                    min={0}
                    value={form.beneficiary_children}
                    onChange={(e) => setForm({ ...form, beneficiary_children: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Faixa de renda familiar</Label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                  value={form.beneficiary_income}
                  onChange={(e) => setForm({ ...form, beneficiary_income: e.target.value })}
                >
                  {INCOME_OPTIONS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="b-sit">Relato da situação habitacional</Label>
                <Textarea
                  id="b-sit"
                  rows={3}
                  value={form.beneficiary_situation}
                  onChange={(e) => setForm({ ...form, beneficiary_situation: e.target.value })}
                  placeholder="Descreva as condições atuais da moradia..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="b-vul">Nível de vulnerabilidade social</Label>
                <Input
                  id="b-vul"
                  value={form.beneficiary_vulnerability}
                  onChange={(e) => setForm({ ...form, beneficiary_vulnerability: e.target.value })}
                  placeholder="Ex: Família em situação de risco, falta de saneamento..."
                />
              </div>
            </TabsContent>

            <TabsContent value="planning" className="space-y-4 mt-6 rounded-xl border border-border bg-card p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cost">Valor estimado da obra (R$)</Label>
                  <Input
                    id="cost"
                    type="number"
                    min={0}
                    value={form.estimated_cost}
                    onChange={(e) => setForm({ ...form, estimated_cost: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal">Meta de arrecadação (R$)</Label>
                  <Input
                    id="goal"
                    type="number"
                    min={0}
                    value={form.financial_goal}
                    onChange={(e) => setForm({ ...form, financial_goal: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start" className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" /> Previsão de Início
                  </Label>
                  <Input
                    id="start"
                    type="date"
                    value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end" className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" /> Previsão de Conclusão
                  </Label>
                  <Input
                    id="end"
                    type="date"
                    value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="obs">Observações adicionais</Label>
                <Textarea
                  id="obs"
                  rows={3}
                  value={form.observations}
                  onChange={(e) => setForm({ ...form, observations: e.target.value })}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => nav({ to: "/projects" })}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="min-w-[150px]">
              {loading ? "Criando..." : "Criar projeto"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
