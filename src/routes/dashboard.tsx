import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  Bookmark,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  CheckCircle2,
  ChevronRight,
  Eye,
  Heart,
  Home,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Palette,
  Search,
  Settings,
  Shirt,
  Sparkles,
  Smartphone,
  Star,
  TrendingUp,
  Users,
  WandSparkles,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Styly Dashboard" },
      {
        name: "description",
        content: "Admin dashboard for Styly users, outfit recommendations, community posts, and app analytics.",
      },
      { property: "og:title", content: "Styly Dashboard" },
      {
        property: "og:description",
        content: "A Styly-branded admin dashboard for fashion discovery app operations.",
      },
    ],
  }),
  component: DashboardPage,
});

type SectionKey = "overview" | "users" | "outfits" | "community" | "analytics" | "settings";

const navigation = [
  { key: "overview", label: "Overview", icon: Home },
  { key: "users", label: "Users", icon: Users },
  { key: "outfits", label: "Outfit Recommendations", icon: Shirt },
  { key: "community", label: "Community Posts", icon: MessageCircle },
  { key: "analytics", label: "Analytics", icon: ChartNoAxesColumnIncreasing },
  { key: "settings", label: "App Settings", icon: Settings },
] satisfies Array<{ key: SectionKey; label: string; icon: typeof Home }>;

const kpis = [
  { label: "Daily Users", value: "10.8K", trend: "+18.2%", icon: Users },
  { label: "Outfits Shared", value: "512K", trend: "+24.7%", icon: Shirt },
  { label: "Active Stylers", value: "2,847", trend: "+12.4%", icon: Sparkles },
  { label: "Recommendation Accuracy", value: "94%", trend: "+6.1%", icon: CheckCircle2 },
];

const userGrowth = [
  { month: "Jan", users: 4200, outfits: 1800 },
  { month: "Feb", users: 5100, outfits: 2600 },
  { month: "Mar", users: 6900, outfits: 3900 },
  { month: "Apr", users: 8400, outfits: 5200 },
  { month: "May", users: 9600, outfits: 6900 },
  { month: "Jun", users: 10800, outfits: 8300 },
];

const downloads = [
  { platform: "iOS", value: 58 },
  { platform: "Android", value: 42 },
];

const users = [
  { name: "Sarah B.", location: "Tunis", style: "Minimal chic", status: "Active", last: "2 min ago" },
  { name: "Youssef K.", location: "Sfax", style: "Streetwear", status: "Active", last: "9 min ago" },
  { name: "Mariem H.", location: "Sousse", style: "Smart casual", status: "New", last: "18 min ago" },
  { name: "Nour A.", location: "Manouba", style: "Modest fashion", status: "Review", last: "1 hr ago" },
  { name: "Amine R.", location: "Ariana", style: "Classic", status: "Active", last: "3 hrs ago" },
];

const activities = [
  { title: "Mariem saved 8 occasion-based looks", time: "4 min ago", icon: Bookmark },
  { title: "New stylist profile verified in Sousse", time: "16 min ago", icon: CheckCircle2 },
  { title: "AI styling queue generated 1,240 outfits", time: "32 min ago", icon: WandSparkles },
  { title: "Android download campaign crossed target", time: "1 hr ago", icon: Smartphone },
];

const recommendationCards = [
  { title: "Personalized outfits", text: "Daily style matches based on taste, wardrobe, and saved looks.", icon: Shirt, score: "92%" },
  { title: "Occasion-based looks", text: "Work, date, campus, party, and casual-day recommendation flows.", icon: CalendarDays, score: "88%" },
  { title: "AI-powered styling", text: "Learning signals from favorites, follows, and skipped outfits.", icon: WandSparkles, score: "94%" },
  { title: "Saved favorites", text: "Collections that help users revisit and combine preferred outfits.", icon: Heart, score: "71%" },
];

const communityPosts = [
  { author: "Soumaya Sebai", city: "Tunis", likes: "8.2K", status: "Featured", tone: "bg-brand-soft" },
  { author: "Michael Benzo", city: "La Marsa", likes: "6.4K", status: "Review", tone: "bg-muted" },
  { author: "Rania H.", city: "Sousse", likes: "4.9K", status: "Live", tone: "bg-accent" },
];

