import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
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
  Wallet,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";

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

const brandCatalog = [
  {
    name: "Zara",
    origin: "Spain · founded 1975",
    category: "Fast fashion · women, men, kids",
    products: 248,
    inStock: 1820,
    bestSeller: "Linen blend blazer",
    priceRange: "59 – 249 TND",
    description:
      "Trend-driven everyday essentials with weekly drops. Strong in tailoring, denim, and seasonal capsules.",
  },
  {
    name: "Zen",
    origin: "Tunisia · local label",
    category: "Modest & casual wear",
    products: 86,
    inStock: 540,
    bestSeller: "Embroidered tunic",
    priceRange: "39 – 159 TND",
    description:
      "Tunisian label focused on modest cuts, breathable fabrics, and modern takes on traditional silhouettes.",
  },
  {
    name: "H&M",
    origin: "Sweden · founded 1947",
    category: "High-street · women, men, kids",
    products: 312,
    inStock: 2140,
    bestSeller: "Oversized cotton tee",
    priceRange: "19 – 179 TND",
    description:
      "Affordable basics and trend pieces refreshed continuously. Strong loungewear and kids ranges.",
  },
  {
    name: "Mango",
    origin: "Spain · founded 1984",
    category: "Contemporary women & men",
    products: 174,
    inStock: 980,
    bestSeller: "Tailored straight trouser",
    priceRange: "49 – 299 TND",
    description:
      "Mediterranean-inspired ready-to-wear. Polished workwear, occasion dresses, and elevated knitwear.",
  },
  {
    name: "Bershka",
    origin: "Spain · founded 1998",
    category: "Youth streetwear",
    products: 142,
    inStock: 870,
    bestSeller: "Cargo wide-leg jeans",
    priceRange: "29 – 169 TND",
    description:
      "Gen-Z streetwear: baggy denim, graphic tees, and statement outerwear at accessible prices.",
  },
  {
    name: "Pull & Bear",
    origin: "Spain · founded 1991",
    category: "Casual youth wear",
    products: 128,
    inStock: 760,
    bestSeller: "Washed denim jacket",
    priceRange: "29 – 189 TND",
    description:
      "Laid-back casualwear with a surf and skate influence. Strong on hoodies, tees, and easy denim.",
  },
];

