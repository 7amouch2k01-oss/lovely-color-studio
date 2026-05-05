import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  LayoutDashboard,
  Loader2,
  LogOut,
  Megaphone,
  Search,
  Send,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import {
  getDashboardPath,
  getSession,
  signOut as clearAuthSession,
  type AppRole,
} from "@/lib/auth-roles";

type Props = {
  role: AppRole;
};

const roleContent = {
  brand: {
    label: "Brand dashboard",
    title: "Grow campaigns with Styly creators",
    intro:
      "Manage your brand presence, discover fashion talent, and track campaign performance from one workspace.",
    metrics: [
      { label: "Active campaigns", value: "12", hint: "3 launching this week" },
      { label: "Creator matches", value: "48", hint: "12 new this month" },
      { label: "Avg. engagement", value: "8.7%", hint: "+1.2% vs last month" },
    ],
    cards: [
      { title: "Campaign planner", detail: "Map launch dates, budgets, deliverables, and review moments for every creator brief." },
      { title: "Influencer discovery", detail: "Shortlist creators by style category, audience fit, location, and recent performance." },
      { title: "Collaboration requests", detail: "Track incoming proposals, approve rates, and move accepted partners into production." },
      { title: "Brand profile", detail: "Keep your public brand story, audience details, visual references, and product focus ready for matching." },
      { title: "Content approvals", detail: "Review submitted looks, captions, usage rights, and final assets before a campaign goes live." },
      { title: "Performance reports", detail: "Compare reach, engagement, creator conversion, and campaign spend across active partnerships." },
    ],
    pipeline: [
      { title: "Spring capsule launch", detail: "5 creators confirmed · shoot starts May 12" },
      { title: "UGC try-on series", detail: "Briefs sent to 8 micro creators · waiting on rates" },
      { title: "Retail pop-up coverage", detail: "Tunis pop-up · 3 days of live coverage planned" },
      { title: "Ramadan styling edit", detail: "Editorial brief locked · awaiting visual references" },
      { title: "Influencer gifting list", detail: "20 creators selected · packages ship next Monday" },
    ],
    actions: [
      { label: "Complete brand story", note: "5 minutes left to finish your public profile" },
      { label: "Upload campaign references", note: "Add mood boards before inviting creators" },
      { label: "Invite finance approver", note: "So budgets clear without delay" },
      { label: "Create new campaign", note: "Start a brief from scratch or template" },
      { label: "Browse creator matches", note: "12 new high-fit profiles waiting" },
      { label: "Download report", note: "Last 30 days, ready to export" },
    ],
    Icon: Building2,
  },
  styly_team: {
    label: "Styly team dashboard",
    title: "Operate the Styly partner network",
    intro:
      "Review brands, manage onboarding, and monitor platform growth across the fashion community.",
    metrics: [
      { label: "Brands", value: "124", hint: "8 pending approval" },
      { label: "Active users", value: "2.8K", hint: "+312 this month" },
      { label: "Profile completion", value: "94%", hint: "Healthy across cohorts" },
    ],
    cards: [
      { title: "Brand approvals", detail: "Validate new brand applications, review category fit, and flag accounts that need follow-up." },
      { title: "Member operations", detail: "Coordinate onboarding tasks, assign ownership, and keep creator support queues moving." },
      { title: "Platform analytics", detail: "Monitor brand growth, campaign velocity, creator match rates, and account health trends." },
      { title: "Team directory", detail: "See who owns each onboarding lane, support queue, campaign review, and partner relationship." },
      { title: "Quality control", detail: "Audit profile completeness, creator match quality, response times, and flagged collaboration risks." },
      { title: "Announcements", detail: "Prepare updates for brands, creators, and internal operators when policies or launches change." },
    ],
    pipeline: [
      { title: "Approve waitlist brands", detail: "8 brands pending · target SLA 24h" },
      { title: "Audit creator match quality", detail: "Review last 50 matched pairs" },
      { title: "Prepare weekly partner report", detail: "Due Friday · metrics + highlights" },
      { title: "Review campaign disputes", detail: "2 open cases need mediation" },
      { title: "Update onboarding checklist", detail: "Add new KYB step for fashion brands" },
    ],
    actions: [
      { label: "Review pending applications", note: "8 brands waiting on approval" },
      { label: "Assign onboarding owners", note: "3 brands without an owner" },
      { label: "Check flagged accounts", note: "2 accounts need a second look" },
      { label: "Open team directory", note: "See ownership and capacity" },
      { label: "Create announcement", note: "Notify brands and creators" },
      { label: "Export partner data", note: "CSV for the leadership review" },
    ],
    Icon: ShieldCheck,
  },
};

