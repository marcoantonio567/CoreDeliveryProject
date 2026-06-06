import { r as reactExports, j as jsxRuntimeExports } from '../_libs/react.mjs';
import { L as Link } from '../_libs/tanstack__react-router.mjs';
import { u as useAuth, I as Input, B as Button, s as supabase } from './router-BVHoRukv.mjs';
import { H as Header } from './Header-DOxXZI1d.mjs';
import { T as Textarea } from './textarea-DseRLdAv.mjs';
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from './tabs-B-ohzito.mjs';
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from './dialog-BNglQb4Z.mjs';
import { L as Label } from './label-xAhoNQXm.mjs';
import { t as toast } from '../_libs/sonner.mjs';
import { m as ChartColumn, h as CircleCheck, q as Users, P as Package, W as Wallet, r as Flag, M as MapPin } from '../_libs/lucide-react.mjs';
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
import '../_libs/radix-ui__react-tabs.mjs';
import '../_libs/radix-ui__react-roving-focus.mjs';
import '../_libs/radix-ui__react-collection.mjs';
import '../_libs/radix-ui__react-direction.mjs';
import '../_libs/radix-ui__react-label.mjs';

function Admin() {
  const {
    isAdmin,
    loading
  } = useAuth();
  const [pendingProjects, setPendingProjects] = reactExports.useState([]);
  const [pendingMaterials, setPendingMaterials] = reactExports.useState([]);
  const [reported, setReported] = reactExports.useState([]);
  const [completionReq, setCompletionReq] = reactExports.useState([]);
  const [users, setUsers] = reactExports.useState([]);
  const [adminIds, setAdminIds] = reactExports.useState(/* @__PURE__ */ new Set());
  const [reasons, setReasons] = reactExports.useState({});
  const [search, setSearch] = reactExports.useState({
    projects: "",
    materials: "",
    users: ""
  });
  const [promoteEmail, setPromoteEmail] = reactExports.useState("");
  const [rejectingProject, setRejectingProject] = reactExports.useState(null);
  const [rejectingMaterial, setRejectingMaterial] = reactExports.useState(null);
  const [rejectionReason, setRejectionReason] = reactExports.useState("");
  const [metrics, setMetrics] = reactExports.useState({
    activeProjects: 0,
    completedProjects: 0,
    totalVolunteers: 0,
    totalMaterials: 0,
    totalRaised: 0,
    pendingReports: 0
  });
  const reload = async () => {
    const [{
      data: pp
    }, {
      data: pm
    }, {
      data: r
    }, {
      data: c
    }, {
      data: u
    }, {
      data: ar
    }, {
      data: allP
    }, {
      data: allM
    }, {
      data: allV
    }, {
      data: allD
    }] = await Promise.all([supabase.from("projects").select("*").eq("status", "pending").order("created_at"), supabase.from("materials").select("*").eq("status", "pending").order("created_at"), supabase.from("reports").select("project_id, reason, created_at, projects(*)"), supabase.from("projects").select("*").eq("completion_status", "completion_requested"), supabase.from("profiles").select("id, display_name, created_at").order("created_at", {
      ascending: false
    }), supabase.from("user_roles").select("user_id").eq("role", "admin"), supabase.from("projects").select("status, completion_status"), supabase.from("materials").select("id"), supabase.from("volunteer_requests").select("id"), supabase.from("donations").select("amount")]);
    setPendingProjects(pp || []);
    setPendingMaterials(pm || []);
    const map = {};
    (r || []).forEach((row) => {
      if (!row.projects) return;
      map[row.project_id] = map[row.project_id] || {
        count: 0,
        project: row.projects,
        reasons: []
      };
      map[row.project_id].count++;
      map[row.project_id].reasons.push(row.reason);
    });
    setReported(Object.values(map).sort((a, b) => b.count - a.count));
    setCompletionReq(c || []);
    setUsers(u || []);
    setAdminIds(new Set((ar || []).map((x) => x.user_id)));
    setMetrics({
      activeProjects: (allP || []).filter((p) => p.status === "approved" && p.completion_status === "in_progress").length,
      completedProjects: (allP || []).filter((p) => p.completion_status === "completed").length,
      totalVolunteers: (allV || []).length,
      totalMaterials: (allM || []).length,
      totalRaised: (allD || []).reduce((acc, curr) => acc + (curr.amount || 0), 0),
      pendingReports: (r || []).length
    });
  };
  reactExports.useEffect(() => {
    if (isAdmin) reload();
  }, [isAdmin]);
  if (loading) return null;
  if (!isAdmin) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Acesso restrito a administradores." }) })
  ] });
  const approveProject = async (id) => {
    await supabase.from("projects").update({
      status: "approved"
    }).eq("id", id);
    toast.success("Aprovado");
    reload();
  };
  const rejectProject = async (id, reason) => {
    if (!reason) return toast.error("Informe o motivo.");
    await supabase.from("projects").update({
      status: "rejected",
      rejection_reason: reason
    }).eq("id", id);
    toast.success("Reprovado");
    reload();
  };
  const disable = async (id) => {
    await supabase.from("projects").update({
      status: "disabled"
    }).eq("id", id);
    toast.success("Desabilitado");
    reload();
  };
  const approveMaterial = async (id) => {
    await supabase.from("materials").update({
      status: "approved"
    }).eq("id", id);
    toast.success("Aprovado");
    reload();
  };
  const rejectMaterial = async (id, reason) => {
    if (!reason) return toast.error("Informe o motivo.");
    await supabase.from("materials").update({
      status: "rejected",
      rejection_reason: reason
    }).eq("id", id);
    toast.success("Reprovado");
    reload();
  };
  const approveCompletion = async (proj) => {
    await supabase.from("projects").update({
      completion_status: "completed"
    }).eq("id", proj.id);
    const {
      data: vols
    } = await supabase.from("volunteer_requests").select("user_id").eq("project_id", proj.id);
    if (vols && vols.length) await supabase.from("certificates").insert(vols.map((v) => ({
      project_id: proj.id,
      user_id: v.user_id
    })));
    toast.success("Concluído e certificados emitidos!");
    reload();
  };
  const rejectCompletion = async (id) => {
    await supabase.from("projects").update({
      completion_status: "completion_rejected"
    }).eq("id", id);
    reload();
  };
  const promote = async (uid) => {
    const {
      error
    } = await supabase.from("user_roles").insert({
      user_id: uid,
      role: "admin"
    });
    if (error) return toast.error(error.message);
    toast.success("Promovido");
    reload();
  };
  const promoteByName = async () => {
    const u = users.find((x) => x.display_name?.toLowerCase() === promoteEmail.toLowerCase() || x.id === promoteEmail);
    if (!u) return toast.error("Usuário não encontrado.");
    promote(u.id);
    setPromoteEmail("");
  };
  const filteredProjects = reactExports.useMemo(() => pendingProjects.filter((p) => !search.projects || p.name.toLowerCase().includes(search.projects.toLowerCase())), [pendingProjects, search.projects]);
  const filteredMaterials = reactExports.useMemo(() => pendingMaterials.filter((m) => !search.materials || m.name.toLowerCase().includes(search.materials.toLowerCase())), [pendingMaterials, search.materials]);
  const filteredUsers = reactExports.useMemo(() => users.filter((u) => !search.users || u.display_name?.toLowerCase().includes(search.users.toLowerCase()) || u.id.includes(search.users)), [users, search.users]);
  const ProjectCard = ({
    p
  }) => {
    const owner = users.find((u) => u.id === p.owner_id);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-4 justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-lg", children: p.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-primary", children: p.improvement_type }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground inline-flex items-center gap-1 mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3" }),
            p.location
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
            "Autor: ",
            owner?.display_name || p.owner_id
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm whitespace-pre-wrap", children: p.description })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-2 self-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/projects/$id", params: {
            id: p.id
          }, className: "text-xs text-primary hover:underline", children: "Ver página completa" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", asChild: true, className: "h-7 text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/projects/$id/edit", params: {
            id: p.id
          }, children: "Editar Projeto" }) })
        ] })
      ] }),
      p.images?.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid grid-cols-2 md:grid-cols-4 gap-2", children: p.images.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: u, alt: "", className: "aspect-video w-full object-cover rounded" }, u)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: () => approveProject(p.id), children: "Aprovar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "destructive", onClick: () => {
          setRejectingProject(p);
          setRejectionReason("");
        }, children: "Reprovar" })
      ] })
    ] });
  };
  const MaterialCard = ({
    m
  }) => {
    const owner = users.find((u) => u.id === m.owner_id);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-4 justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-lg", children: m.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground inline-flex items-center gap-1 mt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3" }),
          m.location
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
          "Autor: ",
          owner?.display_name || m.owner_id,
          " · Quantidade: ",
          m.quantity
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm whitespace-pre-wrap", children: m.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
          "Contato: ",
          m.contact_info
        ] })
      ] }) }),
      m.images?.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid grid-cols-2 md:grid-cols-4 gap-2", children: m.images.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: u, alt: "", className: "aspect-video w-full object-cover rounded" }, u)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: () => approveMaterial(m.id), children: "Aprovar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "destructive", onClick: () => {
          setRejectingMaterial(m);
          setRejectionReason("");
        }, children: "Reprovar" })
      ] })
    ] });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 container mx-auto px-4 py-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold mb-6", children: "Painel de Administração" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "metrics", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "flex-wrap h-auto mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "metrics", className: "gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-4 w-4" }),
            " Métricas"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "projects", children: [
            "Projetos (",
            pendingProjects.length,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "materials", children: [
            "Materiais (",
            pendingMaterials.length,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "reports", children: [
            "Denúncias (",
            reported.length,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "completion", children: [
            "Conclusões (",
            completionReq.length,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "users", children: "Usuários" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "metrics", className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-primary mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-5 w-5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-wider", children: "Ativos" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold", children: metrics.activeProjects }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Projetos em andamento" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-green-600 mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-5 w-5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-wider", children: "Concluídos" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold", children: metrics.completedProjects }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Impacto total realizado" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-blue-600 mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-wider", children: "Voluntários" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold", children: metrics.totalVolunteers }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Solicitações totais" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-orange-600 mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-5 w-5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-wider", children: "Materiais" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold", children: metrics.totalMaterials }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Doações cadastradas" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-emerald-600 mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-5 w-5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-wider", children: "Arrecadado" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-bold", children: [
              "R$ ",
              metrics.totalRaised.toFixed(2)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Total via plataforma" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-destructive mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "h-5 w-5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-wider", children: "Denúncias" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold", children: metrics.pendingReports }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Registros totais" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "projects", className: "space-y-4 mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Pesquisar projetos...", value: search.projects, onChange: (e) => setSearch({
            ...search,
            projects: e.target.value
          }), className: "max-w-md" }),
          filteredProjects.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProjectCard, { p }, p.id)),
          filteredProjects.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Sem projetos pendentes." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "materials", className: "space-y-4 mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Pesquisar materiais...", value: search.materials, onChange: (e) => setSearch({
            ...search,
            materials: e.target.value
          }), className: "max-w-md" }),
          filteredMaterials.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(MaterialCard, { m }, m.id)),
          filteredMaterials.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Sem materiais pendentes." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "reports", className: "space-y-4 mt-4", children: [
          reported.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/projects/$id", params: {
                  id: r.project.id
                }, className: "font-semibold hover:underline", children: r.project.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-destructive", children: [
                  r.count,
                  " denúncia(s)"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "destructive", onClick: () => disable(r.project.id), children: "Desabilitar" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-3 space-y-1 text-sm text-muted-foreground list-disc pl-5", children: r.reasons.map((reason, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: reason }, i)) })
          ] }, r.project.id)),
          reported.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Sem denúncias." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "completion", className: "space-y-4 mt-4", children: [
          completionReq.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/projects/$id", params: {
                id: p.id
              }, className: "font-semibold hover:underline", children: p.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: p.location })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: () => approveCompletion(p), children: "Aprovar" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => rejectCompletion(p.id), children: "Reprovar" })
            ] })
          ] }, p.id)),
          completionReq.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Sem conclusões pendentes." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "users", className: "mt-4 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 max-w-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Promover por ID ou nome exato", value: promoteEmail, onChange: (e) => setPromoteEmail(e.target.value) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: promoteByName, children: "Promover" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Pesquisar usuários...", value: search.users, onChange: (e) => setSearch({
            ...search,
            users: e.target.value
          }), className: "max-w-md" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card divide-y divide-border", children: filteredUsers.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium truncate", children: u.display_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-mono truncate", children: u.id })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 shrink-0", children: adminIds.has(u.id) ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs rounded-full bg-primary/15 text-primary px-2 py-0.5", children: "admin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => promote(u.id), children: "Promover" }) })
          ] }, u.id)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!rejectingProject, onOpenChange: (open) => !open && setRejectingProject(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Reprovar Projeto" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Informe o motivo da reprovação para que o autor saiba o que precisa ser ajustado." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-4 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "proj-rejection-reason", children: "Motivo da Reprovação *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "proj-rejection-reason", placeholder: "Ex: Descrição insuficiente, imagens inadequadas...", value: rejectionReason, onChange: (e) => setRejectionReason(e.target.value), rows: 4 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setRejectingProject(null), children: "Cancelar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", disabled: !rejectionReason.trim(), onClick: () => {
            rejectProject(rejectingProject.id, rejectionReason);
            setRejectingProject(null);
          }, children: "Confirmar Reprovação" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!rejectingMaterial, onOpenChange: (open) => !open && setRejectingMaterial(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Reprovar Doação de Material" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Informe o motivo da reprovação." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-4 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mat-rejection-reason", children: "Motivo da Reprovação *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "mat-rejection-reason", placeholder: "Ex: Material não permitido, informações falsas...", value: rejectionReason, onChange: (e) => setRejectionReason(e.target.value), rows: 4 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setRejectingMaterial(null), children: "Cancelar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", disabled: !rejectionReason.trim(), onClick: () => {
            rejectMaterial(rejectingMaterial.id, rejectionReason);
            setRejectingMaterial(null);
          }, children: "Confirmar Reprovação" })
        ] })
      ] }) })
    ] })
  ] });
}

export { Admin as component };