const roleContent = {
  brand: {
    label: "Brand store dashboard",
    title: "Run your fashion store on Styly",
    intro:
      "Manage your catalog, sync stock, fulfill online orders, and grow your brand inside the Styly multi-brand fashion marketplace.",
    metrics: [
      { label: "Live products", value: "248", hint: "12 added this week" },
      { label: "Orders this week", value: "186", hint: "+22% vs last week" },
      { label: "Conversion rate", value: "3.4%", hint: "+0.6% vs last month" },
    ],
    cards: [
      { title: "Catalog manager", detail: "Add new pieces, organize collections, manage sizes and colors, and schedule seasonal drops." },
      { title: "Inventory & stock", detail: "Track stock per size and warehouse, receive low-stock alerts, and sync with your physical stores." },
      { title: "Orders & fulfillment", detail: "Process online orders, print shipping labels, and update customers on dispatch and delivery." },
      { title: "Promotions & discounts", detail: "Launch promo codes, bundle deals, free-shipping rules, and time-limited sales for your brand page." },
      { title: "Brand storefront", detail: "Customize your brand page on Styly: hero banners, lookbooks, story, and featured products." },
      { title: "Sales analytics", detail: "Compare revenue, top SKUs, returns rate, and customer demographics across all your collections." },
    ],
    pipeline: [
      { title: "Spring collection drop", detail: "42 SKUs scheduled · goes live May 12" },
      { title: "Restock best-sellers", detail: "Linen blazer & wide-leg jeans · low stock" },
      { title: "Eid promo campaign", detail: "20% off selected dresses · banner ready" },
      { title: "Returns review", detail: "6 returns awaiting quality check" },
      { title: "New lookbook upload", detail: "Editorial shoot ready · captions pending" },
    ],
    actions: [
      { label: "Add new product", note: "Bulk import via CSV or add manually" },
      { label: "Update stock levels", note: "Sync from your warehouse system" },
      { label: "Process pending orders", note: "12 orders ready to dispatch" },
      { label: "Launch promo code", note: "Drive traffic for the weekend" },
      { label: "Customize storefront", note: "Refresh hero banner and lookbook" },
      { label: "Download sales report", note: "Last 30 days, ready to export" },
    ],
    Icon: Store,
  },
  styly_team: {
    label: "Styly team dashboard",
    title: "Operate the Styly fashion marketplace",
    intro:
      "Onboard brands, monitor catalog quality, and keep the multi-brand online store running smoothly across every category.",
    metrics: [
      { label: "Partner brands", value: "124", hint: "8 pending approval" },
      { label: "SKUs live", value: "18.4K", hint: "+1.2K this month" },
      { label: "Orders this month", value: "9.3K", hint: "+18% vs last month" },
    ],
    cards: [
      { title: "Brand approvals", detail: "Validate new brand applications, review category fit, product quality, and brand documents." },
      { title: "Catalog operations", detail: "Coordinate product imports, image quality checks, and category mapping across partner brands." },
      { title: "Marketplace analytics", detail: "Monitor GMV, top brands, top categories, return rates, and customer acquisition trends." },
      { title: "Team directory", detail: "See who owns onboarding, catalog QA, customer support, and brand relationships." },
      { title: "Quality control", detail: "Audit listings for image quality, size charts, descriptions, and policy compliance." },
      { title: "Announcements", detail: "Send updates to brands and customers when policies, fees, or campaigns change." },
    ],
    pipeline: [
      { title: "Approve waitlist brands", detail: "8 brands pending · target SLA 24h" },
      { title: "Audit catalog quality", detail: "Review last 200 new product listings" },
      { title: "Plan summer marketplace sale", detail: "All brands · 25% off · launches June 1" },
      { title: "Review customer disputes", detail: "4 open cases · refund/return mediation" },
      { title: "Update size chart standards", detail: "Unify across women, men, kids" },
    ],
    actions: [
      { label: "Review pending applications", note: "8 brands waiting on approval" },
      { label: "Assign onboarding owners", note: "3 brands without an owner" },
      { label: "Check flagged listings", note: "12 listings need a second look" },
      { label: "Open team directory", note: "See ownership and capacity" },
      { label: "Create marketplace announcement", note: "Notify brands and customers" },
      { label: "Export marketplace report", note: "CSV for the leadership review" },
    ],
    Icon: ShieldCheck,
  },
};

const navItems = [
  { id: "overview", label: "Overview", Icon: LayoutDashboard },
  { id: "brands", label: "Brands", Icon: ShoppingBag },
  { id: "finance", label: "Finance", Icon: Wallet },
  { id: "workspace", label: "Workspace", Icon: BarChart3 },
  { id: "priority", label: "Priority work", Icon: Megaphone },
  { id: "next-steps", label: "Next steps", Icon: CalendarDays },
  { id: "team", label: "Team", Icon: Users },
  { id: "settings", label: "Settings", Icon: Settings },
];

type FinancePeriod = "day" | "month" | "year";

const financeData: Record<FinancePeriod, { in: number; out: number; series: { label: string; in: number; out: number }[] }> = {
  day: {
    in: 4820,
    out: 1980,
    series: [
      { label: "08:00", in: 320, out: 120 },
      { label: "11:00", in: 980, out: 410 },
      { label: "14:00", in: 1420, out: 560 },
      { label: "17:00", in: 1240, out: 480 },
      { label: "20:00", in: 860, out: 410 },
    ],
  },
  month: {
    in: 128400,
    out: 54200,
    series: [
      { label: "W1", in: 28400, out: 11200 },
      { label: "W2", in: 31200, out: 13800 },
      { label: "W3", in: 33600, out: 14100 },
      { label: "W4", in: 35200, out: 15100 },
    ],
  },
  year: {
    in: 1480000,
    out: 612000,
    series: [
      { label: "Q1", in: 312000, out: 140000 },
      { label: "Q2", in: 358000, out: 152000 },
      { label: "Q3", in: 384000, out: 158000 },
      { label: "Q4", in: 426000, out: 162000 },
    ],
  },
};

