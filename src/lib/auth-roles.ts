// Custom frontend + database auth (no Supabase Auth).
// Users are stored in `public.app_users`; the active session is stored in localStorage.
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "brand" | "styly_team";

export type SignupProfile = {
  role: AppRole;
  fullName: string;
  brandName?: string;
  website?: string;
  industry?: string;
  description?: string;
  department?: string;
  position?: string;
  phone?: string;
};

export type SessionUser = {
  id: string;
  email: string;
  role: AppRole;
  fullName: string;
};

const SESSION_KEY = "styly_session_user";

// ---------- helpers ----------

export function getDashboardPath(role: AppRole) {
  return role === "brand" ? "/brand-dashboard" : "/styly-team-dashboard";
}

async function hashPassword(password: string): Promise<string> {
  const encoded = new TextEncoder().encode(password);
  const buffer = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

// ---------- session ----------

export function getSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    window.localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

function setSession(user: SessionUser) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
}

// ---------- sign up / sign in ----------

export async function signUp(
  email: string,
  password: string,
  profile: SignupProfile,
): Promise<SessionUser> {
  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail) throw new Error("Email is required.");
  if (password.length < 6) throw new Error("Password must be at least 6 characters.");

  const password_hash = await hashPassword(password);

  const { data, error } = await supabase
    .from("app_users")
    .insert({
      email: cleanEmail,
      password_hash,
      role: profile.role,
      full_name: profile.fullName.trim() || "Styly user",
      brand_name: profile.brandName?.trim() || null,
      industry: profile.industry?.trim() || null,
      website: profile.website?.trim() || null,
      description: profile.description?.trim() || null,
      department: profile.department?.trim() || null,
      position: profile.position?.trim() || null,
      phone: profile.phone?.trim() || null,
    })
    .select("id, email, role, full_name")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("An account with this email already exists. Please sign in instead.");
    }
    throw error;
  }

  const session: SessionUser = {
    id: data.id,
    email: data.email,
    role: data.role as AppRole,
    fullName: data.full_name,
  };
  setSession(session);
  return session;
}

export async function signIn(email: string, password: string): Promise<SessionUser> {
  const cleanEmail = normalizeEmail(email);
  const password_hash = await hashPassword(password);

  const { data, error } = await supabase
    .from("app_users")
    .select("id, email, role, full_name, password_hash")
    .eq("email", cleanEmail)
    .maybeSingle();

  if (error) throw error;
  if (!data || data.password_hash !== password_hash) {
    throw new Error("Invalid email or password.");
  }

  const session: SessionUser = {
    id: data.id,
    email: data.email,
    role: data.role as AppRole,
    fullName: data.full_name,
  };
  setSession(session);
  return session;
}

export function signOut() {
  clearSession();
}