const analytics = [
  { label: "Landing visits", value: "128.4K", detail: "+21% this month" },
  { label: "App downloads", value: "38.9K", detail: "58% iOS / 42% Android" },
  { label: "CTA clicks", value: "19.6K", detail: "15.3% conversion" },
  { label: "Testimonial engagement", value: "72%", detail: "+9% after section update" },
];

function DashboardPage() {
  const [activeSection, setActiveSection] = useState<SectionKey>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sectionTitle = useMemo(
    () => navigation.find((item) => item.key === activeSection)?.label ?? "Overview",
    [activeSection],
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-[var(--sidebar-width)] border-r bg-sidebar px-4 py-5 shadow-xl transition-transform duration-300 lg:sticky lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
          style={{ "--sidebar-width": "18rem" } as React.CSSProperties}
        >
          <DashboardSidebar
            activeSection={activeSection}
            onSelect={(section) => {
              setActiveSection(section);
              setSidebarOpen(false);
            }}
          />
        </aside>

        {sidebarOpen && (
          <button
            aria-label="Close dashboard navigation"
            className="fixed inset-0 z-30 bg-foreground/30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b bg-background/90 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Open dashboard navigation"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu />
              </Button>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-normal uppercase text-muted-foreground">Styly admin</p>
                <h1 className="truncate text-xl font-medium tracking-tight sm:text-2xl">{sectionTitle}</h1>
              </div>
              <div className="hidden min-w-72 items-center rounded-full border bg-card px-3 py-2 shadow-sm md:flex">
                <Search className="mr-2 size-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Search users, outfits, posts...</span>
              </div>
              <Button variant="outline" size="icon" aria-label="Notifications">
                <Bell />
              </Button>
              <div className="flex size-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--primary),var(--primary-glow))] text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20">
                S
              </div>
            </div>
          </header>

          <div className="px-4 py-6 sm:px-6 lg:px-8">
            {activeSection === "overview" && <OverviewSection />}
            {activeSection === "users" && <UsersSection />}
            {activeSection === "outfits" && <OutfitsSection />}
            {activeSection === "community" && <CommunitySection />}
            {activeSection === "analytics" && <AnalyticsSection />}
            {activeSection === "settings" && <SettingsSection />}
          </div>
        </main>
      </div>
    </div>
  );
}

function DashboardSidebar({
  activeSection,
  onSelect,
}: {
  activeSection: SectionKey;
  onSelect: (section: SectionKey) => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-8 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--primary),var(--primary-glow))] text-primary-foreground shadow-lg shadow-primary/20">
            <Sparkles className="size-5" />
          </span>
          <span className="text-2xl font-medium tracking-tight">styly</span>
        </Link>
        <X className="size-5 text-muted-foreground lg:hidden" />
      </div>

      <div className="mb-5 rounded-2xl bg-brand-soft p-4 text-brand-soft-foreground">
        <p className="text-xs font-normal uppercase">Fashion discovery</p>
        <p className="mt-2 text-sm font-medium">Manage users, recommendations, and community growth.</p>
      </div>

      <nav className="space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = item.key === activeSection;
          return (
            <button
              key={item.key}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-normal transition",
                isActive
                  ? "bg-[linear-gradient(135deg,var(--primary),var(--primary-glow))] text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
              onClick={() => onSelect(item.key)}
            >
              <Icon className="size-5" />
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {isActive && <ChevronRight className="size-4" />}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl bg-foreground p-4 text-background">
        <p className="text-sm font-medium">Ready to publish?</p>
        <p className="mt-1 text-xs opacity-70">Demo data is prepared for investor and team reviews.</p>
      </div>
    </div>
  );
}

