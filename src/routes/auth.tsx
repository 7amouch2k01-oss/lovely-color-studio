import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Building2, Loader2, Lock, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import { completePendingSignup, getCurrentRole, getDashboardPath, savePendingSignup, upsertRoleProfile } from "@/lib/auth-roles";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in to Styly" },
      { name: "description", content: "Create or access a Brand or Styly team member dashboard account." },
      { property: "og:title", content: "Sign in to Styly" },
      { property: "og:description", content: "Role-based access for Brand and Styly team dashboards." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function redirectToRole() {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;
    const pendingRole = await completePendingSignup(data.user.id, data.user.email);
    const accountRole = pendingRole ?? (await getCurrentRole());
    if (!accountRole) {
      setError("This account is missing a role. Please sign up again and choose Brand or Styly team member.");
      return;
    }
    navigate({ to: getDashboardPath(accountRole) });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (mode === "signin") {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        await redirectToRole();
        return;
      }

      const profile = {
        role: "brand" as const,
        fullName,
        brandName,
        industry,
      };

      savePendingSignup({ ...profile, email });
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
          data: profile,
        },
      });
      if (signUpError) throw signUpError;

      if (data.session?.user) {
        await upsertRoleProfile(data.session.user.id, profile);
        navigate({ to: getDashboardPath("brand") });
        return;
      }

      setMessage("Check your email to confirm your account, then sign in here to open your dashboard.");
      setMode("signin");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    savePendingSignup({ email, role: "brand", fullName: fullName || "Styly user", brandName, industry });
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/auth` });
    if (result.error) setError(result.error.message);
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--primary),var(--primary-glow))] text-primary-foreground shadow-lg shadow-primary/20">
            <Sparkles className="size-5" />
          </span>
          <span className="text-2xl font-normal tracking-tight">styly</span>
        </Link>
        <Button asChild variant="outline" className="rounded-full"><Link to="/dashboard">Demo dashboard</Link></Button>
      </div>

      <section className="mx-auto grid max-w-6xl gap-8 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <p className="inline-flex rounded-full bg-brand-soft px-4 py-2 text-sm font-medium text-brand-soft-foreground">Role-based access</p>
          <h1 className="mt-6 max-w-2xl text-5xl font-normal tracking-tight sm:text-6xl">Access your Styly workspace</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">Brands get campaign tools. Styly team members get operations controls after login.</p>
        </div>

        <Card className="rounded-3xl shadow-xl shadow-primary/10">
          <CardContent className="p-6 sm:p-8">
            <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-muted p-1">
              {(["signup", "signin"] as const).map((item) => (
                <button key={item} type="button" className={cn("rounded-xl px-4 py-2 text-sm font-medium transition", mode === item ? "bg-card text-foreground shadow-sm" : "text-muted-foreground")} onClick={() => setMode(item)}>
                  {item === "signup" ? "Sign up" : "Sign in"}
                </button>
              ))}
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {mode === "signup" && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <RoleCard active icon={Building2} title="Brand account" />
                  <div className="rounded-2xl border border-border bg-muted p-4 text-left text-muted-foreground">
                    <ShieldCheck className="mb-3 size-5" />
                    <span className="text-sm font-medium">Styly team accounts are invite-only</span>
                  </div>
                </div>
              )}

              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Contact name</Label>
                  <Input id="fullName" value={fullName} onChange={(event) => setFullName(event.target.value)} required placeholder="Your name" />
                </div>
              )}

              {mode === "signup" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="brandName">Brand name</Label>
                    <Input id="brandName" value={brandName} onChange={(event) => setBrandName(event.target.value)} required placeholder="Brand studio" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input id="industry" value={industry} onChange={(event) => setIndustry(event.target.value)} placeholder="Fashion retail" />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative"><Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="email" className="pl-9" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="name@company.com" /></div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative"><Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="password" className="pl-9" type="password" minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} required placeholder="At least 6 characters" /></div>
              </div>

              {error && <p className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
              {message && <p className="rounded-2xl bg-brand-soft px-4 py-3 text-sm text-brand-soft-foreground">{message}</p>}

              <Button type="submit" disabled={loading} className="w-full rounded-full bg-[linear-gradient(135deg,var(--primary),var(--primary-glow))] text-primary-foreground shadow-lg shadow-primary/20">
                {loading && <Loader2 className="animate-spin" />}
                {mode === "signup" ? "Create account" : "Sign in"}
              </Button>
              <Button type="button" variant="outline" className="w-full rounded-full" onClick={handleGoogle}>Continue with Google</Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

function RoleCard({ active, icon: Icon, title, onClick }: { active: boolean; icon: typeof Building2; title: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={cn("rounded-2xl border p-4 text-left transition", active ? "border-primary bg-brand-soft text-brand-soft-foreground" : "bg-card hover:bg-accent")}>
      <Icon className="mb-3 size-5" />
      <span className="text-sm font-medium">{title}</span>
    </button>
  );
}