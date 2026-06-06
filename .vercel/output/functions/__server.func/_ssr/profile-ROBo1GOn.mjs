import { r as reactExports, j as jsxRuntimeExports } from '../_libs/react.mjs';
import { e as useNavigate } from '../_libs/tanstack__react-router.mjs';
import { u as useAuth, s as supabase, B as Button, I as Input } from './router-BVHoRukv.mjs';
import { H as Header } from './Header-DOxXZI1d.mjs';
import { L as Label } from './label-xAhoNQXm.mjs';
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from './tabs-B-ohzito.mjs';
import { u as uploadImages } from './upload-CaC8vadG.mjs';
import { t as toast } from '../_libs/sonner.mjs';
import { e as LogOut, T as Trash2, A as Award } from '../_libs/lucide-react.mjs';
import '../_libs/tanstack__router-core.mjs';
import '../_libs/tanstack__history.mjs';
import '../_libs/cookie-es.mjs';
import '../_libs/seroval.mjs';
import '../_libs/seroval-plugins.mjs';
import 'node:stream/web';
import 'node:stream';
import '../_libs/react-dom.mjs';
import 'util';
import 'crypto';
import 'async_hooks';
import 'stream';
import '../_libs/isbot.mjs';
import '../_libs/tanstack__query-core.mjs';
import '../_libs/tanstack__react-query.mjs';
import '../_libs/supabase__supabase-js.mjs';
import '../_libs/supabase__postgrest-js.mjs';
import '../_libs/supabase__realtime-js.mjs';
import '../_libs/supabase__phoenix.mjs';
import '../_libs/supabase__storage-js.mjs';
import '../_libs/iceberg-js.mjs';
import '../_libs/supabase__auth-js.mjs';
import 'tslib';
import '../_libs/supabase__functions-js.mjs';
import '../_libs/radix-ui__react-slot.mjs';
import '../_libs/radix-ui__react-compose-refs.mjs';
import '../_libs/class-variance-authority.mjs';
import '../_libs/clsx.mjs';
import '../_libs/tailwind-merge.mjs';
import '../_libs/radix-ui__react-separator.mjs';
import '../_libs/radix-ui__react-primitive.mjs';
import '../_libs/radix-ui__react-dialog.mjs';
import '../_libs/radix-ui__primitive.mjs';
import '../_libs/radix-ui__react-context.mjs';
import '../_libs/radix-ui__react-id.mjs';
import '../_libs/@radix-ui/react-use-layout-effect+[...].mjs';
import '../_libs/@radix-ui/react-use-controllable-state+[...].mjs';
import '../_libs/@radix-ui/react-dismissable-layer+[...].mjs';
import '../_libs/@radix-ui/react-use-callback-ref+[...].mjs';
import '../_libs/@radix-ui/react-use-escape-keydown+[...].mjs';
import '../_libs/radix-ui__react-focus-scope.mjs';
import '../_libs/radix-ui__react-portal.mjs';
import '../_libs/radix-ui__react-presence.mjs';
import '../_libs/radix-ui__react-focus-guards.mjs';
import '../_libs/react-remove-scroll.mjs';
import '../_libs/react-remove-scroll-bar.mjs';
import '../_libs/react-style-singleton.mjs';
import '../_libs/get-nonce.mjs';
import '../_libs/use-sidecar.mjs';
import '../_libs/use-callback-ref.mjs';
import '../_libs/aria-hidden.mjs';
import '../_libs/radix-ui__react-tooltip.mjs';
import '../_libs/radix-ui__react-popper.mjs';
import '../_libs/floating-ui__react-dom.mjs';
import '../_libs/floating-ui__dom.mjs';
import '../_libs/floating-ui__core.mjs';
import '../_libs/floating-ui__utils.mjs';
import '../_libs/radix-ui__react-arrow.mjs';
import '../_libs/radix-ui__react-use-size.mjs';
import '../_libs/@radix-ui/react-visually-hidden+[...].mjs';
import '../_libs/radix-ui__react-label.mjs';
import '../_libs/radix-ui__react-tabs.mjs';
import '../_libs/radix-ui__react-roving-focus.mjs';
import '../_libs/radix-ui__react-collection.mjs';
import '../_libs/radix-ui__react-direction.mjs';

