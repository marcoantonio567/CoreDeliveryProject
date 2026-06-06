import { r as reactExports, j as jsxRuntimeExports } from '../_libs/react.mjs';
import { e as useNavigate } from '../_libs/tanstack__react-router.mjs';
import { d as Route$1, u as useAuth, s as supabase, B as Button, I as Input } from './router-BVHoRukv.mjs';
import { H as Header } from './Header-DOxXZI1d.mjs';
import { L as Label } from './label-xAhoNQXm.mjs';
import { T as Textarea } from './textarea-DseRLdAv.mjs';
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from './tabs-B-ohzito.mjs';
import { u as uploadImages } from './upload-CaC8vadG.mjs';
import { t as toast } from '../_libs/sonner.mjs';
import { I as Info, q as Users, W as Wallet, X, n as Calendar } from '../_libs/lucide-react.mjs';
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

const URGENCY_OPTIONS = ["Baixa", "Média", "Alta", "Emergencial"];
const INCOME_OPTIONS = ["Até 1 salário mínimo", "1 a 2 salários mínimos", "2 a 3 salários mínimos", "Mais de 3 salários mínimos", "Sem renda"];
function EditProject() {
  const {
    id
  } = Route$1.useParams();
  const {
    user,
    isAdmin
  } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = reactExports.useState(null);
  const [files, setFiles] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [notFound, setNotFound] = reactExports.useState(false);
  reactExports.useEffect(() => {
    supabase.from("projects").select("*").eq("id", id).maybeSingle().then(({
      data
    }) => {
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
          images: data.images || []
        });
      } else {
        setNotFound(true);
      }
    });
  }, [id]);
  if (!user) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Faça login." }) })
  ] });
  if (notFound) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-semibold", children: "Projeto não encontrado." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "link", onClick: () => nav({
        to: "/projects"
      }), children: "Voltar para projetos" })
    ] }) })
  ] });
  if (!form) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Carregando..." }) })
  ] });
  if (user.id !== form.owner_id && !isAdmin) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Você não tem permissão para editar este projeto." }) })
  ] });
  const removeImage = (url) => setForm({
    ...form,
    images: form.images.filter((u) => u !== url)
  });
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let images = form.images || [];
      if (files.length) images = [...images, ...await uploadImages(user.id, files)];
      const {
        error
      } = await supabase.from("projects").update({
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
        images
      }).eq("id", id);
      if (error) throw error;
      toast.success("Atualizado!");
      nav({
        to: "/projects/$id",
        params: {
          id
        }
      });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 container mx-auto max-w-3xl px-4 py-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold mb-6", children: "Editar projeto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "basic", className: "w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "basic", className: "gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-4 w-4" }),
              "Básico"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "beneficiary", className: "gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4" }),
              "Beneficiário"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "planning", className: "gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-4 w-4" }),
              "Planejamento"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "basic", className: "space-y-4 mt-6 rounded-xl border border-border bg-card p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", children: "Nome do Projeto *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "name", required: true, value: form.name, onChange: (e) => setForm({
                ...form,
                name: e.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "desc", children: "Descrição detalhada *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "desc", required: true, rows: 4, value: form.description, onChange: (e) => setForm({
                ...form,
                description: e.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Tipo de melhoria *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-primary outline-none", value: form.improvement_type, onChange: (e) => setForm({
                  ...form,
                  improvement_type: e.target.value
                }), children: ["Telhado", "Banheiro", "Estrutura", "Cozinha", "Hidráulica", "Elétrica", "Outro"].map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: o }, o)) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Grau de Urgência *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-primary outline-none", value: form.urgency, onChange: (e) => setForm({
                  ...form,
                  urgency: e.target.value
                }), children: URGENCY_OPTIONS.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: o }, o)) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "loc", children: "Localização (Bairro/Cidade) *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "loc", required: true, value: form.location, onChange: (e) => setForm({
                ...form,
                location: e.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Imagens atuais" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 grid grid-cols-3 gap-2", children: (form.images || []).map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: u, alt: "", className: "aspect-video w-full object-cover rounded border border-border" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => removeImage(u), className: "absolute top-1 right-1 bg-destructive/90 text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" }) })
              ] }, u)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Adicionar novas imagens" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "file", accept: "image/*", multiple: true, onChange: (e) => setFiles(Array.from(e.target.files || [])) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "beneficiary", className: "space-y-4 mt-6 rounded-xl border border-border bg-card p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "b-name", children: "Nome do responsável pela residência *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "b-name", required: true, value: form.beneficiary_name || "", onChange: (e) => setForm({
                ...form,
                beneficiary_name: e.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "b-res", children: "Total de moradores (opcional)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "b-res", type: "number", min: 0, value: form.beneficiary_residents, onChange: (e) => setForm({
                  ...form,
                  beneficiary_residents: Number(e.target.value)
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "b-kids", children: "Quantidade de crianças (opcional)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "b-kids", type: "number", min: 0, value: form.beneficiary_children, onChange: (e) => setForm({
                  ...form,
                  beneficiary_children: Number(e.target.value)
                }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Faixa de renda familiar (opcional)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-primary outline-none", value: form.beneficiary_income || "", onChange: (e) => setForm({
                ...form,
                beneficiary_income: e.target.value
              }), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Não informado" }),
                INCOME_OPTIONS.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: o }, o))
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "b-sit", children: "Relato da situação habitacional *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "b-sit", required: true, rows: 3, value: form.beneficiary_situation || "", onChange: (e) => setForm({
                ...form,
                beneficiary_situation: e.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "b-vul", children: "Nível de vulnerabilidade social *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "b-vul", required: true, value: form.beneficiary_vulnerability || "", onChange: (e) => setForm({
                ...form,
                beneficiary_vulnerability: e.target.value
              }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "planning", className: "space-y-4 mt-6 rounded-xl border border-border bg-card p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "cost", children: "Valor estimado da obra (R$) *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "cost", type: "number", required: true, min: 0, value: form.estimated_cost, onChange: (e) => setForm({
                  ...form,
                  estimated_cost: Number(e.target.value)
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "goal", children: "Meta de arrecadação financeira (R$) *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "goal", type: "number", required: true, min: 0, value: form.financial_goal, onChange: (e) => setForm({
                  ...form,
                  financial_goal: Number(e.target.value)
                }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "start", className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4" }),
                  " Data prevista de início *"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "start", type: "date", required: true, value: form.start_date, onChange: (e) => setForm({
                  ...form,
                  start_date: e.target.value
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "end", className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4" }),
                  " Data prevista de término *"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "end", type: "date", required: true, value: form.end_date, onChange: (e) => setForm({
                  ...form,
                  end_date: e.target.value
                }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "obs", children: "Observações adicionais" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "obs", rows: 3, value: form.observations || "", onChange: (e) => setForm({
                ...form,
                observations: e.target.value
              }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => nav({
            to: "/projects/$id",
            params: {
              id
            }
          }), children: "Cancelar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: loading, className: "min-w-[150px]", children: loading ? "Salvando..." : "Salvar alterações" })
        ] })
      ] })
    ] })
  ] });
}

export { EditProject as component };
