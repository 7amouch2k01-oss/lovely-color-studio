import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ChartNoAxesColumnIncreasing, Download, ShieldCheck, Sparkles, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Styly Admin Dashboard" },
      {
        name: "description",
        content: "Styly admin dashboard for fashion app users, outfit recommendations, and growth analytics.",
      },
      { property: "og:title", content: "Styly Admin Dashboard" },
      {
        property: "og:description",
        content: "A clean Styly-branded dashboard for managing fashion discovery app operations.",
      },
    ],
  }),
  component: Index,
});

const highlights = [
  { label: "Daily Users", value: "10K+", icon: Users },
  { label: "Outfits Shared", value: "500K+", icon: Sparkles },
  { label: "Growth Signals", value: "24%", icon: ChartNoAxesColumnIncreasing },
];

function Index() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <section className="relative px-4 py-6 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_10%,color-mix(in_oklab,var(--primary)_16%,transparent),transparent_28%),radial-gradient(circle_at_5%_85%,color-mix(in_oklab,var(--primary-glow)_15%,transparent),transparent_32%)]" />
        <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full border bg-card/80 px-4 py-3 shadow-sm backdrop-blur-xl">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--primary),var(--primary-glow))] text-primary-foreground shadow-lg shadow-primary/20">
              <Sparkles className="size-5" />
            </span>
            <span className="text-2xl font-normal tracking-tight">styly</span>
          </Link>
          <Button asChild className="rounded-full bg-[linear-gradient(135deg,var(--primary),var(--primary-glow))] px-5 text-primary-foreground shadow-lg shadow-primary/20">
            <Link to="/auth">
              Sign in
              <ArrowRight />
            </Link>
          </Button>
        </nav>

        <div className="mx-auto grid min-h-[calc(100vh-7rem)] max-w-6xl gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-2 text-sm font-medium text-brand-soft-foreground">
              <span className="size-2 rounded-full bg-primary" />
              Styly admin workspace
            </div>
            <h1 className="mt-6 max-w-3xl text-5xl font-normal tracking-tight sm:text-6xl lg:text-7xl">
              Your fashion app <span className="text-primary">control center</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              A branded dashboard for tracking Styly users, outfit recommendations, community posts, and app download performance.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full bg-[linear-gradient(135deg,var(--primary),var(--primary-glow))] px-7 text-primary-foreground shadow-lg shadow-primary/20">
                <Link to="/auth">
                  Start your account
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-7">
                <Link to="/dashboard">
                  <Download />
                  View app analytics
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border bg-card p-4 shadow-2xl shadow-primary/10">
              <div className="rounded-[1.5rem] bg-brand-soft p-5">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary">Today</p>
                    <p className="text-3xl font-normal">Styly growth</p>
                  </div>
                  <ShieldCheck className="size-10 text-primary" />
                </div>
                <div className="grid gap-3">
                  {highlights.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Card key={item.label} className="rounded-3xl border-0 shadow-sm">
                        <CardContent className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-3">
                            <span className="flex size-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--primary),var(--primary-glow))] text-primary-foreground">
                              <Icon className="size-5" />
                            </span>
                            <span className="font-medium">{item.label}</span>
                          </div>
                          <span className="text-2xl font-normal text-primary">{item.value}</span>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
