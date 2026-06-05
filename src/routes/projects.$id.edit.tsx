import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
import { AlertCircle, Calendar, Info, Users, Wallet, X } from "lucide-react";

export const Route = createFileRoute("/projects/$id/edit")({ component: EditProject });

const URGENCY_OPTIONS = ["Baixa", "Média", "Alta", "Emergencial"];
const INCOME_OPTIONS = [
  "Até 1 salário mínimo",
  "1 a 2 salários mínimos",
  "2 a 3 salários mínimos",
  "Mais de 3 salários mínimos",
  "Sem renda",
];

function EditProject() {
  const { id } = Route.useParams();
  const { user, isAdmin } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState<any>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setForm({
            ...data,
            name: data.name || "",
            description: data.description || "",
            improvement_type: data.improvement_type || "Telhado",
            location: data.location || "",
            urgency: data.urgency || "Média",
            beneficiary_name: data.beneficiary_name || "",
            beneficiary_residents: data.beneficiary_residents || 0,
            beneficiary_children: data.beneficiary_children || 0,
            beneficiary_income: data.beneficiary_income || "Até 1 salário mínimo",
            beneficiary_situation: data.beneficiary_situation || "",
            beneficiary_vulnerability: data.beneficiary_vulnerability || "",
            estimated_cost: data.estimated_cost || 0,
            financial_goal: data.financial_goal || 0,
            start_date: data.start_date || "",
            end_date: data.end_date || "",
            observations: data.observations || "",
            images: data.images || [],
          });
        } else {
          setNotFound(true);
        }
      });
  }, [id]);

  if (!user)
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 grid place-items-center">
          <p>Faça login.</p>
        </main>
      </div>
    );

  if (notFound)
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 grid place-items-center">
          <div className="text-center">
            <p className="text-xl font-semibold">Projeto não encontrado.</p>
            <Button variant="link" onClick={() => nav({ to: "/projects" })}>Voltar para projetos</Button>
          </div>
        </main>
      </div>
    );

  if (!form)
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 grid place-items-center">
          <p>Carregando...</p>
        </main>
      </div>
    );

  // Check permission
  if (user.id !== form.owner_id && !isAdmin)
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 grid place-items-center">
          <p>Você não tem permissão para editar este projeto.</p>
        </main>
      </div>
    );

  const removeImage = (url: string) =>
    setForm({ ...form, images: form.images.filter((u: string) => u !== url) });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let images = form.images || [];
      if (files.length) images = [...images, ...(await uploadImages(user.id, files))];
      const { error } = await supabase
        .from("projects")
        .update({
          name: form.name,
          description: form.description,
          improvement_type: form.improvement_type,
          location: form.location,
          urgency: form.urgency,
          beneficiary_name: form.beneficiary_name,
          beneficiary_residents: Number(form.beneficiary_residents),
          beneficiary_children: Number(form.beneficiary_children),
          beneficiary_income: form.beneficiary_income,
          beneficiary_situation: form.beneficiary_situation,
          beneficiary_vulnerability: form.beneficiary_vulnerability,
          estimated_cost: Number(form.estimated_cost),
          financial_goal: Number(form.financial_goal),
          start_date: form.start_date || null,
          end_date: form.end_date || null,
          observations: form.observations,
          images,
        })
        .eq("id", id);
      if (error) throw error;
      toast.success("Atualizado!");
      nav({ to: "/projects/$id", params: { id } });
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
        <h1 className="text-3xl font-bold mb-6">Editar projeto</h1>

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
                />
              </div>
              <div className="space-y-2">
                <Label>Imagens atuais</Label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {(form.images || []).map((u: string) => (
                    <div key={u} className="relative group">
                      <img src={u} alt="" className="aspect-video w-full object-cover rounded border border-border" />
                      <button
                        type="button"
                        onClick={() => removeImage(u)}
                        className="absolute top-1 right-1 bg-destructive/90 text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Adicionar novas imagens</Label>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setFiles(Array.from(e.target.files || []))}
                />
              </div>
            </TabsContent>

            <TabsContent value="beneficiary" className="space-y-4 mt-6 rounded-xl border border-border bg-card p-6">
              <div className="space-y-2">
                <Label htmlFor="b-name">Nome do responsável pela residência</Label>
                <Input
                  id="b-name"
                  value={form.beneficiary_name || ""}
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
                  value={form.beneficiary_income || ""}
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
                  value={form.beneficiary_situation || ""}
                  onChange={(e) => setForm({ ...form, beneficiary_situation: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="b-vul">Nível de vulnerabilidade social</Label>
                <Input
                  id="b-vul"
                  value={form.beneficiary_vulnerability || ""}
                  onChange={(e) => setForm({ ...form, beneficiary_vulnerability: e.target.value })}
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
                  value={form.observations || ""}
                  onChange={(e) => setForm({ ...form, observations: e.target.value })}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => nav({ to: "/projects/$id", params: { id } })}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="min-w-[150px]">
              {loading ? "Salvando..." : "Salvar alterações"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
