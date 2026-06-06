import { j as jsxRuntimeExports } from '../_libs/react.mjs';
import { b as useLocation, e as useNavigate, L as Link } from '../_libs/tanstack__react-router.mjs';
import { u as useAuth, S as SidebarTrigger, B as Button } from './router-BVHoRukv.mjs';
import { U as User, e as LogOut } from '../_libs/lucide-react.mjs';

function Header() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const hideSidebar = ["/", "/login", "/signup", "/forgot-password", "/reset-password"].includes(
    location.pathname
  );
  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/login" });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-14 items-center justify-between gap-2 px-4", children: [
    !hideSidebar && /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarTrigger, {}),
    hideSidebar && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: user ? "/dashboard" : "/", className: "font-bold text-lg text-primary", children: "ConstruirJuntos" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 ml-auto", children: user ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/profile", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4 mr-1" }),
        "Perfil"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: handleSignOut, children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }) })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", children: "Entrar" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/signup", children: "Cadastrar" }) })
    ] }) })
  ] }) });
}

export { Header as H };
