import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2, Lock, Mail, Sparkles } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getDashboardPath, getSession, signIn } from "@/lib/auth-roles";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in to Styly" },
      {
        name: "description",
        content: "Admin access for Styly team and brand dashboards.",
      },
      { property: "og:title", content: "Sign in to Styly" },
      {
        property: "og:description",
        content: "Admin access for Styly team and brand dashboards.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const session = getSession();
    if (session) navigate({ to: getDashboardPath(session.role) });
  }, [navigate]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const session = await signIn(email, password);
      navigate({ to: getDashboardPath(session.role) });
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
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
      </div>

      <section className="mx-auto grid max-w-6xl gap-8 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <p className="inline-flex rounded-full bg-brand-soft px-4 py-2 text-sm font-medium text-brand-soft-foreground">
            Admin access
          </p>
          <h1 className="mt-6 max-w-2xl text-5xl font-normal tracking-tight sm:text-6xl">
            Access your Styly workspace
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
            Sign in to manage brands, track finances, and control store operations.
          </p>
        </div>

        <Card className="rounded-3xl shadow-xl shadow-primary/10">
          <CardContent className="p-6 sm:p-8">
            <h2 className="mb-6 text-center text-xl font-medium">Sign in</h2>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    className="pl-9"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    className="pl-9"
                    type="password"
                    minLength={6}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    placeholder="At least 6 characters"
                  />
                </div>
              </div>

              {error && (
                <p className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[linear-gradient(135deg,var(--primary),var(--primary-glow))] text-primary-foreground shadow-lg shadow-primary/20"
              >
                {loading && <Loader2 className="animate-spin" />}
                Sign in
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
