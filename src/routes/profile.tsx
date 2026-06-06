import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import { uploadImages } from "@/lib/upload";
import { toast } from "sonner";
import { Award, Info, LogOut, MapPin, QrCode, Trash2 } from "lucide-react";

export const Route = createFileRoute("/profile")({ component: Profile });

const BR_PHONE_REGEX = /^\(\d{2}\) \d{5}-\d{4}$/;

function applyPhoneMask(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function applyCpfMask(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function applyCnpjMask(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  return digits
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

const PIX_TYPES = [
  { value: "cpf", label: "CPF" },
  { value: "cnpj", label: "CNPJ" },
  { value: "email", label: "E-mail" },
  { value: "phone", label: "Telefone" },
  { value: "random", label: "Chave aleatória" },
];

const BR_STATES = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

function Profile() {
  const { user, signOut } = useAuth();
  const nav = useNavigate();
  const [profile, setProfile] = useState<any>(null);

  // Personal info
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Address
  const [zip, setZip] = useState("");
  const [zipLoading, setZipLoading] = useState(false);
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  // PIX
  const [pixType, setPixType] = useState("");
  const [pixKey, setPixKey] = useState("");

  // Professional / Volunteer
  const [profession, setProfession] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [professionalRegister, setProfessionalRegister] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [vCity, setVCity] = useState("");
  const [availability, setAvailability] = useState("");

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        setProfile(data);
        setName(data.display_name || "");
        setBirthDate(data.birth_date || "");
        setPhone(data.phone ? applyPhoneMask(data.phone) : "");
        setZip(data.address_zip || "");
        setStreet(data.address_street || "");
        setNumber(data.address_number || "");
        setComplement(data.address_complement || "");
        setNeighborhood(data.address_neighborhood || "");
        setCity(data.address_city || "");
        setState(data.address_state || "");
        setPixType(data.pix_key_type || "");
        
        let initialPix = data.pix_key || "";
        if (data.pix_key_type === "cpf") initialPix = applyCpfMask(initialPix);
        else if (data.pix_key_type === "cnpj") initialPix = applyCnpjMask(initialPix);
        else if (data.pix_key_type === "phone") initialPix = applyPhoneMask(initialPix);
        setPixKey(initialPix);
        // New professional fields
        setProfession(data.profession || "");
        setSpecialty(data.specialty || "");
        setProfessionalRegister(data.professional_register || "");
        setExperienceYears(data.experience_years?.toString() || "");
        setVCity(data.city || "");
        setAvailability(data.availability || "");
      });

    supabase
      .from("certificates")
      .select("*, projects(name)")
      .eq("user_id", user.id)
      .then(({ data }) => setCerts(data || []));
  }, [user]);

  const [certs, setCerts] = useState<any[]>([]);

  if (!user)
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 grid place-items-center">
          <p>Faça login.</p>
        </main>
      </div>
    );

  const savePersonal = async () => {
    if (phone && !BR_PHONE_REGEX.test(phone)) {
      return toast.error("Telefone inválido. Use o formato (XX) XXXXX-XXXX.");
    }
    try {
      let avatar_url = profile?.avatar_url ?? null;
      if (file) {
        const [u] = await uploadImages(user.id, [file]);
        avatar_url = u;
      }
      const { data, error } = await supabase
        .from("profiles")
        .update({
          display_name: name,
          avatar_url,
          birth_date: birthDate || null,
          phone: phone || null,
        })
        .eq("id", user.id)
        .select()
        .single();
      if (error) {
        console.error("[savePersonal]", error);
        return toast.error(error.message);
      }
      if (!data) return toast.error("Nenhuma linha foi atualizada. Verifique sua sessão.");
      toast.success("Informações pessoais salvas!");
      setProfile(data);
    } catch (e: any) {
      console.error("[savePersonal] unexpected:", e);
      toast.error(e?.message ?? "Erro inesperado ao salvar.");
    }
  };

  const saveAddress = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          address_zip: zip || null,
          address_street: street || null,
          address_number: number || null,
          address_complement: complement || null,
          address_neighborhood: neighborhood || null,
          address_city: city || null,
          address_state: state || null,
        })
        .eq("id", user.id)
        .select()
        .single();
      if (error) {
        console.error("[saveAddress]", error);
        return toast.error(error.message);
      }
      if (!data) return toast.error("Nenhuma linha foi atualizada. Verifique sua sessão.");
      toast.success("Endereço salvo!");
    } catch (e: any) {
      console.error("[saveAddress] unexpected:", e);
      toast.error(e?.message ?? "Erro inesperado ao salvar.");
    }
  };

  const savePix = async () => {
    if (pixKey && !pixType) {
      return toast.error("Selecione o tipo da chave PIX.");
    }
    
    if (pixKey) {
      const digits = pixKey.replace(/\D/g, "");
      if (pixType === "cpf" && digits.length !== 11) {
        return toast.error("CPF deve ter 11 dígitos.");
      }
      if (pixType === "cnpj" && digits.length !== 14) {
        return toast.error("CNPJ deve ter 14 dígitos.");
      }
      if (pixType === "phone" && digits.length !== 11) {
        return toast.error("Telefone deve ter 11 dígitos (incluindo DDD).");
      }
      if (pixType === "email" && !pixKey.includes("@")) {
        return toast.error("E-mail inválido.");
      }
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({ pix_key: pixKey || null, pix_key_type: pixType || null })
        .eq("id", user.id)
        .select()
        .single();
      if (error) {
        console.error("[savePix]", error);
        return toast.error(error.message);
      }
      if (!data) return toast.error("Nenhuma linha foi atualizada. Verifique sua sessão.");
      toast.success("Chave PIX salva!");
    } catch (e: any) {
      console.error("[savePix] unexpected:", e);
      toast.error(e?.message ?? "Erro inesperado ao salvar.");
    }
  };

  const saveProfessional = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          profession: profession || null,
          specialty: specialty || null,
          professional_register: professionalRegister || null,
          experience_years: experienceYears ? Number(experienceYears) : null,
          city: vCity || null,
          availability: availability || null,
        })
        .eq("id", user.id)
        .select()
        .single();
      if (error) {
        console.error("[saveProfessional]", error);
        return toast.error(error.message);
      }
      if (!data) return toast.error("Nenhuma linha foi atualizada. Verifique sua sessão.");
      toast.success("Perfil profissional salvo!");
    } catch (e: any) {
      console.error("[saveProfessional] unexpected:", e);
      toast.error(e?.message ?? "Erro inesperado ao salvar.");
    }
  };

  const handleZipChange = async (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 8);
    const masked = digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
    setZip(masked);
    if (digits.length !== 8) return;
    setZipLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const json = await res.json();
      if (json.erro) { toast.error("CEP não encontrado."); return; }
      setStreet(json.logradouro || "");
      setNeighborhood(json.bairro || "");
      setCity(json.localidade || "");
      setState(json.uf || "");
    } catch {
      toast.error("Erro ao buscar CEP. Tente novamente.");
    } finally {
      setZipLoading(false);
    }
  };

  const deleteAccount = async () => {
    if (!confirm("Apagar sua conta? Esta ação é irreversível.")) return;
    await supabase
      .from("profiles")
      .update({ display_name: "[Conta removida]", avatar_url: null })
      .eq("id", user.id);
    await signOut();
    toast.success("Conta desativada.");
    nav({ to: "/" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto max-w-3xl px-4 py-10 space-y-8">
        {/* Avatar header */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-4">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt=""
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-muted" />
            )}
            <div>
              <h1 className="text-2xl font-bold">{profile?.display_name}</h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => signOut()}>
              <LogOut className="h-4 w-4 mr-1" />
              Sair
            </Button>
            <Button variant="destructive" size="sm" onClick={deleteAccount}>
              <Trash2 className="h-4 w-4 mr-1" />
              Apagar conta
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="personal">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="personal">Pessoal</TabsTrigger>
            <TabsTrigger value="address">Endereço</TabsTrigger>
            <TabsTrigger value="pix">PIX</TabsTrigger>
            <TabsTrigger value="professional">Profissional</TabsTrigger>
            <TabsTrigger value="certs">Certificados</TabsTrigger>
          </TabsList>

          {/* ── Informações Pessoais ── */}
          <TabsContent value="personal" className="mt-6 space-y-4 rounded-xl border border-border bg-card p-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="name">Nome de exibição</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="birth">Data de nascimento</Label>
                <Input
                  id="birth"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone">Telefone / WhatsApp</Label>
                <Input
                  id="phone"
                  placeholder="(XX) XXXXX-XXXX"
                  value={phone}
                  onChange={(e) => setPhone(applyPhoneMask(e.target.value))}
                  maxLength={15}
                  inputMode="numeric"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="avatar">Foto de perfil</Label>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>
              <Button onClick={savePersonal}>Salvar informações</Button>
            </div>
          </TabsContent>

          {/* ── Endereço ── */}
          <TabsContent value="address" className="mt-6 space-y-4 rounded-xl border border-border bg-card p-6">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground rounded-lg bg-muted/60 px-3 py-2">
                Seu endereço é <strong>privado</strong> e somente será exibido para usuários que
                façam doação de frete.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="zip">CEP</Label>
                  <div className="relative">
                    <Input
                      id="zip"
                      placeholder="00000-000"
                      value={zip}
                      onChange={(e) => handleZipChange(e.target.value)}
                      maxLength={9}
                      inputMode="numeric"
                      disabled={zipLoading}
                    />
                    {zipLoading && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground animate-pulse">
                        Buscando…
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="state">Estado</Label>
                  <select
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="">Selecione</option>
                    {BR_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="street">Rua / Logradouro</Label>
                <Input id="street" value={street} onChange={(e) => setStreet(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="number">Número</Label>
                  <Input id="number" value={number} onChange={(e) => setNumber(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="complement">Complemento</Label>
                  <Input
                    id="complement"
                    placeholder="Apto, sala…"
                    value={complement}
                    onChange={(e) => setComplement(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="neighborhood">Bairro</Label>
                  <Input
                    id="neighborhood"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="city">Cidade</Label>
                  <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
              </div>
              <Button onClick={saveAddress}>Salvar endereço</Button>
            </div>
          </TabsContent>

          {/* ── PIX ── */}
          <TabsContent value="pix" className="mt-6 space-y-4 rounded-xl border border-border bg-card p-6">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground rounded-lg bg-muted/60 px-3 py-2">
                Sua chave PIX será usada para receber doações nos seus projetos.
              </p>
              <div className="space-y-1">
                <Label htmlFor="pixType">Tipo da chave PIX</Label>
                <select
                  id="pixType"
                  value={pixType}
                  onChange={(e) => {
                    setPixType(e.target.value);
                    setPixKey(""); // Clear key when type changes to avoid invalid formats
                  }}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">Selecione</option>
                  {PIX_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="pixKey">Chave PIX</Label>
                <Input
                  id="pixKey"
                  placeholder={
                    pixType === "cpf"
                      ? "000.000.000-00"
                      : pixType === "cnpj"
                        ? "00.000.000/0000-00"
                        : pixType === "email"
                          ? "seu@email.com"
                          : pixType === "phone"
                            ? "(XX) XXXXX-XXXX"
                            : pixType === "random"
                              ? "Chave aleatória (32 caracteres)"
                              : "Selecione o tipo acima"
                  }
                  value={pixKey}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (pixType === "cpf") val = applyCpfMask(val);
                    else if (pixType === "cnpj") val = applyCnpjMask(val);
                    else if (pixType === "phone") val = applyPhoneMask(val);
                    setPixKey(val);
                  }}
                />
              </div>
              <Button onClick={savePix}>Salvar PIX</Button>
            </div>
          </TabsContent>

          {/* ── Profissional ── */}
          <TabsContent value="professional" className="mt-6 space-y-4 rounded-xl border border-border bg-card p-6">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground rounded-lg bg-muted/60 px-3 py-2">
                Preencha seu perfil profissional para que os donos de projetos saibam suas habilidades ao se voluntariar.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="prof">Profissão</Label>
                  <Input id="prof" placeholder="Ex: Pedreiro, Engenheiro..." value={profession} onChange={(e) => setProfession(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="spec">Especialidade</Label>
                  <Input id="spec" placeholder="Ex: Alvenaria, Elétrica..." value={specialty} onChange={(e) => setSpecialty(e.target.value)} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="reg">Registro Profissional (CREA, CAU, etc.)</Label>
                  <Input id="reg" value={professionalRegister} onChange={(e) => setProfessionalRegister(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="exp">Anos de experiência</Label>
                  <Input id="exp" type="number" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="vcity">Cidade de atuação</Label>
                <Input id="vcity" value={vCity} onChange={(e) => setVCity(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="avail">Disponibilidade</Label>
                <Input id="avail" placeholder="Ex: Fins de semana, Noite..." value={availability} onChange={(e) => setAvailability(e.target.value)} />
              </div>
              <Button onClick={saveProfessional}>Salvar perfil profissional</Button>
            </div>
          </TabsContent>

          {/* ── Certificados ── */}
          <TabsContent value="certs" className="mt-6 space-y-4 rounded-xl border border-border bg-card p-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Award className="h-5 w-5 text-accent" />
                Seus Certificados
              </h2>
              {certs.length === 0 ? (
                <p className="text-muted-foreground text-sm italic">Nenhum certificado emitido até o momento.</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {certs.map((c) => (
                    <div
                      key={c.id}
                      className="rounded-xl border-2 border-accent/40 bg-gradient-to-br from-accent/10 to-primary/5 p-5"
                    >
                      <Award className="h-8 w-8 text-accent" />
                      <h3 className="mt-3 font-semibold">Certificado de Participação</h3>
                      <p className="text-sm text-muted-foreground">Projeto: {c.projects?.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Emitido em {new Date(c.issued_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
