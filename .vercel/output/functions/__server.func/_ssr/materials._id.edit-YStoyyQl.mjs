import { r as reactExports, j as jsxRuntimeExports } from '../_libs/react.mjs';
import { e as useNavigate, L as Link } from '../_libs/tanstack__react-router.mjs';
import { e as Route, u as useAuth, B as Button, I as Input, s as supabase } from './router-BVHoRukv.mjs';
import { H as Header } from './Header-DOxXZI1d.mjs';
import { L as Label } from './label-xAhoNQXm.mjs';
import { T as Textarea } from './textarea-DseRLdAv.mjs';
import { u as uploadImages } from './upload-CaC8vadG.mjs';
import { t as toast } from '../_libs/sonner.mjs';
import { L as LoaderCircle, y as ArrowLeft, P as Package, X } from '../_libs/lucide-react.mjs';
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
function EditMaterial() {
  const {
    id
  } = Route.useParams();
  const {
    user,
    isAdmin
  } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = reactExports.useState(null);
  const [files, setFiles] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [fetching, setFetching] = reactExports.useState(true);
  const [notFound, setNotFound] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const load = async () => {
      setFetching(true);
      try {
        const {
          data
        } = await supabase.from("materials").select("*").eq("id", id).maybeSingle();
        if (data) {
          setForm({
            ...data,
            name: data.name || "",
            description: data.description || "",
            location: data.location || "",
            quantity: data.quantity || 1,
            contact_info: data.contact_info || "",
            condition: data.condition || "Novo",
            unit: data.unit || "Unidade",
            images: data.images || []
          });
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error("Error loading material:", err);
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [id]);
  if (!user) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Faça login." }) })
  ] });
  if (fetching) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Carregando material..." })
    ] }) })
  ] });
  if (notFound) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-semibold", children: "Material não encontrado." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "link", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/materials", children: "Voltar para materiais" }) })
    ] }) })
  ] });
  if (user.id !== form.owner_id && !isAdmin) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Você não tem permissão para editar este material." }) })
  ] });
  const removeImage = (url) => setForm({
    ...form,
    images: (form.images || []).filter((u) => u !== url)
  });
  const submit = async (e) => {
    e.preventDefault();
    let images = form.images || [];
    if (images.length === 0 && files.length === 0) {
      return toast.error("O material deve ter pelo menos uma imagem.");
    }
    setLoading(true);
    try {
      if (files.length) images = [...images, ...await uploadImages(user.id, files)];
      const {
        error
      } = await supabase.from("materials").update({
        name: form.name,
        description: form.description,
        location: form.location,
        quantity: Number(form.quantity),
        contact_info: form.contact_info,
        condition: form.condition,
        unit: form.unit,
        images
      }).eq("id", id);
      if (error) throw error;
      toast.success("Atualizado!");
      nav({
        to: "/materials/$id",
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
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 container mx-auto max-w-2xl px-4 py-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/materials/$id", params: {
          id
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-5 w-5" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-primary/10 p-2 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-6 w-6 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: "Editar material" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", children: "Nome do Material" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "name", required: true, value: form.name, onChange: (e) => setForm({
            ...form,
            name: e.target.value
          }) })
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
            }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "desc", children: "Descrição do material" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "desc", required: true, rows: 4, value: form.description, onChange: (e) => setForm({
            ...form,
            description: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "contact", children: "Contato (e-mail ou telefone)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "contact", required: true, value: form.contact_info, onChange: (e) => setForm({
            ...form,
            contact_info: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Imagens atuais *" }),
          form.images?.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3", children: form.images.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: u, alt: "", className: "aspect-video w-full object-cover rounded-lg border border-border" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => removeImage(u), className: "absolute top-1 right-1 bg-destructive/90 text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" }) })
          ] }, u)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground italic", children: "Nenhuma imagem cadastrada." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Adicionar novas imagens" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "file", accept: "image/*", multiple: true, onChange: (e) => setFiles(Array.from(e.target.files || [])) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", className: "flex-1", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/materials/$id", params: {
            id
          }, children: "Cancelar" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "flex-1", disabled: loading, children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
            "Salvando..."
          ] }) : "Salvar Alterações" })
        ] })
      ] })
    ] })
  ] });
}

export { EditMaterial as component };
