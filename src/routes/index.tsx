import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero.jpg";
import { HardHat, Heart, Home, Users } from "lucide-react";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img src={heroImg} alt="Voluntários construindo telhado juntos" width={1536} height={1024} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
          </div>
          <div className="relative container mx-auto px-4 py-24 md:py-36">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-accent/30 px-3 py-1 text-xs font-medium text-accent-foreground">
                <HardHat className="h-3.5 w-3.5" /> Plataforma de solidariedade habitacional
              </span>
              <h1 className="mt-6 text-4xl md:text-6xl font-bold leading-tight">
                Construindo lares,<br />transformando vidas.
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Conectamos profissionais voluntários e doadores a projetos de melhoria habitacional em comunidades vulneráveis. Cada telhado, cada parede, cada ato de solidariedade conta.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" asChild><Link to="/projects">Ver projetos</Link></Button>
                <Button size="lg" variant="outline" asChild><Link to="/materials">Doar materiais</Link></Button>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Home, title: "Cadastre projetos", desc: "Comunidades publicam necessidades de melhoria habitacional." },
              { icon: Users, title: "Voluntarie-se", desc: "Engenheiros, arquitetos e construtores oferecem mão de obra." },
              { icon: Heart, title: "Doe materiais", desc: "Compartilhe insumos e recursos com quem precisa." },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <span className="grid h-12 w-12 place-items-center rounded-lg bg-primary/10 text-primary">
                  <f.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-xl font-semibold">{f.title}</h3>
                <p className="mt-2 text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © 2026 ConstruirJuntos — Voluntariado e doações para moradia digna.
      </footer>
    </div>
  );
}