function formatTND(n: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n) + " TND";
}

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

  const [financePeriod, setFinancePeriod] = useState<FinancePeriod>("month");
  const finance = financeData[financePeriod];
  const net = finance.in - finance.out;
  const maxSeries = useMemo(
    () => Math.max(...finance.series.flatMap((s) => [s.in, s.out])),
    [finance],
  );

  const visibleNav = navItems.filter((n) => n.id !== "team" || role === "styly_team");

  function signOut() {
    clearAuthSession();
    navigate({ to: "/auth" });
  }

  function selectSection(id: string) {
    setActiveSection(id);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
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
                      onClick={() => selectSection(id)}
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
          <section id="overview" className={activeSection === "overview" ? "" : "hidden"}>
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

          <section id="brands" className={activeSection === "brands" ? "" : "hidden"}>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-medium">Brands on Styly</h2>
                <p className="text-sm text-muted-foreground">
                  Fashion labels currently selling through the Styly online store.
                </p>
              </div>
              <Badge variant="outline" className="rounded-full">
                {brandCatalog.length} active
              </Badge>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {brandCatalog.map((brand) => (
                <Card key={brand.name} className="rounded-3xl shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-3 text-base">
                      <span className="flex items-center gap-2">
                        <span className="flex size-9 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--primary),var(--primary-glow))] text-sm font-semibold text-primary-foreground">
                          {brand.name.charAt(0)}
                        </span>
                        {brand.name}
                      </span>
                      <Badge variant="secondary" className="rounded-full text-xs">
                        {brand.priceRange}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {brand.origin}
                    </p>
                    <p className="text-sm leading-6 text-muted-foreground">{brand.description}</p>
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div className="rounded-2xl border bg-background p-3">
                        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Products</p>
                        <p className="text-base font-medium">{brand.products}</p>
                      </div>
                      <div className="rounded-2xl border bg-background p-3">
                        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">In stock</p>
                        <p className="text-base font-medium">{brand.inStock}</p>
                      </div>
                      <div className="col-span-2 rounded-2xl border bg-background p-3">
                        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Category</p>
                        <p className="text-sm">{brand.category}</p>
                      </div>
                      <div className="col-span-2 rounded-2xl border bg-background p-3">
                        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Best seller</p>
                        <p className="text-sm">{brand.bestSeller}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section id="finance" className={activeSection === "finance" ? "" : "hidden"}>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-medium">Finance</h2>
                <p className="text-sm text-muted-foreground">
                  Money coming in and going out of your Styly store.
                </p>
              </div>
              <div className="inline-flex rounded-full border bg-card p-1">
                {(["day", "month", "year"] as FinancePeriod[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFinancePeriod(p)}
                    className={cn(
                      "rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors",
                      financePeriod === p
                        ? "bg-[linear-gradient(135deg,var(--primary),var(--primary-glow))] text-primary-foreground shadow"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="rounded-3xl shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base text-muted-foreground">
                    <ArrowDownLeft className="size-5 text-emerald-500" /> Money in
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-normal text-emerald-500">{formatTND(finance.in)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Revenue this {financePeriod}
                  </p>
                </CardContent>
              </Card>
              <Card className="rounded-3xl shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base text-muted-foreground">
                    <ArrowUpRight className="size-5 text-rose-500" /> Money out
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-normal text-rose-500">{formatTND(finance.out)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Expenses this {financePeriod}
                  </p>
                </CardContent>
              </Card>
              <Card className="rounded-3xl shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base text-muted-foreground">
                    <Wallet className="size-5 text-primary" /> Net balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={cn("text-3xl font-normal", net >= 0 ? "text-emerald-500" : "text-rose-500")}>
                    {formatTND(net)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {net >= 0 ? "Positive cash flow" : "Negative cash flow"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6 rounded-3xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Cash flow breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {finance.series.map((row) => (
                    <div key={row.label} className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{row.label}</span>
                        <span>
                          <span className="text-emerald-500">+{formatTND(row.in)}</span>
                          <span className="mx-2">·</span>
                          <span className="text-rose-500">-{formatTND(row.out)}</span>
                        </span>
                      </div>
                      <div className="flex h-2 gap-1">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${(row.in / maxSeries) * 50}%` }}
                        />
                        <div
                          className="h-full rounded-full bg-rose-500"
                          style={{ width: `${(row.out / maxSeries) * 50}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="workspace" className={activeSection === "workspace" ? "" : "hidden"}>
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

          <section id="priority" className={activeSection === "priority" ? "" : "hidden"}>
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

          <section id="next-steps" className={activeSection === "next-steps" ? "" : "hidden"}>
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
            <section id="team" className={activeSection === "team" ? "" : "hidden"}>
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

          <section id="settings" className={activeSection === "settings" ? "" : "hidden"}>
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
