import { r as reactExports, j as jsxRuntimeExports } from '../_libs/react.mjs';
import { e as useNavigate } from '../_libs/tanstack__react-router.mjs';
import { u as useAuth, I as Input, B as Button, s as supabase } from './router-BVHoRukv.mjs';
import { H as Header } from './Header-DOxXZI1d.mjs';
import { L as Label } from './label-xAhoNQXm.mjs';
import { T as Textarea } from './textarea-DseRLdAv.mjs';
import { u as uploadImages } from './upload-CaC8vadG.mjs';
import { t as toast } from '../_libs/sonner.mjs';
import { P as Package, x as ShieldCheck } from '../_libs/lucide-react.mjs';
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

const CONDITION_OPTIONS = ["Novo", "Seminovo", "Usado"];
const UNIT_OPTIONS = ["Unidade", "Quilograma", "Metro", "Litro", "Saco"];
const formatPhone = (v) => {
  const digits = v.replace(/\D/g, "");
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
};
function NewMaterial() {
  const {
    user
  } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = reactExports.useState({
    name: "",
    description: "",
    location: "",
    quantity: 1,
    condition: "Novo",
    unit: "Unidade",
    contact_phone: "",
    contact_email: ""
  });
  const [files, setFiles] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  if (!user) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Faça login." }) })
  ] });
  const submit = async (e) => {
    e.preventDefault();
    if (!form.contact_phone && !form.contact_email) {
      return toast.error("Informe pelo menos um meio de contato (Telefone ou E-mail).");
    }
    if (files.length === 0) {
      return toast.error("Por favor, adicione pelo menos uma imagem do material.");
    }
    setLoading(true);
    try {
      const images = files.length ? await uploadImages(user.id, files) : [];
      const {
        error
      } = await supabase.from("materials").insert({
        ...form,
        quantity: Number(form.quantity),
        owner_id: user.id,
        images,
        availability_status: "Disponível",
        contact_info: form.contact_phone || form.contact_email
        // Maintain compatibility
      });
      if (error) throw error;
      toast.success("Material publicado! Aguardando aprovação.");
      nav({
        to: "/materials"
      });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 container mx-auto max-w-2xl px-4 py-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-primary/10 p-2 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-6 w-6 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: "Doar material" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-4 rounded-xl border border-border bg-card p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", children: "Nome do Material" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "name", required: true, value: form.name, onChange: (e) => setForm({
            ...form,
            name: e.target.value
          }), placeholder: "Ex: Telhas de fibrocimento" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Estado de Conservação" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-primary outline-none", value: form.condition, onChange: (e) => setForm({
              ...form,
              condition: e.target.value
            }), children: CONDITION_OPTIONS.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: o }, o)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Unidade de Medida" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-primary outline-none", value: form.unit, onChange: (e) => setForm({
              ...form,
              unit: e.target.value
            }), children: UNIT_OPTIONS.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: o }, o)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "qty", children: "Quantidade disponível" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "qty", type: "number", min: 1, required: true, value: form.quantity, onChange: (e) => setForm({
              ...form,
              quantity: Number(e.target.value)
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "loc", children: "Localização (Bairro/Cidade)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "loc", required: true, value: form.location, onChange: (e) => setForm({
              ...form,
              location: e.target.value
            }), placeholder: "Ex: Centro, Itapevi - SP" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "desc", children: "Descrição do material" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "desc", required: true, value: form.description, onChange: (e) => setForm({
            ...form,
            description: e.target.value
          }), placeholder: "Descreva o estado, marca, dimensões..." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-4 border-t", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider", children: "Meios de Contato (Informe pelo menos um)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "phone", children: "Telefone / WhatsApp" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "phone", type: "tel", placeholder: "(00) 00000-0000", value: form.contact_phone, onChange: (e) => setForm({
                ...form,
                contact_phone: formatPhone(e.target.value)
              }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "E-mail" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", type: "email", placeholder: "seu@email.com", value: form.contact_email, onChange: (e) => setForm({
                ...form,
                contact_email: e.target.value
              }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Imagens do material *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "file", accept: "image/*", multiple: true, required: true, onChange: (e) => setFiles(Array.from(e.target.files || [])) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", className: "flex-1", onClick: () => nav({
            to: "/materials"
          }), children: "Cancelar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "flex-1", disabled: loading, children: loading ? "Publicando..." : "Publicar Doação" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-lg bg-muted/50 p-4 border border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-sm font-semibold flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4 text-primary" }),
          " Transparência e Segurança"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Sua doação passará por uma breve moderação antes de ficar visível para todos. Ao doar, você ajuda a transformar a realidade habitacional de alguém." })
      ] })
    ] })
  ] });
}

export { NewMaterial as component };