const navItems = [
  { id: "overview", label: "Overview", Icon: LayoutDashboard },
  { id: "workspace", label: "Workspace", Icon: BarChart3 },
  { id: "priority", label: "Priority work", Icon: Megaphone },
  { id: "next-steps", label: "Next steps", Icon: CalendarDays },
  { id: "team", label: "Team", Icon: Users },
  { id: "settings", label: "Settings", Icon: Settings },
];

export function ProtectedRoleDashboard({ role }: Props) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteMessage, setInviteMessage] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [inviteForm, setInviteForm] = useState({
    email: "", fullName: "", department: "", position: "", phone: "", note: "",
  });
  const content = roleContent[role];
  const Icon = content.Icon;

  useEffect(() => {
    const session = getSession();
    if (!session) { navigate({ to: "/auth" }); return; }
    if (session.role !== role) { navigate({ to: getDashboardPath(session.role) }); return; }
    setAuthorized(true);
    setLoading(false);
  }, [navigate, role]);

  useEffect(() => {
    if (!authorized) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    navItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [authorized]);

  const visibleNav = navItems.filter((n) => n.id !== "team" || role === "styly_team");

  function signOut() {
    clearAuthSession();
    navigate({ to: "/auth" });
  }

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id);
  }

  async function submitInvite(event: FormEvent) {
    event.preventDefault();
    setInviteLoading(true);
    setInviteMessage("");
    setInviteError("");
    try {
      const tempPassword = Math.random().toString(36).slice(2, 10) + "A1!";
      const encoded = new TextEncoder().encode(tempPassword);
      const buffer = await crypto.subtle.digest("SHA-256", encoded);
      const password_hash = Array.from(new Uint8Array(buffer))
        .map((b) => b.toString(16).padStart(2, "0")).join("");
      const { error } = await supabase.from("app_users").insert({
        email: inviteForm.email.trim().toLowerCase(),
        password_hash,
        role: "styly_team",
        full_name: inviteForm.fullName.trim(),
        department: inviteForm.department.trim() || "Operations",
        position: inviteForm.position.trim() || "Styly team member",
        phone: inviteForm.phone.trim() || null,
      });
      if (error) {
        if (error.code === "23505") throw new Error("An account with this email already exists.");
        throw error;
      }
      setInviteMessage(`Invite created. Temporary password for ${inviteForm.email}: ${tempPassword}`);
      setInviteForm({ email: "", fullName: "", department: "", position: "", phone: "", note: "" });
    } catch (caught) {
      setInviteError(caught instanceof Error ? caught.message : "Could not send this invite. Please try again.");
    } finally {
      setInviteLoading(false);
    }
  }

  if (loading || !authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Loading your workspace...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b bg-card/85 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
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
            <ThemeToggle />
            <Button variant="outline" size="icon" aria-label="Notifications">
              <Bell />
            </Button>
            <Button variant="ghost" onClick={signOut}>
              <LogOut /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <aside className="sticky top-24 hidden h-[calc(100vh-7rem)] w-60 shrink-0 lg:block">
          <nav className="rounded-3xl border bg-card p-3 shadow-sm">
            <p className="px-3 pb-2 pt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Navigate
            </p>
            <ul className="space-y-1">
              {visibleNav.map(({ id, label, Icon: NavIcon }) => {
                const isActive = activeSection === id;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => scrollTo(id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-[linear-gradient(135deg,var(--primary),var(--primary-glow))] text-primary-foreground shadow-md shadow-primary/20"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      )}
                    >
                      <NavIcon className="size-4" />
                      {label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <main className="min-w-0 flex-1 space-y-6">
          <section id="overview" className="scroll-mt-24">
            <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-stretch">
              <div className="overflow-hidden rounded-3xl bg-[radial-gradient(circle_at_top_right,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_38%),linear-gradient(135deg,var(--card),var(--brand-soft))] p-6 shadow-sm sm:p-8">
                <Badge className="rounded-full bg-brand-soft text-brand-soft-foreground hover:bg-brand-soft">
                  {content.label}
                </Badge>
                <h1 className="mt-5 max-w-3xl text-4xl font-normal tracking-tight sm:text-5xl">
                  {content.title}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                  {content.intro}
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {content.metrics.map((m) => (
                    <div key={m.label} className="rounded-2xl border bg-card/80 p-4 shadow-sm">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">{m.label}</p>
                      <p className="mt-1 text-2xl font-normal">{m.value}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{m.hint}</p>
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
          </section>

          <section id="workspace" className="scroll-mt-24">
            <h2 className="mb-4 text-xl font-medium">Workspace</h2>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {content.cards.map((card) => (
                <Card key={card.title} className="rounded-3xl shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-3 text-base">
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
          </section>

          <section id="priority" className="scroll-mt-24">
            <Card className="rounded-3xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="size-5 text-primary" /> Priority work
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {content.pipeline.map((item, index) => (
                  <div key={item.title} className="flex items-start gap-3 rounded-2xl border bg-background p-4">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-medium text-brand-soft-foreground">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          <section id="next-steps" className="scroll-mt-24">
            <Card className="rounded-3xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="size-5 text-primary" /> Next steps
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {content.actions.map((action) => (
                  <div key={action.label} className="rounded-2xl border bg-background p-4">
                    <CheckCircle2 className="mb-3 size-5 text-primary" />
                    <p className="text-sm font-medium leading-5">{action.label}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{action.note}</p>
                    <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock3 className="size-3" /> Ready now
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          {role === "styly_team" && (
            <section id="team" className="scroll-mt-24">
              <Card className="rounded-3xl shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="size-5 text-primary" /> Invite Styly member
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="grid gap-4 lg:grid-cols-2" onSubmit={submitInvite}>
                    <div className="space-y-2">
                      <Label htmlFor="inviteEmail">Email</Label>
                      <Input id="inviteEmail" type="email" required value={inviteForm.email}
                        onChange={(e) => setInviteForm((c) => ({ ...c, email: e.target.value }))}
                        placeholder="member@styly.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inviteFullName">Full name</Label>
                      <Input id="inviteFullName" required minLength={2} value={inviteForm.fullName}
                        onChange={(e) => setInviteForm((c) => ({ ...c, fullName: e.target.value }))}
                        placeholder="Team member name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inviteDepartment">Department</Label>
                      <Input id="inviteDepartment" value={inviteForm.department}
                        onChange={(e) => setInviteForm((c) => ({ ...c, department: e.target.value }))}
                        placeholder="Operations" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="invitePosition">Position</Label>
                      <Input id="invitePosition" value={inviteForm.position}
                        onChange={(e) => setInviteForm((c) => ({ ...c, position: e.target.value }))}
                        placeholder="Partner success lead" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="invitePhone">Phone</Label>
                      <Input id="invitePhone" value={inviteForm.phone}
                        onChange={(e) => setInviteForm((c) => ({ ...c, phone: e.target.value }))}
                        placeholder="Optional" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inviteNote">Invite note</Label>
                      <Textarea id="inviteNote" maxLength={500} value={inviteForm.note}
                        onChange={(e) => setInviteForm((c) => ({ ...c, note: e.target.value }))}
                        placeholder="Optional context for the invite" />
                    </div>
                    <div className="space-y-3 lg:col-span-2">
                      {inviteError && (
                        <p className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{inviteError}</p>
                      )}
                      {inviteMessage && (
                        <p className="rounded-2xl bg-brand-soft px-4 py-3 text-sm text-brand-soft-foreground">{inviteMessage}</p>
                      )}
                      <Button type="submit" disabled={inviteLoading}
                        className="rounded-full bg-[linear-gradient(135deg,var(--primary),var(--primary-glow))] text-primary-foreground shadow-lg shadow-primary/20">
                        {inviteLoading ? <Loader2 className="animate-spin" /> : <Send />}
                        Send invite and grant access
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </section>
          )}

          <section id="settings" className="scroll-mt-24">
            <Card className="rounded-3xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="size-5 text-primary" /> Profile settings
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <Input placeholder={role === "brand" ? "Brand display name" : "Full name"} />
                <Input placeholder={role === "brand" ? "Industry" : "Department"} />
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}
