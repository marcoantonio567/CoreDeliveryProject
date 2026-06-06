import { r as reactExports, j as jsxRuntimeExports } from '../_libs/react.mjs';
import { L as Link } from '../_libs/tanstack__react-router.mjs';
import { u as useAuth, B as Button, s as supabase } from './router-BVHoRukv.mjs';
import { H as Header } from './Header-DOxXZI1d.mjs';
import { t as toast } from '../_libs/sonner.mjs';
import { B as Badge } from './badge-BilmNvwk.mjs';
import { P as Package, L as LoaderCircle, M as MapPin, C as Clock, i as Phone, j as Mail, T as Trash2 } from '../_libs/lucide-react.mjs';
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

function MyRequests() {
  const {
    user
  } = useAuth();
  const [requests, setRequests] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const load = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.from("material_requests").select(`
          *,
          materials (
            id,
            name,
            location,
            availability_status,
            images
          )
        `).eq("user_id", user.id).order("created_at", {
        ascending: false
      });
      if (error) throw error;
      setRequests(data || []);
    } catch (err) {
      toast.error("Erro ao carregar solicitações: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    load();
  }, [user]);
  const cancel = async (id) => {
    if (!confirm("Tem certeza que deseja desfazer seu interesse neste material?")) return;
    const {
      error
    } = await supabase.from("material_requests").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Interesse removido");
    load();
  };
  if (!user) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Faça login para ver suas solicitações." }) })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 container mx-auto px-4 py-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-primary/10 p-2 rounded-lg text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: "Solicitações de Materiais" })
      ] }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-20 text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin mb-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Carregando solicitações..." })
      ] }) : requests.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20 rounded-2xl border-2 border-dashed border-border bg-muted/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg", children: "Você ainda não demonstrou interesse em nenhum material." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "mt-4", variant: "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/materials", children: "Ver Materiais Disponíveis" }) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-6", children: requests.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full md:w-48 h-32 rounded-xl overflow-hidden bg-muted shrink-0", children: r.materials?.images?.[0] ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: r.materials.images[0], alt: "", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-8 w-8" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/materials/$id", params: {
              id: r.material_id
            }, className: "text-xl font-bold hover:text-primary transition-colors", children: r.materials?.name || "Material não disponível" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: r.materials?.availability_status === "Disponível" ? "default" : "secondary", children: r.materials?.availability_status || "Indisponível" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm text-muted-foreground mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4" }),
              " ",
              r.materials?.location
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4" }),
              " Solicitado em ",
              new Date(r.created_at).toLocaleDateString("pt-BR")
            ] }),
            r.contact_phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4" }),
              " ",
              r.contact_phone
            ] }),
            r.contact_email && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4" }),
              " ",
              r.contact_email
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/50 rounded-lg p-3 text-sm italic text-foreground/80 mb-4", children: [
            '"',
            r.description,
            '"'
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              "Qtd. Solicitada: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: r.quantity || "1" })
            ] }),
            r.materials?.availability_status !== "Doado" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "ghost", className: "text-destructive hover:bg-destructive/10", onClick: () => cancel(r.id), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 mr-2" }),
              " Desfazer Interesse"
            ] })
          ] })
        ] })
      ] }) }, r.id)) })
    ] })
  ] });
}

export { MyRequests as component };
