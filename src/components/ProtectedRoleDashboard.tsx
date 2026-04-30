import { Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Bell, Building2, CalendarDays, CheckCircle2, Clock3, Loader2, LogOut, Megaphone, Search, Send, ShieldCheck, Sparkles, TrendingUp, UserPlus, Users } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { completePendingSignup, ensureProfileFromUserMetadata, getCurrentRole, getDashboardPath, type AppRole } from "@/lib/auth-roles";
import { sendStylyMemberInvite } from "@/server/team-invites.functions";

type Props = {
  role: AppRole;
};

const roleContent = {
  brand: {
    label: "Brand dashboard",
    title: "Grow campaigns with Styly creators",
    intro: "Manage your brand presence, discover fashion talent, and track campaign performance from one workspace.",
    metrics: ["12 active campaigns", "48 creator matches", "8.7% engagement"],
    cards: [
      { title: "Campaign planner", detail: "Map launch dates, budgets, deliverables, and review moments for every creator brief." },
      { title: "Influencer discovery", detail: "Shortlist creators by style category, audience fit, location, and recent performance." },
      { title: "Collaboration requests", detail: "Track incoming proposals, approve rates, and move accepted partners into production." },
      { title: "Brand profile", detail: "Keep your public brand story, audience details, visual references, and product focus ready for matching." },
      { title: "Content approvals", detail: "Review submitted looks, captions, usage rights, and final assets before a campaign goes live." },
      { title: "Performance reports", detail: "Compare reach, engagement, creator conversion, and campaign spend across active partnerships." },
    ],
    pipeline: ["Spring capsule launch", "UGC try-on series", "Retail pop-up coverage", "Ramadan styling edit", "Influencer gifting list"],
    actions: ["Complete brand story", "Upload campaign references", "Invite finance approver", "Create new campaign", "Browse creator matches", "Download report"],
    Icon: Building2,
  },
  styly_team: {
    label: "Styly team dashboard",
    title: "Operate the Styly partner network",
    intro: "Review brands, manage onboarding, and monitor platform growth across the fashion community.",
    metrics: ["124 brands", "2.8K users", "94% profile completion"],
    cards: [
      { title: "Brand approvals", detail: "Validate new brand applications, review category fit, and flag accounts that need follow-up." },
      { title: "Member operations", detail: "Coordinate onboarding tasks, assign ownership, and keep creator support queues moving." },
      { title: "Platform analytics", detail: "Monitor brand growth, campaign velocity, creator match rates, and account health trends." },
      { title: "Team directory", detail: "See who owns each onboarding lane, support queue, campaign review, and partner relationship." },
      { title: "Quality control", detail: "Audit profile completeness, creator match quality, response times, and flagged collaboration risks." },
      { title: "Announcements", detail: "Prepare updates for brands, creators, and internal operators when policies or launches change." },
    ],
    pipeline: ["Approve waitlist brands", "Audit creator match quality", "Prepare weekly partner report", "Review campaign disputes", "Update onboarding checklist"],
    actions: ["Review pending applications", "Assign onboarding owners", "Check flagged accounts", "Open team directory", "Create announcement", "Export partner data"],
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
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;

      if (!user) {
        navigate({ to: "/auth" });
        return;
      }

      const pendingRole = await completePendingSignup(user.id, user.email);
      const metadataRole = await ensureProfileFromUserMetadata(user.id, user.user_metadata ?? {});
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

        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {content.cards.map((card) => (
            <Card key={card.title} className="rounded-3xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-3">
                  {card.title}
                  <ArrowRight className="size-5 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">{card.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="rounded-3xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Megaphone className="size-5 text-primary" /> Priority work</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.pipeline.map((item, index) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border bg-background p-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-medium text-brand-soft-foreground">{index + 1}</span>
                  <div>
                    <p className="font-medium">{item}</p>
                    <p className="mt-1 text-sm text-muted-foreground">Scheduled for review this week.</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CalendarDays className="size-5 text-primary" /> Next steps</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              {content.actions.map((action) => (
                <div key={action} className="rounded-2xl border bg-background p-4">
                  <CheckCircle2 className="mb-3 size-5 text-primary" />
                  <p className="text-sm font-medium leading-5">{action}</p>
                  <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground"><Clock3 className="size-3" /> Ready now</p>
                </div>
              ))}
            </CardContent>
          </Card>
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