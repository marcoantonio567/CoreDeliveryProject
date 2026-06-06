import { r as reactExports, j as jsxRuntimeExports } from '../_libs/react.mjs';
import { L as Link } from '../_libs/tanstack__react-router.mjs';
import { Q as QRCodeSVG } from '../_libs/qrcode.react.mjs';
import { R as Route$4, u as useAuth, s as supabase, B as Button, I as Input } from './router-BVHoRukv.mjs';
import { H as Header } from './Header-DOxXZI1d.mjs';
import { T as Textarea } from './textarea-DseRLdAv.mjs';
import { P as Progress } from './progress-DBJqNlAH.mjs';
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from './tabs-B-ohzito.mjs';
import { B as Badge } from './badge-BilmNvwk.mjs';
import { D as Dialog, f as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from './dialog-BNglQb4Z.mjs';
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from './alert-dialog-nPhVO9F6.mjs';
import { t as toast } from '../_libs/sonner.mjs';
import { L as Label } from './label-xAhoNQXm.mjs';
import { u as uploadImages } from './upload-CaC8vadG.mjs';
import { M as MapPin, o as TrendingUp, l as Pencil, X, c as HandHeart, q as Users, n as Calendar, W as Wallet, T as Trash2, u as History, k as Plus, i as Phone, j as Mail, P as Package, v as Truck, Q as QrCode, w as Copy, r as Flag } from '../_libs/lucide-react.mjs';
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
import '../_libs/radix-ui__react-progress.mjs';
import '../_libs/radix-ui__react-tabs.mjs';
import '../_libs/radix-ui__react-roving-focus.mjs';
import '../_libs/radix-ui__react-collection.mjs';
import '../_libs/radix-ui__react-direction.mjs';
import '../_libs/radix-ui__react-alert-dialog.mjs';
import '../_libs/radix-ui__react-label.mjs';

function tlv(tag, value) {
  return `${tag}${value.length.toString().padStart(2, "0")}${value}`;
}
function crc16(str) {
  let crc = 65535;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) crc = crc & 32768 ? crc << 1 ^ 4129 : crc << 1;
  }
  return (crc & 65535).toString(16).toUpperCase().padStart(4, "0");
}
function buildPixPayload(key) {
  const merchantAccount = tlv("00", "br.gov.bcb.pix") + tlv("01", key);
  const body = tlv("00", "01") + tlv("01", "12") + tlv("26", merchantAccount) + tlv("52", "0000") + tlv("53", "986") + tlv("58", "BR") + tlv("59", "ConstruirJuntos") + tlv("60", "Brasil") + "6304";
  return body + crc16(body);
}
const NEED_TYPES = ["Material", "Mão de obra", "Frete", "Financeira"];
function ProjectDetail() {
  const {
    id
  } = Route$4.useParams();
  const {
    user,
    isAdmin
  } = useAuth();
  const [p, setP] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [isEditOpen, setIsEditOpen] = reactExports.useState(false);
  const [isNeedOpen, setIsNeedOpen] = reactExports.useState(false);
  const [isExpenseOpen, setIsExpenseOpen] = reactExports.useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = reactExports.useState(false);
  const [isRevenueOpen, setIsRevenueOpen] = reactExports.useState(false);
  const [isVolunteerOpen, setIsVolunteerOpen] = reactExports.useState(false);
  const [isEditNeedOpen, setIsEditNeedOpen] = reactExports.useState(false);
  const [isDeleteNeedOpen, setIsDeleteNeedOpen] = reactExports.useState(false);
  const [editForm, setEditForm] = reactExports.useState(null);
  const [editFiles, setEditFiles] = reactExports.useState([]);
  const [editLoading, setEditLoading] = reactExports.useState(false);
  const [volunteerForm, setVolunteerForm] = reactExports.useState({
    message: "",
    contact_phone: "",
    contact_email: "",
    skills: ""
  });
  const [editingNeed, setEditingNeed] = reactExports.useState(null);
  const [deletingNeed, setDeletingNeed] = reactExports.useState(null);
  const [volunteerMsg, setVolunteerMsg] = reactExports.useState("");
  const [donationAmt, setDonationAmt] = reactExports.useState("");
  const [reportReason, setReportReason] = reactExports.useState("");
  const [rejectingRequest, setRejectingRequest] = reactExports.useState(null);
  const [requestRejectionReason, setRequestRejectionReason] = reactExports.useState("");
  const [volunteers, setVolunteers] = reactExports.useState([]);
  const [donations, setDonations] = reactExports.useState([]);
  const [requests, setRequests] = reactExports.useState([]);
  const [needs, setNeeds] = reactExports.useState([]);
  const [updates, setUpdates] = reactExports.useState([]);
  const [expenses, setExpenses] = reactExports.useState([]);
  const [newNeed, setNewNeed] = reactExports.useState({
    type: "Material",
    description: "",
    quantity_needed: ""
  });
  const [newUpdate, setNewUpdate] = reactExports.useState({
    description: ""
  });
  const [newExpense, setNewExpense] = reactExports.useState({
    description: "",
    amount: "",
    date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  });
  const [newRevenue, setNewRevenue] = reactExports.useState({
    description: "",
    amount: "",
    date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  });
  const [reqForm, setReqForm] = reactExports.useState({
    request_type: "material",
    description: "",
    quantity: "",
    contact_info: ""
  });
  const [ownerPix, setOwnerPix] = reactExports.useState(null);
  const load = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const {
        data
      } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
      setP(data);
      if (data) {
        setEditForm({
          name: data.name || "",
          description: data.description || "",
          improvement_type: data.improvement_type || "Telhado",
          location: data.location || "",
          urgency: data.urgency || "Média",
          financial_goal: data.financial_goal || 0,
          estimated_cost: data.estimated_cost || 0,
          start_date: data.start_date || "",
          end_date: data.end_date || "",
          beneficiary_name: data.beneficiary_name || "",
          beneficiary_residents: data.beneficiary_residents || 0,
          beneficiary_children: data.beneficiary_children || 0,
          beneficiary_income: data.beneficiary_income || "Até 1 salário mínimo",
          beneficiary_situation: data.beneficiary_situation || "",
          beneficiary_vulnerability: data.beneficiary_vulnerability || "",
          images: data.images || []
        });
      }
      if (data?.owner_id) {
        supabase.from("profiles").select("pix_key, pix_key_type").eq("id", data.owner_id).maybeSingle().then(({
          data: pix
        }) => {
          setOwnerPix(pix?.pix_key ? {
            pix_key: pix.pix_key,
            pix_key_type: pix.pix_key_type ?? ""
          } : null);
        });
      }
      const {
        data: v
      } = await supabase.from("volunteer_requests").select("id, message, created_at, user_id, status").eq("project_id", id).order("created_at", {
        ascending: false
      });
      setVolunteers(v || []);
      const {
        data: d
      } = await supabase.from("donations").select("id, description, amount, created_at, user_id").eq("project_id", id).order("created_at", {
        ascending: false
      });
      setDonations(d || []);
      const {
        data: rq
      } = await supabase.from("project_requests").select("*").eq("project_id", id).order("created_at", {
        ascending: false
      });
      setRequests(rq || []);
      const [{
        data: nd
      }, {
        data: up
      }, {
        data: ex
      }] = await Promise.all([supabase.from("project_needs").select("*").eq("project_id", id).order("created_at"), supabase.from("project_updates").select("*").eq("project_id", id).order("created_at", {
        ascending: false
      }), supabase.from("project_expenses").select("*").eq("project_id", id).order("date", {
        ascending: false
      })]);
      setNeeds(nd || []);
      setUpdates(up || []);
      setExpenses(ex || []);
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    load();
  }, [id]);
  reactExports.useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("phone, profession, specialty").eq("id", user.id).maybeSingle().then(({
      data
    }) => {
      if (!data) return;
      setVolunteerForm((f) => ({
        ...f,
        contact_phone: f.contact_phone || data.phone || "",
        skills: f.skills || (data.profession ? `${data.profession}${data.specialty ? ` (${data.specialty})` : ""}` : ""),
        contact_email: f.contact_email || user.email || ""
      }));
    });
  }, [user]);
  const [names, setNames] = reactExports.useState({});
  reactExports.useEffect(() => {
    const ids = Array.from(new Set([...volunteers.map((v) => v.user_id), ...donations.map((d) => d.user_id), ...requests.map((r) => r.user_id)].filter(Boolean)));
    if (ids.length === 0) return;
    supabase.from("profiles").select("id, display_name").in("id", ids).then(({
      data
    }) => {
      const map = {};
      (data || []).forEach((r) => {
        map[r.id] = r.display_name;
      });
      setNames(map);
    });
  }, [volunteers, donations, requests]);
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Carregando..." }) })
  ] });
  if (!p) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 grid place-items-center space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold", children: "Projeto não encontrado" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "O projeto que você procura não existe ou ainda não foi aprovado." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: "Voltar para o início" }) })
    ] })
  ] });
  const volunteer = async () => {
    if (!user) return toast.error("Faça login.");
    if (!volunteerForm.message || !volunteerForm.skills) {
      return toast.error("Preencha os campos obrigatórios.");
    }
    if (!volunteerForm.contact_phone && !volunteerForm.contact_email) {
      return toast.error("Informe pelo menos um meio de contato.");
    }
    const {
      error
    } = await supabase.from("volunteer_requests").insert({
      project_id: id,
      user_id: user.id,
      message: volunteerForm.message,
      skills: volunteerForm.skills,
      contact_phone: volunteerForm.contact_phone,
      contact_email: volunteerForm.contact_email
    });
    if (error) return toast.error(error.message);
    toast.success("Solicitação de voluntariado enviada!");
    setVolunteerForm({
      message: "",
      skills: volunteerForm.skills,
      // keep skills for convenience
      contact_phone: volunteerForm.contact_phone,
      contact_email: volunteerForm.contact_email
    });
    setIsVolunteerOpen(false);
    load(true);
  };
  const report = async () => {
    if (!user) return toast.error("Faça login.");
    const {
      error
    } = await supabase.from("reports").insert({
      project_id: id,
      user_id: user.id,
      reason: reportReason
    });
    if (error) return toast.error(error.message);
    toast.success("Denúncia registrada.");
    setReportReason("");
  };
  const removeEditImage = (url) => {
    setEditForm({
      ...editForm,
      images: (editForm.images || []).filter((u) => u !== url)
    });
  };
  const saveProject = async () => {
    if (!editForm.name || !editForm.description || !editForm.location || !editForm.beneficiary_name || !editForm.beneficiary_situation || !editForm.beneficiary_vulnerability || !editForm.estimated_cost || !editForm.financial_goal || !editForm.start_date || !editForm.end_date) {
      return toast.error("Por favor, preencha todos os campos obrigatórios marcados com *");
    }
    setEditLoading(true);
    try {
      let images = [...editForm.images || []];
      if (editFiles.length > 0) {
        const newImages = await uploadImages(user.id, editFiles);
        images = [...images, ...newImages];
      }
      if (images.length === 0) {
        setEditLoading(false);
        return toast.error("O projeto deve ter pelo menos uma imagem.");
      }
      const {
        error
      } = await supabase.from("projects").update({
        name: editForm.name,
        description: editForm.description,
        improvement_type: editForm.improvement_type,
        location: editForm.location,
        urgency: editForm.urgency,
        financial_goal: Number(editForm.financial_goal),
        estimated_cost: Number(editForm.estimated_cost),
        start_date: editForm.start_date || null,
        end_date: editForm.end_date || null,
        beneficiary_name: editForm.beneficiary_name,
        beneficiary_residents: Number(editForm.beneficiary_residents),
        beneficiary_children: Number(editForm.beneficiary_children),
        beneficiary_income: editForm.beneficiary_income,
        beneficiary_situation: editForm.beneficiary_situation,
        beneficiary_vulnerability: editForm.beneficiary_vulnerability,
        images
      }).eq("id", id);
      if (error) throw error;
      toast.success("Projeto atualizado!");
      setIsEditOpen(false);
      setEditFiles([]);
      load(true);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setEditLoading(false);
    }
  };
  const submitRequest = async () => {
    if (!user) return toast.error("Faça login.");
    if (user.id === p.owner_id) return toast.error("Você não pode doar para seu próprio projeto.");
    if (!reqForm.description.trim()) return toast.error("Descreva a necessidade.");
    if (!reqForm.contact_info.trim()) return toast.error("Informe seu contato para que o dono do projeto te ache.");
    const finalDescription = reqForm.request_type === "doacao" && donationAmt ? `${reqForm.description} (Valor: R$ ${donationAmt})`.trim() : reqForm.description;
    const {
      error
    } = await supabase.from("project_requests").insert({
      project_id: id,
      user_id: user.id,
      request_type: reqForm.request_type,
      description: finalDescription,
      quantity: reqForm.quantity ? Number(reqForm.quantity) : null,
      contact_info: reqForm.contact_info
    });
    if (error) return toast.error(error.message);
    toast.success("Solicitação enviada!");
    setReqForm({
      request_type: "material",
      description: "",
      quantity: "",
      contact_info: ""
    });
    setDonationAmt("");
    load(true);
  };
  const addNeed = async () => {
    if (!newNeed.description || !newNeed.quantity_needed) {
      return toast.error("Por favor, preencha todos os campos da necessidade.");
    }
    const {
      error
    } = await supabase.from("project_needs").insert({
      project_id: id,
      type: newNeed.type,
      description: newNeed.description,
      quantity_needed: newNeed.quantity_needed ? Number(newNeed.quantity_needed) : null
    });
    if (error) return toast.error(error.message);
    toast.success("Necessidade adicionada!");
    setNewNeed({
      type: "Material",
      description: "",
      quantity_needed: ""
    });
    setIsNeedOpen(false);
    load(true);
  };
  const updateNeed = async () => {
    if (!editingNeed.description || !editingNeed.quantity_needed) {
      return toast.error("Por favor, preencha todos os campos da necessidade.");
    }
    const {
      error
    } = await supabase.from("project_needs").update({
      type: editingNeed.type,
      description: editingNeed.description,
      quantity_needed: Number(editingNeed.quantity_needed)
    }).eq("id", editingNeed.id);
    if (error) return toast.error(error.message);
    toast.success("Necessidade atualizada!");
    setIsEditNeedOpen(false);
    load(true);
  };
  const deleteNeed = async () => {
    if (!deletingNeed) return;
    const {
      error
    } = await supabase.from("project_needs").delete().eq("id", deletingNeed.id);
    if (error) return toast.error(error.message);
    toast.success("Necessidade excluída!");
    setIsDeleteNeedOpen(false);
    load(true);
  };
  const updateNeedProgress = async (needId, met, total) => {
    const status = met >= total ? "Atendida" : met > 0 ? "Parcialmente atendida" : "Pendente";
    const {
      error
    } = await supabase.from("project_needs").update({
      quantity_met: met,
      status
    }).eq("id", needId);
    if (error) return toast.error(error.message);
    setNeeds((prev) => prev.map((n) => n.id === needId ? {
      ...n,
      quantity_met: met,
      status
    } : n));
    toast.success("Progresso atualizado!");
  };
  const addUpdate = async () => {
    if (!newUpdate.description) return toast.error("Informe a descrição da atualização.");
    const {
      error
    } = await supabase.from("project_updates").insert({
      project_id: id,
      description: newUpdate.description
    });
    if (error) return toast.error(error.message);
    toast.success("Atualização publicada!");
    setNewUpdate({
      description: ""
    });
    setIsUpdateOpen(false);
    load(true);
  };
  const addExpense = async () => {
    if (!newExpense.description || !newExpense.amount || !newExpense.date) {
      return toast.error("Preencha todos os campos do gasto.");
    }
    const {
      error
    } = await supabase.from("project_expenses").insert({
      project_id: id,
      description: newExpense.description,
      amount: Number(newExpense.amount),
      date: newExpense.date
    });
    if (error) return toast.error(error.message);
    toast.success("Gasto registrado!");
    setNewExpense({
      description: "",
      amount: "",
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
    });
    setIsExpenseOpen(false);
    load(true);
  };
  const addRevenue = async () => {
    if (!user) return toast.error("Faça login.");
    if (!newRevenue.description || !newRevenue.amount || !newRevenue.date) {
      return toast.error("Preencha todos os campos da arrecadação.");
    }
    const {
      error
    } = await supabase.from("donations").insert({
      project_id: id,
      user_id: user.id,
      description: newRevenue.description,
      amount: Number(newRevenue.amount),
      created_at: new Date(newRevenue.date).toISOString()
    });
    if (error) return toast.error(error.message);
    toast.success("Arrecadação registrada!");
    setNewRevenue({
      description: "",
      amount: "",
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
    });
    setIsRevenueOpen(false);
    load(true);
  };
  const updateRequestStatus = async (requestId, status, rejectionReason) => {
    const {
      error
    } = await supabase.from("project_requests").update({
      status,
      rejection_reason: rejectionReason
    }).eq("id", requestId);
    if (error) return toast.error(error.message);
    toast.success("Solicitação atualizada!");
    load(true);
  };
  const updateVolunteerStatus = async (vId, status) => {
    const {
      error
    } = await supabase.from("volunteer_requests").update({
      status
    }).eq("id", vId);
    if (error) return toast.error(error.message);
    toast.success("Status do voluntário atualizado!");
    load(true);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 container mx-auto px-4 py-10 max-w-5xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-4 mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-video rounded-xl overflow-hidden border border-border bg-muted", children: p.images?.[0] ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.images[0], alt: "", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center text-muted-foreground", children: "Sem imagens" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-2", children: p.images?.slice(1, 5).map((u, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: u, alt: "", className: "aspect-square rounded-lg object-cover border border-border" }, i)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "uppercase tracking-wider", children: p.improvement_type }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: p.urgency === "Emergencial" ? "destructive" : p.urgency === "Alta" ? "default" : "secondary", children: [
              "Urgência: ",
              p.urgency
            ] }),
            p.completion_status === "completed" && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-green-500 hover:bg-green-600", children: "Concluído" }),
            p.status === "disabled" && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "bg-muted text-muted-foreground", children: "Encerrado" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl md:text-4xl font-bold", children: p.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-muted-foreground flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4" }),
            p.location
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-4 flex-1", children: [
            p.financial_goal > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium inline-flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 text-primary" }),
                  " Meta Financeira"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                  new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                  }).format(donations.reduce((acc, d) => acc + (d.amount || 0), 0)),
                  " /",
                  " ",
                  new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                  }).format(p.financial_goal)
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: donations.reduce((acc, d) => acc + (d.amount || 0), 0) / p.financial_goal * 100 })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 pt-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border p-3 bg-muted/30", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase font-semibold", children: "Voluntários" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold", children: volunteers.filter((v) => v.status === "Aprovada").length })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border p-3 bg-muted/30", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase font-semibold", children: "Doações" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold", children: donations.length })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 flex flex-wrap gap-3", children: p.status === "disabled" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 bg-muted p-3 rounded-lg border border-dashed text-center text-sm text-muted-foreground font-medium", children: "Este projeto foi encerrado e não aceita mais edições ou apoios." }) : user?.id === p.owner_id || isAdmin ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: isEditOpen, onOpenChange: setIsEditOpen, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "flex-1 gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }),
              " Editar Projeto"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-3xl max-h-[90vh] overflow-y-auto", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Editar Projeto" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Atualize as informações básicas e detalhes do projeto." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "basic", className: "w-full", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "basic", children: "Básico" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "beneficiary", children: "Beneficiário" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "planning", children: "Planejamento" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "basic", className: "space-y-4 pt-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", children: "Nome do Projeto *" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "name", required: true, value: editForm?.name, onChange: (e) => setEditForm({
                      ...editForm,
                      name: e.target.value
                    }) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "desc", children: "Descrição *" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "desc", required: true, rows: 4, value: editForm?.description, onChange: (e) => setEditForm({
                      ...editForm,
                      description: e.target.value
                    }) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Tipo de melhoria *" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "w-full h-10 rounded-md border border-input bg-background px-3 text-sm", value: editForm?.improvement_type, onChange: (e) => setEditForm({
                        ...editForm,
                        improvement_type: e.target.value
                      }), children: ["Telhado", "Banheiro", "Estrutura", "Cozinha", "Hidráulica", "Elétrica", "Outro"].map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: o }, o)) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Urgência *" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "w-full h-10 rounded-md border border-input bg-background px-3 text-sm", value: editForm?.urgency, onChange: (e) => setEditForm({
                        ...editForm,
                        urgency: e.target.value
                      }), children: ["Baixa", "Média", "Alta", "Emergencial"].map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: o }, o)) })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "loc", children: "Localização *" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "loc", required: true, value: editForm?.location, onChange: (e) => setEditForm({
                      ...editForm,
                      location: e.target.value
                    }) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-4 border-t", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Imagens do Projeto *" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-2", children: editForm?.images?.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group aspect-square", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: u, alt: "", className: "w-full h-full object-cover rounded-md border" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => removeEditImage(u), className: "absolute -top-1 -right-1 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" }) })
                    ] }, u)) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-files", className: "text-xs text-muted-foreground", children: "Adicionar novas imagens" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "edit-files", type: "file", accept: "image/*", multiple: true, onChange: (e) => setEditFiles(Array.from(e.target.files || [])) })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "beneficiary", className: "space-y-4 pt-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "b_name", children: "Nome do Beneficiário *" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "b_name", required: true, value: editForm?.beneficiary_name, onChange: (e) => setEditForm({
                      ...editForm,
                      beneficiary_name: e.target.value
                    }) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "residents", children: "Moradores (opcional)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "residents", type: "number", value: editForm?.beneficiary_residents, onChange: (e) => setEditForm({
                        ...editForm,
                        beneficiary_residents: e.target.value
                      }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "children", children: "Crianças (opcional)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "children", type: "number", value: editForm?.beneficiary_children, onChange: (e) => setEditForm({
                        ...editForm,
                        beneficiary_children: e.target.value
                      }) })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Renda Familiar (opcional)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "w-full h-10 rounded-md border border-input bg-background px-3 text-sm", value: editForm?.beneficiary_income, onChange: (e) => setEditForm({
                      ...editForm,
                      beneficiary_income: e.target.value
                    }), children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Não informado" }),
                      ["Até 1 salário mínimo", "1 a 2 salários mínimos", "2 a 3 salários mínimos", "Mais de 3 salários mínimos", "Sem renda"].map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: o }, o))
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "vulnerability", children: "Vulnerabilidade *" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "vulnerability", required: true, value: editForm?.beneficiary_vulnerability, onChange: (e) => setEditForm({
                      ...editForm,
                      beneficiary_vulnerability: e.target.value
                    }) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "situation", children: "Situação Habitacional *" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "situation", required: true, value: editForm?.beneficiary_situation, onChange: (e) => setEditForm({
                      ...editForm,
                      beneficiary_situation: e.target.value
                    }) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "planning", className: "space-y-4 pt-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "est_cost", children: "Custo Estimado (R$) *" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "est_cost", required: true, type: "number", value: editForm?.estimated_cost, onChange: (e) => setEditForm({
                        ...editForm,
                        estimated_cost: e.target.value
                      }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "fin_goal", children: "Meta Financeira (R$) *" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "fin_goal", required: true, type: "number", value: editForm?.financial_goal, onChange: (e) => setEditForm({
                        ...editForm,
                        financial_goal: e.target.value
                      }) })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "start", children: "Data de Início *" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "start", required: true, type: "date", value: editForm?.start_date, onChange: (e) => setEditForm({
                        ...editForm,
                        start_date: e.target.value
                      }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "end", children: "Previsão de Término *" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "end", required: true, type: "date", value: editForm?.end_date, onChange: (e) => setEditForm({
                        ...editForm,
                        end_date: e.target.value
                      }) })
                    ] })
                  ] })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setIsEditOpen(false), children: "Cancelar" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: saveProject, children: "Salvar Alterações" })
              ] })
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "flex-1 gap-2", onClick: () => document.getElementById("interaction-tabs")?.scrollIntoView({
            behavior: "smooth"
          }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(HandHeart, { className: "h-4 w-4" }),
            " Apoiar"
          ] }) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-3 gap-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2 space-y-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "about", className: "w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "w-full justify-start border-b rounded-none bg-transparent h-auto p-0 mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "about", className: "rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2", children: "Sobre" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "needs", className: "rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2", children: "Necessidades" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "timeline", className: "rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2", children: "Timeline" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "finance", className: "rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2", children: "Financeiro" }),
            user?.id === p.owner_id && /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "management", className: "rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2 text-primary", children: "Gestão" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "about", className: "space-y-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "prose prose-sm max-w-none", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold mb-4", children: "Descrição do Projeto" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "whitespace-pre-wrap text-foreground/80 leading-relaxed", children: p.description })
            ] }),
            p.beneficiary_name && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold mb-4 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5 text-primary" }),
                " Informações do Beneficiário"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase font-semibold", children: "Responsável" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: p.beneficiary_name })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase font-semibold", children: "Moradores" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium", children: [
                    p.beneficiary_residents,
                    " pessoas (",
                    p.beneficiary_children,
                    " crianças)"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase font-semibold", children: "Renda Familiar" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: p.beneficiary_income })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase font-semibold", children: "Vulnerabilidade" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: p.beneficiary_vulnerability })
                ] })
              ] }),
              p.beneficiary_situation && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-1 border-t pt-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase font-semibold", children: "Situação Habitacional" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground/80", children: p.beneficiary_situation })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/20 p-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-sm font-bold flex items-center gap-2 mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4" }),
                  " Cronograma Previsto"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Início:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: p.start_date ? new Date(p.start_date).toLocaleDateString("pt-BR") : "Não definido" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Conclusão:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: p.end_date ? new Date(p.end_date).toLocaleDateString("pt-BR") : "Não definido" })
                  ] })
                ] })
              ] }),
              p.estimated_cost > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/20 p-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-sm font-bold flex items-center gap-2 mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-4 w-4" }),
                  " Custo Estimado"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-primary", children: new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL"
                }).format(p.estimated_cost) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Valor total previsto para a obra" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "needs", className: "space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold", children: "Necessidades do Projeto" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", children: [
                needs.length,
                " itens"
              ] })
            ] }),
            needs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-10 border-2 border-dashed rounded-xl border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Nenhuma necessidade cadastrada." }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: needs.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "mb-2", children: n.type }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-lg", children: n.description })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: n.status === "Atendida" ? "default" : "secondary", className: n.status === "Atendida" ? "bg-green-500" : "", children: n.status }),
                  (user?.id === p.owner_id || isAdmin) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 text-muted-foreground hover:text-primary", onClick: () => {
                      setEditingNeed(n);
                      setIsEditNeedOpen(true);
                    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 text-muted-foreground hover:text-destructive", onClick: () => {
                      setDeletingNeed(n);
                      setIsDeleteNeedOpen(true);
                    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
                  ] })
                ] })
              ] }),
              n.quantity_needed > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Progresso" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    n.quantity_met || 0,
                    " / ",
                    n.quantity_needed
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: (n.quantity_met || 0) / n.quantity_needed * 100 })
              ] }),
              user?.id === p.owner_id && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 pt-4 border-t flex items-center gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Atualizar quantidade atendida:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", className: "w-24 h-8", defaultValue: n.quantity_met || 0, onBlur: (e) => updateNeedProgress(n.id, Number(e.target.value), n.quantity_needed) })
              ] })
            ] }, n.id)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "timeline", className: "space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold mb-4", children: "Linha do Tempo" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-border", children: [
              updates.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground ml-2", children: "O projeto ainda não possui atualizações." }),
              updates.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -left-[29px] top-1.5 h-4 w-4 rounded-full border-2 border-background bg-primary ring-4 ring-background" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: new Date(u.created_at).toLocaleDateString("pt-BR") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground/90 whitespace-pre-wrap", children: u.description })
                ] })
              ] }, u.id)),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -left-[29px] top-1.5 h-4 w-4 rounded-full border-2 border-background bg-muted-foreground ring-4 ring-background" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/20 p-5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: new Date(p.created_at).toLocaleDateString("pt-BR") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold", children: "Projeto criado e enviado para aprovação" })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "finance", className: "space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold mb-4", children: "Transparência Financeira" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-3 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase font-semibold", children: "Arrecadado" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-green-600", children: new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL"
                }).format(donations.reduce((acc, d) => acc + (d.amount || 0), 0)) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase font-semibold", children: "Utilizado" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-destructive", children: new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL"
                }).format(expenses.reduce((acc, e) => acc + (e.amount || 0), 0)) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase font-semibold", children: "Saldo" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold", children: new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL"
                }).format(donations.reduce((acc, d) => acc + (d.amount || 0), 0) - expenses.reduce((acc, e) => acc + (e.amount || 0), 0)) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "font-bold flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "h-4 w-4" }),
                " Histórico de Gastos"
              ] }),
              expenses.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground italic", children: "Nenhuma despesa registrada até o momento." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-left", children: "Data" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-left", children: "Descrição" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-right", children: "Valor" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: expenses.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: new Date(e.date).toLocaleDateString("pt-BR") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: e.description }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-medium", children: new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                  }).format(e.amount) })
                ] }, e.id)) })
              ] }) })
            ] })
          ] }),
          user?.id === p.owner_id && /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "management", className: "space-y-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold", children: "Painel de Gestão do Proprietário" }),
              p.status === "disabled" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-muted-foreground border-dashed", children: "Projeto Encerrado" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: isNeedOpen, onOpenChange: setIsNeedOpen, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
                    " Nova Necessidade"
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Adicionar Necessidade" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Especifique o que o projeto precisa no momento." })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-4", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Tipo *" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "w-full h-10 rounded-md border border-input bg-background px-3 text-sm", value: newNeed.type, onChange: (e) => setNewNeed({
                          ...newNeed,
                          type: e.target.value
                        }), children: NEED_TYPES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: t }, t)) })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Descrição *" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: newNeed.description, onChange: (e) => setNewNeed({
                          ...newNeed,
                          description: e.target.value
                        }), placeholder: "Ex: 50 sacos de cimento" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Quantidade total necessária *" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: newNeed.quantity_needed, onChange: (e) => setNewNeed({
                          ...newNeed,
                          quantity_needed: e.target.value
                        }) })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setIsNeedOpen(false), children: "Cancelar" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: addNeed, children: "Cadastrar" })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: isUpdateOpen, onOpenChange: setIsUpdateOpen, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "h-4 w-4" }),
                    " Nova Atualização"
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Publicar Atualização" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Mantenha os apoiadores informados sobre o progresso." })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-4", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Descrição da Atualização *" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { placeholder: "Descreva o que aconteceu no projeto hoje...", rows: 5, value: newUpdate.description, onChange: (e) => setNewUpdate({
                        description: e.target.value
                      }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setIsUpdateOpen(false), children: "Cancelar" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: addUpdate, children: "Publicar" })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: isExpenseOpen, onOpenChange: setIsExpenseOpen, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "secondary", className: "gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-4 w-4" }),
                    " Registrar Gasto"
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Registrar Gasto / Prestação de Contas" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Registre como os recursos estão sendo utilizados." })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-4", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Data *" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: newExpense.date, onChange: (e) => setNewExpense({
                          ...newExpense,
                          date: e.target.value
                        }) })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Descrição do gasto *" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Ex: Compra de materiais na loja X", value: newExpense.description, onChange: (e) => setNewExpense({
                          ...newExpense,
                          description: e.target.value
                        }) })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Valor (R$) *" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: newExpense.amount, onChange: (e) => setNewExpense({
                          ...newExpense,
                          amount: e.target.value
                        }) })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setIsExpenseOpen(false), children: "Cancelar" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: addExpense, children: "Salvar Gasto" })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: isRevenueOpen, onOpenChange: setIsRevenueOpen, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "secondary", className: "gap-2 bg-green-600 hover:bg-green-700 text-white", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4" }),
                    " Registrar Arrecadação"
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Registrar Arrecadação / Doação Recebida" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Registre valores recebidos fora da plataforma ou doações diretas." })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-4", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Data *" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: newRevenue.date, onChange: (e) => setNewRevenue({
                          ...newRevenue,
                          date: e.target.value
                        }) })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Descrição / Origem *" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Ex: Doação em dinheiro de vizinho", value: newRevenue.description, onChange: (e) => setNewRevenue({
                          ...newRevenue,
                          description: e.target.value
                        }) })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Valor (R$) *" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: newRevenue.amount, onChange: (e) => setNewRevenue({
                          ...newRevenue,
                          amount: e.target.value
                        }) })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setIsRevenueOpen(false), children: "Cancelar" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: addRevenue, children: "Salvar Arrecadação" })
                    ] })
                  ] })
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xl font-bold flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(HandHeart, { className: "h-5 w-5" }),
                " Candidatos a Voluntário"
              ] }),
              volunteers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Nenhuma solicitação de voluntário recebida." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: volunteers.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-lg", children: names[v.user_id] || "Carregando..." }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: new Date(v.created_at).toLocaleString("pt-BR") }),
                      v.skills && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium text-primary", children: [
                        "Habilidade: ",
                        v.skills
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: v.status === "Aprovada" ? "default" : v.status === "Recusada" ? "destructive" : "secondary", children: v.status || "Pendente" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid sm:grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase font-bold", children: "Mensagem" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground/80 bg-muted/30 p-3 rounded-lg border border-border/50", children: v.message })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase font-bold", children: "Contatos" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm space-y-1", children: [
                        v.contact_phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3 w-3" }),
                          " ",
                          v.contact_phone
                        ] }),
                        v.contact_email && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-3 w-3" }),
                          " ",
                          v.contact_email
                        ] })
                      ] })
                    ] }),
                    v.status === "Pendente" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "flex-1", size: "sm", onClick: () => updateVolunteerStatus(v.id, "Aprovada"), children: "Aceitar" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "flex-1", size: "sm", variant: "outline", onClick: () => updateVolunteerStatus(v.id, "Recusada"), children: "Recusar" })
                    ] }),
                    v.status === "Aprovada" && v.contact_phone && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full", size: "sm", variant: "secondary", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `https://wa.me/${v.contact_phone.replace(/\D/g, "")}`, target: "_blank", rel: "noreferrer", children: "Falar no WhatsApp" }) })
                  ] })
                ] })
              ] }, v.id)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-8 border-t", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xl font-bold flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-5 w-5" }),
                " Ofertas de Materiais e Frete"
              ] }),
              requests.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Nenhuma oferta de material ou frete recebida." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: requests.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "capitalize", children: [
                      r.request_type === "material" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-3 w-3 mr-1" }) : r.request_type === "frete" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-3 w-3 mr-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3 w-3 mr-1" }),
                      r.request_type
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold", children: names[r.user_id] || "Carregando..." })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: r.status === "fulfilled" ? "default" : r.status === "cancelled" ? "destructive" : "secondary", children: r.status === "open" ? "Pendente" : r.status === "fulfilled" ? "Aceita" : "Recusada" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground/80 bg-muted/30 p-3 rounded-lg border border-border/50", children: r.description }),
                  r.quantity && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    "Quantidade: ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: r.quantity })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    "Contato: ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: r.contact_info })
                  ] }),
                  r.rejection_reason && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-destructive bg-destructive/5 p-2 rounded border border-destructive/20", children: [
                    "Motivo da recusa: ",
                    r.rejection_reason
                  ] })
                ] }),
                r.status === "open" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "flex-1", size: "sm", onClick: () => updateRequestStatus(r.id, "fulfilled"), children: "Aceitar" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "flex-1", size: "sm", variant: "outline", onClick: () => {
                    setRejectingRequest(r);
                    setRequestRejectionReason("");
                  }, children: "Recusar" })
                ] })
              ] }, r.id)) })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!rejectingRequest, onOpenChange: (open) => !open && setRejectingRequest(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Recusar Oferta de Apoio" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Informe o motivo da recusa para que o apoiador saiba por que a oferta não foi aceita." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-4 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "rejection-reason", children: "Motivo da Recusa *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "rejection-reason", placeholder: "Ex: Já conseguimos este material de outra fonte...", value: requestRejectionReason, onChange: (e) => setRequestRejectionReason(e.target.value), rows: 4 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setRejectingRequest(null), children: "Cancelar" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", disabled: !requestRejectionReason.trim(), onClick: () => {
              updateRequestStatus(rejectingRequest.id, "cancelled", requestRejectionReason);
              setRejectingRequest(null);
            }, children: "Confirmar Recusa" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "interaction-tabs", className: "sticky top-20 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-6 shadow-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-lg mb-4", children: "Como você quer ajudar?" }),
            p.status === "disabled" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted text-muted-foreground p-6 rounded-xl text-center font-medium text-sm border border-dashed", children: "Este projeto foi encerrado pelo proprietário e não está mais aceitando novas ofertas de ajuda ou voluntariado." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "volunteer", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-2 mb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "volunteer", children: "Trabalho" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "donate", children: "Recursos" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "volunteer", className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Ofereça seu tempo e habilidades para ajudar na execução desta melhoria." }),
                user?.id === p.owner_id ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted text-muted-foreground p-4 rounded-xl text-center font-medium text-sm border border-dashed", children: "Você é o proprietário deste projeto." }) : volunteers.some((v) => v.user_id === user?.id) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-primary/10 text-primary p-4 rounded-xl text-center font-medium text-sm", children: "Sua candidatura já foi enviada!" }),
                  volunteers.find((v) => v.user_id === user?.id)?.status !== "Recusada" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "w-full text-destructive hover:text-destructive hover:bg-destructive/10", onClick: () => {
                    const myReq = volunteers.find((v) => v.user_id === user?.id);
                    if (myReq) updateVolunteerStatus(myReq.id, "Recusada");
                  }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 mr-2" }),
                    " Cancelar Candidatura"
                  ] })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: isVolunteerOpen, onOpenChange: setIsVolunteerOpen, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full", children: "Candidatar-se como voluntário" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Candidatura de Voluntário" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Preencha os dados abaixo para que o proprietário possa entrar em contato." })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-4", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Suas habilidades / Profissão *" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Ex: Pedreiro, Eletricista, Ajudante...", value: volunteerForm.skills, onChange: (e) => setVolunteerForm({
                          ...volunteerForm,
                          skills: e.target.value
                        }) })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Telefone / WhatsApp *" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "(00) 00000-0000", value: volunteerForm.contact_phone, onChange: (e) => {
                          const digits = e.target.value.replace(/\D/g, "");
                          let formatted = digits;
                          if (digits.length > 2) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
                          if (digits.length > 7) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
                          setVolunteerForm({
                            ...volunteerForm,
                            contact_phone: formatted
                          });
                        } })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "E-mail" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", placeholder: "seu@email.com", value: volunteerForm.contact_email, onChange: (e) => setVolunteerForm({
                          ...volunteerForm,
                          contact_email: e.target.value
                        }) })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Mensagem de interesse *" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { placeholder: "Conte como você pode ajudar no projeto...", rows: 4, value: volunteerForm.message, onChange: (e) => setVolunteerForm({
                          ...volunteerForm,
                          message: e.target.value
                        }) })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setIsVolunteerOpen(false), children: "Cancelar" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: volunteer, children: "Enviar Candidatura" })
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "donate", className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Doe materiais, frete ou recursos financeiros para o projeto." }),
                user?.id === p.owner_id ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted text-muted-foreground p-4 rounded-xl text-center font-medium text-sm border border-dashed", children: "Você é o proprietário deste projeto." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Tipo de oferta" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "w-full h-10 rounded-md border border-input bg-background px-3 text-sm", value: reqForm.request_type, onChange: (e) => setReqForm({
                      ...reqForm,
                      request_type: e.target.value
                    }), children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "material", children: "Material / Insumos" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "frete", children: "Ajuda de custo / Frete" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "doacao", children: "Doação Financeira" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Descrição da oferta" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { placeholder: "O que você está oferecendo?", rows: 3, value: reqForm.description, onChange: (e) => setReqForm({
                      ...reqForm,
                      description: e.target.value
                    }) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Qtd (opcional)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", placeholder: "Ex: 50", value: reqForm.quantity, onChange: (e) => setReqForm({
                        ...reqForm,
                        quantity: e.target.value
                      }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Valor (R$)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", placeholder: "0,00", value: donationAmt, onChange: (e) => setDonationAmt(e.target.value) })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Seu contato (e-mail/telefone) *" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Como o dono do projeto te acha?", value: reqForm.contact_info, onChange: (e) => setReqForm({
                      ...reqForm,
                      contact_info: e.target.value
                    }) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: submitRequest, className: "w-full", variant: "secondary", children: "Enviar Oferta de Ajuda" })
                ] })
              ] })
            ] })
          ] }),
          ownerPix && p.status !== "disabled" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-6 shadow-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold flex items-center gap-2 mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(QrCode, { className: "h-5 w-5 text-primary" }),
              " Doação Direta (PIX)"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-white rounded-xl border border-border mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(QRCodeSVG, { value: buildPixPayload(ownerPix.pix_key), size: 140 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-center text-muted-foreground mb-4", children: "O valor vai direto para a conta do responsável pelo projeto." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "w-full gap-2", onClick: () => {
                navigator.clipboard.writeText(ownerPix.pix_key);
                toast.success("Chave PIX copiada!");
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-4 w-4" }),
                " Copiar Chave PIX"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-muted/50 p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-sm font-bold flex items-center gap-2 text-destructive mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "h-4 w-4" }),
              " Denunciar Irregularidade"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { placeholder: "Descreva o problema encontrado...", className: "text-xs mb-3", rows: 2, value: reportReason, onChange: (e) => setReportReason(e.target.value) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "w-full text-xs text-destructive hover:bg-destructive/10", onClick: report, children: "Enviar Denúncia" })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isEditNeedOpen, onOpenChange: setIsEditNeedOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Editar Necessidade" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Atualize as informações da necessidade do projeto." })
        ] }),
        editingNeed && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Tipo *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "w-full h-10 rounded-md border border-input bg-background px-3 text-sm", value: editingNeed.type, onChange: (e) => setEditingNeed({
              ...editingNeed,
              type: e.target.value
            }), children: NEED_TYPES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: t }, t)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Descrição *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editingNeed.description, onChange: (e) => setEditingNeed({
              ...editingNeed,
              description: e.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Quantidade total necessária *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: editingNeed.quantity_needed, onChange: (e) => setEditingNeed({
              ...editingNeed,
              quantity_needed: e.target.value
            }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setIsEditNeedOpen(false), children: "Cancelar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: updateNeed, children: "Salvar Alterações" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: isDeleteNeedOpen, onOpenChange: setIsDeleteNeedOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Você tem certeza?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
            'Esta ação não pode ser desfeita. Isso excluirá permanentemente a necessidade "',
            deletingNeed?.description,
            '" do projeto.'
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancelar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: deleteNeed, className: "bg-destructive text-destructive-foreground hover:bg-destructive/90", children: "Excluir" })
        ] })
      ] }) })
    ] })
  ] });
}

export { ProjectDetail as component };
