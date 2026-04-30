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

const pendingSignupKey = "styly_pending_signup_profile";

function getSelfServiceRole(role: AppRole): "brand" | null {
  return role === "brand" ? "brand" : null;
}

export function getDashboardPath(role: AppRole) {
  return role === "brand" ? "/brand-dashboard" : "/styly-team-dashboard";
}

export function savePendingSignup(profile: SignupProfile & { email: string }) {
  if (typeof window === "undefined") return;
  const selfServiceRole = getSelfServiceRole(profile.role);
  if (!selfServiceRole) return;

  window.localStorage.setItem(pendingSignupKey, JSON.stringify({ ...profile, role: selfServiceRole }));
}

export async function getCurrentRole(): Promise<AppRole | null> {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session?.user) return null;

  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", sessionData.session.user.id);

  if (error) throw error;
  const roles = data?.map((item) => item.role) ?? [];
  if (roles.includes("styly_team")) return "styly_team";
  if (roles.includes("brand")) return "brand";
  return null;
}

export async function upsertRoleProfile(userId: string, profile: SignupProfile): Promise<AppRole> {
  const { data: existingRoles, error: roleReadError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);

  if (roleReadError) throw roleReadError;

  const roleList = existingRoles?.map((item) => item.role) ?? [];
  const accountRole = roleList.includes("styly_team") ? "styly_team" : roleList[0] ?? profile.role;

  if (roleList.length === 0) {
    if (profile.role !== "brand") {
      throw new Error("Styly team member accounts must be created by an existing team administrator.");
    }

    const { error: roleError } = await supabase.from("user_roles").insert({
      user_id: userId,
      role: "brand",
    });
    if (roleError) throw roleError;
  }

  if (accountRole === "brand") {
    const { error } = await supabase.from("brand_profiles").upsert(
      {
        user_id: userId,
        brand_name: profile.brandName?.trim() || profile.fullName.trim(),
        contact_name: profile.fullName.trim(),
        website: profile.website?.trim() || null,
        industry: profile.industry?.trim() || null,
        description: profile.description?.trim() || null,
      },
      { onConflict: "user_id" },
    );
    if (error) throw error;
    return accountRole;
  }

  const { error } = await supabase.from("team_member_profiles").upsert(
    {
      user_id: userId,
      full_name: profile.fullName.trim(),
      department: profile.department?.trim() || "Operations",
      position: profile.position?.trim() || "Styly team member",
      phone: profile.phone?.trim() || null,
    },
    { onConflict: "user_id" },
  );
  if (error) throw error;
  return accountRole;
}

export async function completePendingSignup(userId: string, email?: string | null) {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(pendingSignupKey);
  if (!raw) return null;

  let pending: SignupProfile & { email: string };
  try {
    pending = JSON.parse(raw) as SignupProfile & { email: string };
  } catch {
    window.localStorage.removeItem(pendingSignupKey);
    return null;
  }

  if (email && pending.email.toLowerCase() !== email.toLowerCase()) return null;
  if (pending.role !== "brand") {
    window.localStorage.removeItem(pendingSignupKey);
    return null;
  }

  const accountRole = await upsertRoleProfile(userId, pending);
  window.localStorage.removeItem(pendingSignupKey);
  return accountRole;
}

export async function ensureProfileFromUserMetadata(userId: string, metadata: Record<string, unknown>) {
  const role = metadata.role === "brand" || metadata.role === "styly_team" ? metadata.role : null;
  if (!role) return null;

  return upsertRoleProfile(userId, {
    role,
    fullName: String(metadata.fullName ?? metadata.contactName ?? "Styly user"),
    brandName: typeof metadata.brandName === "string" ? metadata.brandName : undefined,
    website: typeof metadata.website === "string" ? metadata.website : undefined,
    industry: typeof metadata.industry === "string" ? metadata.industry : undefined,
    description: typeof metadata.description === "string" ? metadata.description : undefined,
    department: typeof metadata.department === "string" ? metadata.department : undefined,
    position: typeof metadata.position === "string" ? metadata.position : undefined,
    phone: typeof metadata.phone === "string" ? metadata.phone : undefined,
  });
}