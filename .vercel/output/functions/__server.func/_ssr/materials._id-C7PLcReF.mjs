import { r as reactExports, j as jsxRuntimeExports } from '../_libs/react.mjs';
import { a as Route$2, u as useAuth, s as supabase, B as Button, I as Input } from './router-BVHoRukv.mjs';
import { H as Header } from './Header-DOxXZI1d.mjs';
import { T as Textarea } from './textarea-DseRLdAv.mjs';
import { L as Label } from './label-xAhoNQXm.mjs';
import { B as Badge } from './badge-BilmNvwk.mjs';
import { t as toast } from '../_libs/sonner.mjs';
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from './alert-dialog-nPhVO9F6.mjs';
import { D as Dialog, f as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from './dialog-BNglQb4Z.mjs';
import { u as uploadImages } from './upload-CaC8vadG.mjs';
import { P as Package, h as CircleCheck, l as Pencil, X, M as MapPin, I as Info, T as Trash2, c as HandHeart, v as Truck } from '../_libs/lucide-react.mjs';
import '../_libs/tanstack__query-core.mjs';
import '../_libs/tanstack__react-query.mjs';
import '../_libs/tanstack__react-router.mjs';
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
import '../_libs/radix-ui__react-alert-dialog.mjs';

function MaterialDetail() {
  const {
    id
  } = Route$2.useParams();
  const {
    user,
    isAdmin
  } = useAuth();
  const [m, setM] = reactExports.useState(null);
  const [requests, setRequests] = reactExports.useState([]);
  const [names, setNames] = reactExports.useState({});
  const [isConfirmOpen, setIsConfirmOpen] = reactExports.useState(false);
  const [isEditOpen, setIsEditOpen] = reactExports.useState(false);
  const [pendingStatus, setPendingStatus] = reactExports.useState(null);
  const [editFiles, setEditFiles] = reactExports.useState([]);
  const [editLoading, setEditLoading] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    quantity: "",
    description: "",
    contact_phone: "",
    contact_email: "",
    address: "",
    needs_freight: false
  });
  const [editForm, setEditForm] = reactExports.useState({
    name: "",
    description: "",
    location: "",
    quantity: 1,
    contact_phone: "",
    contact_email: "",
    condition: "Novo",
    unit: "Unidade",
    images: []
  });
  const loadMaterial = () => supabase.from("materials").select("*").eq("id", id).maybeSingle().then(({
    data
  }) => {
    setM(data);
    if (data) {
      setEditForm({
        name: data.name || "",
        description: data.description || "",
        location: data.location || "",
        quantity: data.quantity || 1,
        contact_phone: data.contact_phone || "",
        contact_email: data.contact_email || "",
        condition: data.condition || "Novo",
        unit: data.unit || "Unidade",
        images: data.images || []
      });
    }
  });
  const loadRequests = () => supabase.from("material_requests").select("*").eq("material_id", id).order("created_at", {
    ascending: false
  }).then(({
    data
  }) => setRequests(data || []));
  reactExports.useEffect(() => {
    loadMaterial();
    loadRequests();
  }, [id]);
  reactExports.useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("phone, address_street, address_number, address_complement, address_neighborhood, address_city, address_state, address_zip").eq("id", user.id).maybeSingle().then(({
      data
    }) => {
      if (!data) return;
      const parts = [data.address_street, data.address_number, data.address_complement, data.address_neighborhood, data.address_city, data.address_state, data.address_zip].filter(Boolean);
      if (parts.length) setForm((f) => ({
        ...f,
        address: parts.join(", ")
      }));
      if (data.phone) setForm((f) => ({
        ...f,
        contact_phone: data.phone || ""
      }));
    });
  }, [user]);
  reactExports.useEffect(() => {
    const ids = [...new Set(requests.map((r) => r.user_id).filter(Boolean))];
    if (!ids.length) return;
    supabase.from("profiles").select("id, display_name").in("id", ids).then(({
      data
    }) => {
      const map = {};
      (data || []).forEach((p) => {
        map[p.id] = p.display_name;
      });
      setNames(map);
    });
  }, [requests]);
  if (!m) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Carregando..." }) })
  ] });
  const isOwner = user?.id === m.owner_id;
  const canEdit = isOwner || isAdmin;
  const submitRequest = async () => {
    if (!user) return toast.error("Faça login para solicitar.");
    if (!form.description.trim()) return toast.error("Descreva sua necessidade.");
    if (!form.contact_phone && !form.contact_email) {
      return toast.error("Informe pelo menos um meio de contato (Telefone ou E-mail).");
    }
    if (!form.address.trim()) return toast.error("Informe o endereço para entrega.");
    const {
      error
    } = await supabase.from("material_requests").insert({
      material_id: id,
      user_id: user.id,
      quantity: form.quantity ? Number(form.quantity) : null,
      description: form.description,
      contact_phone: form.contact_phone,
      contact_email: form.contact_email,
      contact_info: form.contact_phone || form.contact_email,
      address: form.address,
      needs_freight: form.needs_freight
    });
    if (error) return toast.error(error.message);
    toast.success("Solicitação enviada! O doador entrará em contato.");
    setForm({
      quantity: "",
      description: "",
      contact_phone: "",
      contact_email: "",
      address: "",
      needs_freight: false
    });
    loadRequests();
  };
  const cancelRequest = async (requestId) => {
    const {
      error
    } = await supabase.from("material_requests").delete().eq("id", requestId);
    if (error) return toast.error(error.message);
    toast.success("Solicitação cancelada.");
    loadRequests();
  };
  const updateFreightStatus = async (requestId, approved) => {
    const {
      error
    } = await supabase.from("material_requests").update({
      freight_approved: approved
    }).eq("id", requestId);
    if (error) return toast.error(error.message);
    toast.success(approved ? "Frete aprovado!" : "Frete recusado.");
    loadRequests();
  };
  const updateAvailability = async () => {
    if (!pendingStatus) return;
    const {
      error
    } = await supabase.from("materials").update({
      availability_status: pendingStatus
    }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status atualizado!");
    setIsConfirmOpen(false);
    setPendingStatus(null);
    loadMaterial();
  };
  const confirmStatusChange = (status) => {
    setPendingStatus(status);
    setIsConfirmOpen(true);
  };
  const removeEditImage = (url) => {
    setEditForm({
      ...editForm,
      images: (editForm.images || []).filter((u) => u !== url)
    });
  };
  const saveMaterial = async () => {
    if (!editForm.name || !editForm.description || !editForm.location) {
      return toast.error("Preencha os campos obrigatórios.");
    }
    if (!editForm.contact_phone && !editForm.contact_email) {
      return toast.error("Informe pelo menos um meio de contato (Telefone ou E-mail).");
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
        return toast.error("O material deve ter pelo menos uma imagem.");
      }
      const {
        error
      } = await supabase.from("materials").update({
        name: editForm.name,
        description: editForm.description,
        location: editForm.location,
        quantity: Number(editForm.quantity),
        contact_phone: editForm.contact_phone,
        contact_email: editForm.contact_email,
        contact_info: editForm.contact_phone || editForm.contact_email,
        // Compatibility
        condition: editForm.condition,
        unit: editForm.unit,
        images
      }).eq("id", id);
      if (error) throw error;
      toast.success("Material atualizado!");
      setIsEditOpen(false);
      setEditFiles([]);
      loadMaterial();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setEditLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 container mx-auto max-w-5xl px-4 py-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl overflow-hidden border border-border bg-muted aspect-video", children: m.images?.[0] ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: m.images[0], alt: "", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-12 w-12" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-2", children: m.images?.slice(1, 5).map((u, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: u, alt: "", className: "aspect-square rounded-xl object-cover border border-border" }, i)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
              " ",
              m.condition || "Estado não inf."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", children: m.availability_status || "Disponível" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl md:text-4xl font-bold", children: m.name }),
            canEdit && /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: isEditOpen, onOpenChange: setIsEditOpen, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }),
                " Editar Detalhes"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Editar Material" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Atualize as informações do seu anúncio de material." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 py-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-name", children: "Nome do Material *" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "edit-name", value: editForm.name, onChange: (e) => setEditForm({
                      ...editForm,
                      name: e.target.value
                    }) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Estado de Conservação" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "w-full h-10 rounded-md border border-input bg-background px-3 text-sm", value: editForm.condition, onChange: (e) => setEditForm({
                        ...editForm,
                        condition: e.target.value
                      }), children: ["Novo", "Seminovo", "Usado"].map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: o }, o)) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Unidade de Medida" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "w-full h-10 rounded-md border border-input bg-background px-3 text-sm", value: editForm.unit, onChange: (e) => setEditForm({
                        ...editForm,
                        unit: e.target.value
                      }), children: ["Unidade", "Quilograma", "Metro", "Litro", "Saco"].map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: o }, o)) })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-qty", children: "Quantidade" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "edit-qty", type: "number", min: 1, value: editForm.quantity, onChange: (e) => setEditForm({
                        ...editForm,
                        quantity: Number(e.target.value)
                      }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-loc", children: "Localização *" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "edit-loc", value: editForm.location, onChange: (e) => setEditForm({
                        ...editForm,
                        location: e.target.value
                      }) })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-desc", children: "Descrição *" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "edit-desc", rows: 4, value: editForm.description, onChange: (e) => setEditForm({
                      ...editForm,
                      description: e.target.value
                    }) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-4 border-t", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Imagens do Material *" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-2", children: editForm?.images?.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group aspect-square", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: u, alt: "", className: "w-full h-full object-cover rounded-md border" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => removeEditImage(u), className: "absolute -top-1 -right-1 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" }) })
                    ] }, u)) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-files", className: "text-xs text-muted-foreground", children: "Adicionar novas imagens" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "edit-files", type: "file", accept: "image/*", multiple: true, onChange: (e) => setEditFiles(Array.from(e.target.files || [])) })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-4 border-t", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider", children: "Meios de Contato (Informe pelo menos um)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-phone", children: "Telefone / WhatsApp" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "edit-phone", type: "tel", placeholder: "(00) 00000-0000", value: editForm.contact_phone, onChange: (e) => {
                          const digits = e.target.value.replace(/\D/g, "");
                          let formatted = digits;
                          if (digits.length > 2) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
                          if (digits.length > 7) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
                          setEditForm({
                            ...editForm,
                            contact_phone: formatted
                          });
                        } })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-email", children: "E-mail" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "edit-email", type: "email", placeholder: "seu@email.com", value: editForm.contact_email, onChange: (e) => setEditForm({
                          ...editForm,
                          contact_email: e.target.value
                        }) })
                      ] })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setIsEditOpen(false), children: "Cancelar" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: saveMaterial, disabled: editLoading, children: editLoading ? "Salvando..." : "Salvar Alterações" })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4" }),
              m.location
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-4 w-4" }),
              "Quantidade: ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { className: "text-foreground ml-1", children: [
                m.quantity,
                " ",
                m.unit || "unid."
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 p-5 rounded-xl border border-border bg-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2", children: "Descrição do Doador" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "whitespace-pre-wrap text-foreground/90", children: m.description })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase font-semibold", children: "Contato Direto" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: m.contact_info })
            ] })
          ] }),
          isOwner && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold", children: "Gerenciar disponibilidade:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: m.availability_status === "Disponível" ? "default" : "outline", onClick: () => confirmStatusChange("Disponível"), children: "Disponível" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: m.availability_status === "Reservado" ? "default" : "outline", onClick: () => confirmStatusChange("Reservado"), children: "Reservado" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: m.availability_status === "Doado" ? "default" : "outline", onClick: () => confirmStatusChange("Doado"), children: "Já Doado" })
            ] })
          ] })
        ] })
      ] }),
      !isOwner && m.availability_status === "Disponível" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 rounded-2xl border border-border bg-card p-8 shadow-sm max-w-3xl", children: requests.some((r) => r.user_id === user?.id) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-green-100 text-green-700 p-4 rounded-xl flex items-center justify-center gap-2 font-medium", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-5 w-5" }),
          " Você já demonstrou interesse neste material!"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "O doador já recebeu seus dados e entrará em contato em breve." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "text-destructive hover:text-destructive", onClick: () => {
          const myReq = requests.find((r) => r.user_id === user?.id);
          if (myReq) cancelRequest(myReq.id);
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 mr-2" }),
          " Desfazer Interesse"
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold inline-flex items-center gap-2 text-2xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(HandHeart, { className: "h-6 w-6 text-primary" }),
            " Solicitar este material"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2", children: "Conte por que você precisa deste material e como ele ajudará na sua melhoria habitacional." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "req-qty", children: [
              "Quantidade que você precisa (",
              m.unit || "unid.",
              ")"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "req-qty", type: "number", min: 1, max: m.quantity, placeholder: `Ex: ${m.quantity}`, value: form.quantity, onChange: (e) => setForm({
              ...form,
              quantity: e.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "req-phone", children: "Telefone / WhatsApp" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "req-phone", placeholder: "(00) 00000-0000", value: form.contact_phone, onChange: (e) => {
              const digits = e.target.value.replace(/\D/g, "");
              let formatted = digits;
              if (digits.length > 2) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
              if (digits.length > 7) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
              setForm({
                ...form,
                contact_phone: formatted
              });
            } })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "req-email", children: "E-mail" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "req-email", type: "email", placeholder: "seu@email.com", value: form.contact_email, onChange: (e) => setForm({
              ...form,
              contact_email: e.target.value
            }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "req-desc", children: "Explique sua necessidade" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "req-desc", rows: 4, placeholder: "Conte brevemente sua história e o uso que dará ao material...", value: form.description, onChange: (e) => setForm({
            ...form,
            description: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "req-address", children: "Endereço para entrega" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "req-address", placeholder: "Rua, número, bairro, cidade – UF", value: form.address, onChange: (e) => setForm({
            ...form,
            address: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center space-x-2 bg-muted/50 p-3 rounded-lg border border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", id: "freight", className: "h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary", checked: form.needs_freight, onChange: (e) => setForm({
            ...form,
            needs_freight: e.target.checked
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "freight", className: "text-sm font-medium flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-4 w-4" }),
            " Preciso de ajuda com o frete / transporte"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: submitRequest, className: "mt-8 w-full sm:w-auto px-8", size: "lg", children: "Enviar Solicitação" })
      ] }) }),
      isOwner && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-2xl font-bold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-6 w-6 text-primary" }),
          " Interessados neste material (",
          requests.length,
          ")"
        ] }),
        requests.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12 border-2 border-dashed rounded-2xl border-border bg-muted/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Ninguém solicitou este material ainda." }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: requests.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-6 flex flex-col md:flex-row justify-between gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-lg", children: names[r.user_id] || "Carregando..." }),
              r.needs_freight && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-orange-600 border-orange-600 gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-3 w-3" }),
                  " Precisa de Frete"
                ] }),
                r.freight_approved === true ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-green-600 hover:bg-green-600 text-white border-transparent gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
                  " Frete Aprovado"
                ] }) : r.freight_approved === false ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", className: "gap-1", children: "Frete Recusado" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", className: "h-7 px-2 text-[10px] bg-green-600 hover:bg-green-700", onClick: () => updateFreightStatus(r.id, true), children: "Aprovar Frete" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", className: "h-7 px-2 text-[10px]", onClick: () => updateFreightStatus(r.id, false), children: "Recusar" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground/80 bg-muted/30 p-3 rounded-lg mb-3", children: r.description }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Qtd solicitada:" }),
                " ",
                r.quantity || "Não inf."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Contato:" }),
                " ",
                r.contact_info
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "sm:col-span-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Endereço:" }),
                " ",
                r.address
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 flex flex-col justify-between items-end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: new Date(r.created_at).toLocaleDateString("pt-BR") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "secondary", asChild: true, className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `https://wa.me/${r.contact_info.replace(/\D/g, "").trim()}`, target: "_blank", rel: "noreferrer", children: "Falar com Interessado" }) })
          ] })
        ] }, r.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: isConfirmOpen, onOpenChange: setIsConfirmOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Confirmar alteração de status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
            'Você tem certeza que deseja alterar o status deste material para "',
            pendingStatus,
            '"?'
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { onClick: () => setPendingStatus(null), children: "Cancelar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: updateAvailability, children: "Confirmar" })
        ] })
      ] }) })
    ] })
  ] });
}

export { MaterialDetail as component };
