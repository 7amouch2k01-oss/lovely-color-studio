import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Bell, Building2, LogOut, Search, ShieldCheck, Sparkles, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { completePendingSignup, ensureProfileFromUserMetadata, getCurrentRole, getDashboardPath, type AppRole } from "@/lib/auth-roles";

type Props = {
  role: AppRole;
};

const roleContent = {
  brand: {
    label: "Brand dashboard",
    title: "Grow campaigns with Styly creators",
    intro: "Manage your brand presence, discover fashion talent, and track campaign performance from one workspace.",
    metrics: ["12 active campaigns", "48 creator matches", "8.7% engagement"],
    cards: ["Campaign planner", "Influencer discovery", "Collaboration requests"],
    Icon: Building2,
  },
  styly_team: {
    label: "Styly team dashboard",
    title: "Operate the Styly partner network",
    intro: "Review brands, manage onboarding, and monitor platform growth across the fashion community.",
    metrics: ["124 brands", "2.8K users", "94% profile completion"],
    cards: ["Brand approvals", "Member operations", "Platform analytics"],
    Icon: ShieldCheck,
  },
};

export function ProtectedRoleDashboard({ role }: Props) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const content = roleContent[role];
  const Icon = content.Icon;

  useEffect(() => {
    let mounted = true;

    async function checkAccess() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate({ to: "/auth" });
        return;
      }

      const pendingRole = await completePendingSignup(data.user.id, data.user.email);
      const metadataRole = await ensureProfileFromUserMetadata(data.user.id, data.user.user_metadata ?? {});
      const currentRole = pendingRole ?? metadataRole ?? (await getCurrentRole());

      if (!currentRole) {
        navigate({ to: "/auth" });
        return;
      }

      if (currentRole !== role) {
        navigate({ to: getDashboardPath(currentRole) });
        return;
      }

      if (mounted) {
        setAuthorized(true);
        setLoading(false);
      }
    }

    checkAccess().catch(() => navigate({ to: "/auth" }));
    return () => {
      mounted = false;
    };
  }, [navigate, role]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  if (loading || !authorized) {
    return <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">Loading your workspace...</div>;
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card/85 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--primary),var(--primary-glow))] text-primary-foreground shadow-lg shadow-primary/20">
              <Sparkles className="size-5" />
            </span>
            <span className="text-2xl font-normal tracking-tight">styly</span>
          </Link>
          <div className="hidden min-w-72 items-center rounded-full border bg-background px-3 py-2 md:flex">
            <Search className="mr-2 size-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Search dashboard...</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" aria-label="Notifications"><Bell /></Button>
            <Button variant="ghost" onClick={signOut}><LogOut /> Sign out</Button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-stretch">
          <div className="overflow-hidden rounded-3xl bg-[radial-gradient(circle_at_top_right,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_38%),linear-gradient(135deg,var(--card),var(--brand-soft))] p-6 shadow-sm sm:p-8">
            <Badge className="rounded-full bg-brand-soft text-brand-soft-foreground hover:bg-brand-soft">{content.label}</Badge>
            <h1 className="mt-5 max-w-3xl text-4xl font-normal tracking-tight sm:text-6xl">{content.title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">{content.intro}</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {content.metrics.map((metric) => (
                <div key={metric} className="rounded-2xl border bg-card/80 p-4 shadow-sm">
                  <p className="text-sm font-medium text-muted-foreground">{metric}</p>
                </div>
              ))}
            </div>
          </div>

          <Card className="rounded-3xl shadow-sm">
            <CardContent className="flex h-full flex-col justify-between p-6">
              <span className="flex size-16 items-center justify-center rounded-3xl bg-[linear-gradient(135deg,var(--primary),var(--primary-glow))] text-primary-foreground shadow-lg shadow-primary/20">
                <Icon className="size-8" />
              </span>
              <div className="mt-8">
                <p className="text-sm font-medium text-muted-foreground">Workspace health</p>
                <p className="mt-2 text-4xl font-normal">Excellent</p>
                <p className="mt-2 text-sm text-primary">+18% momentum this month</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {content.cards.map((card) => (
            <Card key={card} className="rounded-3xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-3">
                  {card}
                  <ArrowRight className="size-5 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">Demo tools are ready here and can be connected to live data next.</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6 rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="size-5 text-primary" /> Profile settings</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Input placeholder={role === "brand" ? "Brand display name" : "Full name"} />
            <Input placeholder={role === "brand" ? "Industry" : "Department"} />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}