function OverviewSection() {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl bg-[radial-gradient(circle_at_top_right,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_38%),linear-gradient(135deg,var(--card),var(--brand-soft))] p-6 shadow-sm sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <Badge className="rounded-full bg-brand-soft text-brand-soft-foreground hover:bg-brand-soft">Styly operations</Badge>
            <h2 className="mt-5 max-w-2xl text-3xl font-normal tracking-tight sm:text-5xl">
              Welcome back, <span className="text-primary">Styly team</span>
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
              Track app growth, style recommendations, and community activity from one clean workspace.
            </p>
          </div>
          <div className="rounded-3xl border bg-card p-5 shadow-xl shadow-primary/10">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-normal text-muted-foreground">Today’s momentum</p>
                <p className="text-3xl font-normal">+24.7%</p>
              </div>
              <TrendingUp className="size-10 text-primary" />
            </div>
            <div className="space-y-3">
              {[82, 64, 91].map((value, index) => (
                <div key={value} className="h-3 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,var(--primary),var(--primary-glow))]"
                    style={{ width: `${value - index * 4}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className="rounded-3xl border-border/80 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
                    <p className="mt-3 text-3xl font-normal">{kpi.value}</p>
                    <p className="mt-2 text-sm font-medium text-primary">{kpi.trend} this month</p>
                  </div>
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-soft text-primary">
                    <Icon className="size-5" />
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.8fr]">
        <Card className="rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle>User growth and outfit engagement</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowth} margin={{ left: -20, right: 8 }}>
                <defs>
                  <linearGradient id="usersFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="users" stroke="var(--primary)" fill="url(#usersFill)" strokeWidth={3} />
                <Area type="monotone" dataKey="outfits" stroke="var(--primary-glow)" fill="transparent" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.title} className="flex gap-3 rounded-2xl bg-muted/60 p-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-card text-primary shadow-sm">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-normal">{activity.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function UsersSection() {
  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Community"
        title="Users across Tunisia"
        text="Search, segment, and review the people discovering their personal style with Styly."
      />
      <Card className="rounded-3xl shadow-sm">
        <CardHeader className="gap-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <CardTitle>User directory</CardTitle>
          <div className="flex items-center rounded-full border bg-background px-3 py-2 md:min-w-80">
            <Search className="mr-2 size-4 text-muted-foreground" />
            <Input className="h-6 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0" placeholder="Search users" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-xs uppercase text-muted-foreground">
                <tr className="border-b">
                  <th className="py-3 font-normal">Name</th>
                  <th className="py-3 font-normal">Location</th>
                  <th className="py-3 font-normal">Style preference</th>
                  <th className="py-3 font-normal">Status</th>
                  <th className="py-3 font-normal">Last active</th>
                  <th className="py-3 font-normal">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.name} className="border-b last:border-0">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--primary),var(--primary-glow))] font-medium text-primary-foreground">
                          {user.name.charAt(0)}
                        </span>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-muted-foreground">{user.location}, Tunisia</td>
                    <td className="py-4 font-medium">{user.style}</td>
                    <td className="py-4">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="py-4 text-muted-foreground">{user.last}</td>
                    <td className="py-4">
                      <Button variant="ghost" size="icon" aria-label={`More actions for ${user.name}`}>
                        <MoreHorizontal />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function OutfitsSection() {
  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="AI styling"
        title="Recommendation engine"
        text="Monitor the outfit categories powering daily styling suggestions and mix-and-match discovery."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {recommendationCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="rounded-3xl shadow-sm">
              <CardContent className="p-5">
                <span className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--primary),var(--primary-glow))] text-primary-foreground">
                  <Icon className="size-6" />
                </span>
                <h3 className="text-lg font-normal">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{card.text}</p>
                <div className="mt-5 flex items-center justify-between rounded-2xl bg-brand-soft px-3 py-2 text-sm font-medium text-brand-soft-foreground">
                  <span>Match score</span>
                  <span>{card.score}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Card className="rounded-3xl shadow-sm">
        <CardHeader>
          <CardTitle>Live suggestion queue</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {["Campus smart casual", "Weekend La Marsa", "Workday neutral layers"].map((look, index) => (
            <div key={look} className="rounded-2xl border bg-card p-4">
              <p className="font-medium">{look}</p>
              <p className="mt-2 text-sm text-muted-foreground">{820 + index * 215} users matched today</p>
              <div className="mt-4 h-2 rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-[linear-gradient(90deg,var(--primary),var(--primary-glow))]"
                  style={{ width: `${74 + index * 8}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function CommunitySection() {
  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Moderation"
        title="Community posts"
        text="Review fashion inspiration posts, feature strong content, and keep the feed polished."
      />
      <div className="grid gap-5 lg:grid-cols-3">
        {communityPosts.map((post) => (
          <Card key={post.author} className="overflow-hidden rounded-3xl shadow-sm">
            <div className={cn("aspect-[4/3] p-4", post.tone)}>
              <div className="flex h-full flex-col justify-between rounded-3xl border bg-card/75 p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <Badge className="rounded-full bg-card text-primary hover:bg-card">{post.status}</Badge>
                  <Heart className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-4xl font-normal text-primary">{post.likes}</p>
                  <p className="text-sm font-normal text-muted-foreground">likes</p>
                </div>
              </div>
            </div>
            <CardContent className="p-5">
              <h3 className="text-lg font-normal">{post.author}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{post.city}, Tunisia</p>
              <div className="mt-5 flex gap-2">
                <Button variant="outline" size="sm"><Eye />Review</Button>
                <Button size="sm"><Star />Feature</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AnalyticsSection() {
  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Growth"
        title="Landing page analytics"
        text="Follow visits, download intent, app-store split, and campaign conversion quality."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {analytics.map((item) => (
          <Card key={item.label} className="rounded-3xl shadow-sm">
            <CardContent className="p-5">
              <p className="text-sm font-normal text-muted-foreground">{item.label}</p>
              <p className="mt-3 text-3xl font-normal">{item.value}</p>
              <p className="mt-2 text-sm font-medium text-primary">{item.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-3xl shadow-sm">
          <CardHeader><CardTitle>Downloads by platform</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={downloads} dataKey="value" nameKey="platform" innerRadius={58} outerRadius={92} paddingAngle={6}>
                  <Cell fill="var(--primary)" />
                  <Cell fill="var(--primary-glow)" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="rounded-3xl shadow-sm">
          <CardHeader><CardTitle>CTA performance</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userGrowth} margin={{ left: -20, right: 8 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="outfits" radius={[10, 10, 0, 0]} fill="var(--primary)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SettingsSection() {
  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Brand"
        title="App settings"
        text="Demo controls for the public landing page, contact details, and app download links."
      />
      <Card className="rounded-3xl shadow-sm">
        <CardContent className="grid gap-5 p-6 md:grid-cols-2">
          {[
            ["App name", "Styly"],
            ["Contact email", "contact@styly.tn"],
            ["Phone", "+216 57 166 068"],
            ["Office", "Technopole route campus universitaire Manouba"],
            ["iOS link", "App Store campaign link"],
            ["Android link", "Google Play campaign link"],
          ].map(([label, value]) => (
            <label key={label} className="space-y-2">
              <span className="text-sm font-medium">{label}</span>
              <Input value={value} readOnly className="h-12 rounded-2xl bg-muted/60" />
            </label>
          ))}
          <div className="md:col-span-2">
            <Button className="rounded-full bg-[linear-gradient(135deg,var(--primary),var(--primary-glow))] px-6 text-primary-foreground shadow-lg shadow-primary/20">
              Save demo settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SectionIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <section className="rounded-3xl bg-brand-soft p-6">
      <Badge className="rounded-full bg-card text-primary hover:bg-card">{eyebrow}</Badge>
      <h2 className="mt-4 text-3xl font-normal tracking-tight sm:text-4xl">{title}</h2>
      <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">{text}</p>
    </section>
  );
}

function StatusBadge({ status }: { status: string }) {
  const className =
    status === "Active"
      ? "bg-success text-success-foreground"
      : status === "New"
        ? "bg-brand-soft text-brand-soft-foreground"
        : "bg-warning text-warning-foreground";

  return <Badge className={cn("rounded-full border-transparent", className)}>{status}</Badge>;
}
