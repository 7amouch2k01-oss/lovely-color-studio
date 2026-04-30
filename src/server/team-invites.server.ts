import { createClient } from "@supabase/supabase-js";

import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Database } from "@/integrations/supabase/types";

export type InviteStylyMemberInput = {
  email: string;
  fullName: string;
  department?: string;
  position?: string;
  phone?: string;
  note?: string;
  accessToken: string;
  redirectTo?: string;
};

function createUserClient(accessToken: string) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !publishableKey) {
    throw new Error("Backend authentication is not configured.");
  }

  return createClient<Database>(supabaseUrl, publishableKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

async function findUserByEmail(email: string) {
  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;

    const user = data.users.find(
      (candidate) => candidate.email?.toLowerCase() === email.toLowerCase(),
    );
    if (user) return user;
    if (data.users.length < 1000) return null;
  }

  return null;
}

export async function inviteStylyMember(input: InviteStylyMemberInput) {
  const userClient = createUserClient(input.accessToken);
  const { data: userData, error: userError } = await userClient.auth.getUser(input.accessToken);
  if (userError || !userData.user)
    throw new Error("Please sign in again before sending an invite.");

  const { data: isTeamMember, error: roleError } = await userClient.rpc("has_role", {
    _user_id: userData.user.id,
    _role: "styly_team",
  });
  if (roleError) throw roleError;
  if (!isTeamMember) throw new Error("Only Styly team members can invite team accounts.");

  const normalizedEmail = input.email.trim().toLowerCase();
  const existingUser = await findUserByEmail(normalizedEmail);
  const inviteMetadata = {
    role: "styly_team",
    fullName: input.fullName.trim(),
    department: input.department?.trim() || "Operations",
    position: input.position?.trim() || "Styly team member",
    phone: input.phone?.trim() || undefined,
    invitedBy: userData.user.id,
    inviteNote: input.note?.trim() || undefined,
  };

  let invitedUserId = existingUser?.id;
  let emailSent = false;

  if (!invitedUserId) {
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(normalizedEmail, {
      redirectTo: input.redirectTo,
      data: inviteMetadata,
    });
    if (error) throw error;
    invitedUserId = data.user?.id;
    emailSent = true;
  }

  if (!invitedUserId) throw new Error("Could not create the invited member account.");

  const { data: existingRole, error: existingRoleError } = await supabaseAdmin
    .from("user_roles")
    .select("id")
    .eq("user_id", invitedUserId)
    .eq("role", "styly_team")
    .maybeSingle();
  if (existingRoleError) throw existingRoleError;

  if (!existingRole) {
    const { error: roleInsertError } = await supabaseAdmin.from("user_roles").insert({
      user_id: invitedUserId,
      role: "styly_team",
    });
    if (roleInsertError) throw roleInsertError;
  }

  const { error: profileError } = await supabaseAdmin.from("team_member_profiles").upsert(
    {
      user_id: invitedUserId,
      full_name: input.fullName.trim(),
      department: inviteMetadata.department,
      position: inviteMetadata.position,
      phone: input.phone?.trim() || null,
    },
    { onConflict: "user_id" },
  );
  if (profileError) throw profileError;

  return {
    email: normalizedEmail,
    emailSent,
    message: emailSent
      ? "Invite sent and Styly team access granted."
      : "This user already exists, so Styly team access was granted.",
  };
}
