import { r as reactExports, j as jsxRuntimeExports } from '../_libs/react.mjs';
import { L as Link } from '../_libs/tanstack__react-router.mjs';
import { s as supabase, B as Button } from './router-BVHoRukv.mjs';
import { H as Header } from './Header-DOxXZI1d.mjs';
import '../_libs/sonner.mjs';
import { H as HardHat, s as House, q as Users, t as Heart, A as Award } from '../_libs/lucide-react.mjs';
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

const heroImg = "/assets/hero-BFwzHof8.jpg";

function Index() {
  const [topUsers, setTopUsers] = reactExports.useState([]);
  reactExports.useEffect(() => {
    supabase.from("profiles").select("id, display_name, avatar_url").limit(3).then(({
      data
    }) => setTopUsers(data || []));
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: heroImg, alt: "Voluntários construindo telhado juntos", width: 1536, height: 1024, className: "h-full w-full object-cover" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative container mx-auto px-4 py-24 md:py-36", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2 rounded-full bg-accent/30 px-3 py-1 text-xs font-medium text-accent-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(HardHat, { className: "h-3.5 w-3.5" }),
            " Plataforma de solidariedade habitacional"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-6 text-4xl md:text-6xl font-bold leading-tight", children: [
            "Construindo lares,",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            "transformando vidas."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-lg text-muted-foreground", children: "Conectamos profissionais voluntários e doadores a projetos de melhoria habitacional em comunidades vulneráveis. Cada telhado, cada parede, cada ato de solidariedade conta." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/projects", children: "Ver projetos" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", variant: "outline", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/materials", children: "Doar materiais" }) })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "container mx-auto px-4 py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-6 md:grid-cols-3", children: [{
        icon: House,
        title: "Cadastre projetos",
        desc: "Comunidades publicam necessidades de melhoria habitacional."
      }, {
        icon: Users,
        title: "Voluntarie-se",
        desc: "Engenheiros, arquitetos e construtores oferecem mão de obra."
      }, {
        icon: Heart,
        title: "Doe materiais",
        desc: "Compartilhe insumos e recursos com quem precisa."
      }].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-6 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-12 w-12 place-items-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(f.icon, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-4 text-xl font-semibold", children: f.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground", children: f.desc })
      ] }, f.title)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-muted/30 py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-2xl mx-auto mb-12", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-3xl font-bold flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-8 w-8 text-accent" }),
            " Destaques da Comunidade"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-4", children: "Conheça as pessoas que estão fazendo a diferença em nossos projetos de melhoria habitacional." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 gap-8", children: topUsers.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-8 text-center shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto h-20 w-20 rounded-full bg-muted overflow-hidden mb-4 ring-4 ring-primary/10", children: u.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: u.avatar_url, alt: u.display_name, className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-full flex items-center justify-center text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-10 w-10" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold", children: u.display_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Voluntário Destaque" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex justify-center gap-4 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-lg text-primary", children: "12" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground uppercase", children: "Projetos" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-lg text-primary", children: "48h" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground uppercase", children: "Voluntariado" })
            ] })
          ] })
        ] }, u.id)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "border-t border-border py-8 text-center text-sm text-muted-foreground", children: "© 2026 ConstruirJuntos — Voluntariado e doações para moradia digna." })
  ] });
}

export { Index as component };