const BR_PHONE_REGEX = /^\(\d{2}\) \d{5}-\d{4}$/;
function applyPhoneMask(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}
function applyCpfMask(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}
function applyCnpjMask(value) {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  return digits.replace(/(\d{2})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1/$2").replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}
const PIX_TYPES = [{
  value: "cpf",
  label: "CPF"
}, {
  value: "cnpj",
  label: "CNPJ"
}, {
  value: "email",
  label: "E-mail"
}, {
  value: "phone",
  label: "Telefone"
}, {
  value: "random",
  label: "Chave aleatória"
}];
const BR_STATES = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];
function Profile() {
  const {
    user,
    signOut
  } = useAuth();
  const nav = useNavigate();
  const [profile, setProfile] = reactExports.useState(null);
  const [name, setName] = reactExports.useState("");
  const [birthDate, setBirthDate] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [file, setFile] = reactExports.useState(null);
  const [zip, setZip] = reactExports.useState("");
  const [zipLoading, setZipLoading] = reactExports.useState(false);
  const [street, setStreet] = reactExports.useState("");
  const [number, setNumber] = reactExports.useState("");
  const [complement, setComplement] = reactExports.useState("");
  const [neighborhood, setNeighborhood] = reactExports.useState("");
  const [city, setCity] = reactExports.useState("");
  const [state, setState] = reactExports.useState("");
  const [pixType, setPixType] = reactExports.useState("");
  const [pixKey, setPixKey] = reactExports.useState("");
  const [profession, setProfession] = reactExports.useState("");
  const [specialty, setSpecialty] = reactExports.useState("");
  const [professionalRegister, setProfessionalRegister] = reactExports.useState("");
  const [experienceYears, setExperienceYears] = reactExports.useState("");
  const [vCity, setVCity] = reactExports.useState("");
  const [availability, setAvailability] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({
      data
    }) => {
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
      setProfession(data.profession || "");
      setSpecialty(data.specialty || "");
      setProfessionalRegister(data.professional_register || "");
      setExperienceYears(data.experience_years?.toString() || "");
      setVCity(data.city || "");
      setAvailability(data.availability || "");
    });
    supabase.from("certificates").select("*, projects(name)").eq("user_id", user.id).then(({
      data
    }) => setCerts(data || []));
  }, [user]);
  const [certs, setCerts] = reactExports.useState([]);
  if (!user) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Faça login." }) })
  ] });
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
      const {
        data,
        error
      } = await supabase.from("profiles").update({
        display_name: name,
        avatar_url,
        birth_date: birthDate || null,
        phone: phone || null
      }).eq("id", user.id).select().single();
      if (error) {
        console.error("[savePersonal]", error);
        return toast.error(error.message);
      }
      if (!data) return toast.error("Nenhuma linha foi atualizada. Verifique sua sessão.");
      toast.success("Informações pessoais salvas!");
      setProfile(data);
    } catch (e) {
      console.error("[savePersonal] unexpected:", e);
      toast.error(e?.message ?? "Erro inesperado ao salvar.");
    }
  };
  const saveAddress = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from("profiles").update({
        address_zip: zip || null,
        address_street: street || null,
        address_number: number || null,
        address_complement: complement || null,
        address_neighborhood: neighborhood || null,
        address_city: city || null,
        address_state: state || null
      }).eq("id", user.id).select().single();
      if (error) {
        console.error("[saveAddress]", error);
        return toast.error(error.message);
      }
      if (!data) return toast.error("Nenhuma linha foi atualizada. Verifique sua sessão.");
      toast.success("Endereço salvo!");
    } catch (e) {
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
      const {
        data,
        error
      } = await supabase.from("profiles").update({
        pix_key: pixKey || null,
        pix_key_type: pixType || null
      }).eq("id", user.id).select().single();
      if (error) {
        console.error("[savePix]", error);
        return toast.error(error.message);
      }
      if (!data) return toast.error("Nenhuma linha foi atualizada. Verifique sua sessão.");
      toast.success("Chave PIX salva!");
    } catch (e) {
      console.error("[savePix] unexpected:", e);
      toast.error(e?.message ?? "Erro inesperado ao salvar.");
    }
  };
  const saveProfessional = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from("profiles").update({
        profession: profession || null,
        specialty: specialty || null,
        professional_register: professionalRegister || null,
        experience_years: experienceYears ? Number(experienceYears) : null,
        city: vCity || null,
        availability: availability || null
      }).eq("id", user.id).select().single();
      if (error) {
        console.error("[saveProfessional]", error);
        return toast.error(error.message);
      }
      if (!data) return toast.error("Nenhuma linha foi atualizada. Verifique sua sessão.");
      toast.success("Perfil profissional salvo!");
    } catch (e) {
      console.error("[saveProfessional] unexpected:", e);
      toast.error(e?.message ?? "Erro inesperado ao salvar.");
    }
  };
  const handleZipChange = async (raw) => {
    const digits = raw.replace(/\D/g, "").slice(0, 8);
    const masked = digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
    setZip(masked);
    if (digits.length !== 8) return;
    setZipLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const json = await res.json();
      if (json.erro) {
        toast.error("CEP não encontrado.");
        return;
      }
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
    await supabase.from("profiles").update({
      display_name: "[Conta removida]",
      avatar_url: null
    }).eq("id", user.id);
    await signOut();
    toast.success("Conta desativada.");
    nav({
      to: "/"
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 container mx-auto max-w-3xl px-4 py-10 space-y-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          profile?.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: profile.avatar_url, alt: "", className: "h-20 w-20 rounded-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-full bg-muted" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: profile?.display_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: user.email })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => signOut(), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4 mr-1" }),
            "Sair"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "destructive", size: "sm", onClick: deleteAccount, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 mr-1" }),
            "Apagar conta"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "personal", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "personal", children: "Pessoal" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "address", children: "Endereço" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "pix", children: "PIX" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "professional", children: "Profissional" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "certs", children: "Certificados" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "personal", className: "mt-6 space-y-4 rounded-xl border border-border bg-card p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", children: "Nome de exibição" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "name", value: name, onChange: (e) => setName(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "birth", children: "Data de nascimento" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "birth", type: "date", value: birthDate, onChange: (e) => setBirthDate(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "phone", children: "Telefone / WhatsApp" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "phone", placeholder: "(XX) XXXXX-XXXX", value: phone, onChange: (e) => setPhone(applyPhoneMask(e.target.value)), maxLength: 15, inputMode: "numeric" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "avatar", children: "Foto de perfil" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "avatar", type: "file", accept: "image/*", onChange: (e) => setFile(e.target.files?.[0] || null) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: savePersonal, children: "Salvar informações" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "address", className: "mt-6 space-y-4 rounded-xl border border-border bg-card p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground rounded-lg bg-muted/60 px-3 py-2", children: [
            "Seu endereço é ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "privado" }),
            " e somente será exibido para usuários que façam doação de frete."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "zip", children: "CEP" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "zip", placeholder: "00000-000", value: zip, onChange: (e) => handleZipChange(e.target.value), maxLength: 9, inputMode: "numeric", disabled: zipLoading }),
                zipLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground animate-pulse", children: "Buscando…" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "state", children: "Estado" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { id: "state", value: state, onChange: (e) => setState(e.target.value), className: "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Selecione" }),
                BR_STATES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, children: s }, s))
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "street", children: "Rua / Logradouro" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "street", value: street, onChange: (e) => setStreet(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "number", children: "Número" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "number", value: number, onChange: (e) => setNumber(e.target.value) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "complement", children: "Complemento" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "complement", placeholder: "Apto, sala…", value: complement, onChange: (e) => setComplement(e.target.value) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "neighborhood", children: "Bairro" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "neighborhood", value: neighborhood, onChange: (e) => setNeighborhood(e.target.value) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "city", children: "Cidade" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "city", value: city, onChange: (e) => setCity(e.target.value) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: saveAddress, children: "Salvar endereço" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "pix", className: "mt-6 space-y-4 rounded-xl border border-border bg-card p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground rounded-lg bg-muted/60 px-3 py-2", children: "Sua chave PIX será usada para receber doações nos seus projetos." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "pixType", children: "Tipo da chave PIX" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { id: "pixType", value: pixType, onChange: (e) => {
              setPixType(e.target.value);
              setPixKey("");
            }, className: "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Selecione" }),
              PIX_TYPES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t.value, children: t.label }, t.value))
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "pixKey", children: "Chave PIX" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "pixKey", placeholder: pixType === "cpf" ? "000.000.000-00" : pixType === "cnpj" ? "00.000.000/0000-00" : pixType === "email" ? "seu@email.com" : pixType === "phone" ? "(XX) XXXXX-XXXX" : pixType === "random" ? "Chave aleatória (32 caracteres)" : "Selecione o tipo acima", value: pixKey, onChange: (e) => {
              let val = e.target.value;
              if (pixType === "cpf") val = applyCpfMask(val);
              else if (pixType === "cnpj") val = applyCnpjMask(val);
              else if (pixType === "phone") val = applyPhoneMask(val);
              setPixKey(val);
            } })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: savePix, children: "Salvar PIX" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "professional", className: "mt-6 space-y-4 rounded-xl border border-border bg-card p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground rounded-lg bg-muted/60 px-3 py-2", children: "Preencha seu perfil profissional para que os donos de projetos saibam suas habilidades ao se voluntariar." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "prof", children: "Profissão" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "prof", placeholder: "Ex: Pedreiro, Engenheiro...", value: profession, onChange: (e) => setProfession(e.target.value) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "spec", children: "Especialidade" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "spec", placeholder: "Ex: Alvenaria, Elétrica...", value: specialty, onChange: (e) => setSpecialty(e.target.value) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "reg", children: "Registro Profissional (CREA, CAU, etc.)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "reg", value: professionalRegister, onChange: (e) => setProfessionalRegister(e.target.value) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "exp", children: "Anos de experiência" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "exp", type: "number", value: experienceYears, onChange: (e) => setExperienceYears(e.target.value) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "vcity", children: "Cidade de atuação" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "vcity", value: vCity, onChange: (e) => setVCity(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "avail", children: "Disponibilidade" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "avail", placeholder: "Ex: Fins de semana, Noite...", value: availability, onChange: (e) => setAvailability(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: saveProfessional, children: "Salvar perfil profissional" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "certs", className: "mt-6 space-y-4 rounded-xl border border-border bg-card p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-semibold flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-5 w-5 text-accent" }),
            "Seus Certificados"
          ] }),
          certs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm italic", children: "Nenhum certificado emitido até o momento." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 gap-4", children: certs.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border-2 border-accent/40 bg-gradient-to-br from-accent/10 to-primary/5 p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-8 w-8 text-accent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-3 font-semibold", children: "Certificado de Participação" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
              "Projeto: ",
              c.projects?.name
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
              "Emitido em ",
              new Date(c.issued_at).toLocaleDateString("pt-BR")
            ] })
          ] }, c.id)) })
        ] }) })
      ] })
    ] })
  ] });
}

export { Profile as component };
